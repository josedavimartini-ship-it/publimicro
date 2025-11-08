import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * POST /api/verification/check-cpf
 * Validate CPF using Serpro API (Brazilian government database)
 * 
 * This requires SERPRO_API_KEY environment variable
 * Serpro pricing: ~R$0.10 per query
 * 
 * API Docs: https://www.serpro.gov.br/menu/quem-somos/governanca/certificado-digital/apis
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado.' },
        { status: 401 }
      );
    }

    // Get verification record
    const { data: verification, error: verifyError } = await supabase
      .from('user_verifications')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (verifyError || !verification) {
      return NextResponse.json(
        { error: 'Verificação não encontrada.' },
        { status: 404 }
      );
    }

    if (!verification.cpf) {
      return NextResponse.json(
        { error: 'CPF não fornecido.' },
        { status: 400 }
      );
    }

    // Check if Serpro API key is configured
    const serproApiKey = process.env.SERPRO_API_KEY;
    if (!serproApiKey) {
      console.error('SERPRO_API_KEY not configured');
      
      // In development, simulate validation
      if (process.env.NODE_ENV === 'development') {
        const mockResult = {
          cpf_valid: true,
          cpf_status: 'regular',
          name_match: true,
        };

        await supabase
          .from('user_verifications')
          .update({
            cpf_valid: mockResult.cpf_valid,
            cpf_status: mockResult.cpf_status,
            external_check_provider: 'serpro_mock',
            external_check_response: mockResult,
            updated_at: new Date().toISOString(),
          })
          .eq('id', verification.id);

        return NextResponse.json({
          message: 'CPF validado (modo desenvolvimento).',
          ...mockResult,
        });
      }

      return NextResponse.json(
        { error: 'Serviço de validação de CPF não configurado.' },
        { status: 503 }
      );
    }

    // Call Serpro CPF validation API
    const cpfClean = verification.cpf.replace(/\D/g, '');
    const serproUrl = `https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v1/cpf/${cpfClean}`;

    const serproResponse = await fetch(serproUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${serproApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!serproResponse.ok) {
      const errorData = await serproResponse.json().catch(() => ({}));
      console.error('Serpro API error:', errorData);
      
      return NextResponse.json(
        { error: 'Erro ao validar CPF. Tente novamente.' },
        { status: 500 }
      );
    }

    const serproData = await serproResponse.json();

    // Serpro response structure:
    // {
    //   "ni": "12345678900", // CPF
    //   "nome": "NOME COMPLETO",
    //   "situacao": { "codigo": "0", "descricao": "REGULAR" },
    //   "nascimento": "01011980"
    // }

    const cpfValid = serproData.situacao?.codigo === '0';
    const cpfStatus = serproData.situacao?.descricao?.toLowerCase() || 'unknown';
    
    // Check if name matches (fuzzy matching)
    const nameMatch = verification.full_name 
      ? serproData.nome?.toLowerCase().includes(verification.full_name.toLowerCase())
      : false;

    // Update verification record
    await supabase
      .from('user_verifications')
      .update({
        cpf_valid: cpfValid,
        cpf_status: cpfStatus,
        external_check_provider: 'serpro',
        external_check_id: cpfClean,
        external_check_response: serproData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', verification.id);

    // Log event
    await supabase.from('verification_audit_log').insert({
      user_verification_id: verification.id,
      user_id: user.id,
      event_type: 'automated_check_completed',
      performed_by_type: 'system',
      event_data: {
        check_type: 'cpf_validation',
        provider: 'serpro',
        result: cpfValid ? 'valid' : 'invalid',
        name_match: nameMatch,
      },
    });

    return NextResponse.json({
      message: cpfValid ? 'CPF válido.' : 'CPF inválido ou com restrições.',
      cpf_valid: cpfValid,
      cpf_status: cpfStatus,
      name_match: nameMatch,
      next_step: 'criminal_check',
    });

  } catch (error) {
    console.error('Error checking CPF:', error);
    return NextResponse.json(
      { error: 'Erro ao validar CPF. Tente novamente.' },
      { status: 500 }
    );
  }
}
