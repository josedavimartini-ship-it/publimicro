import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * POST /api/verification/check-criminal
 * Check criminal background using Serasa Experian API
 * 
 * This requires SERASA_API_KEY and SERASA_API_SECRET environment variables
 * Serasa pricing: R$5-15 per background check depending on depth
 * 
 * API Docs: https://desenvolvedores.serasaexperian.com.br/
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

    if (!verification.cpf || !verification.cpf_valid) {
      return NextResponse.json(
        { error: 'CPF deve ser validado primeiro.' },
        { status: 400 }
      );
    }

    // Check if Serasa API credentials are configured
    const serasaApiKey = process.env.SERASA_API_KEY;
    const serasaApiSecret = process.env.SERASA_API_SECRET;

    if (!serasaApiKey || !serasaApiSecret) {
      console.error('SERASA_API_KEY or SERASA_API_SECRET not configured');

      // In development, simulate background check
      if (process.env.NODE_ENV === 'development') {
        const mockResult = {
          criminal_record_status: 'clean',
          criminal_record_details: {
            has_pending_cases: false,
            has_convictions: false,
            serious_crimes: false,
            checked_at: new Date().toISOString(),
          },
          credit_score: 750,
          credit_status: 'good',
          credit_restrictions: [],
        };

        await supabase
          .from('user_verifications')
          .update({
            criminal_record_status: mockResult.criminal_record_status,
            criminal_record_details: mockResult.criminal_record_details,
            criminal_check_date: new Date().toISOString(),
            credit_score: mockResult.credit_score,
            credit_status: mockResult.credit_status,
            credit_restrictions: mockResult.credit_restrictions,
            credit_check_date: new Date().toISOString(),
            status: 'checking', // Trigger auto-verification rules
            updated_at: new Date().toISOString(),
          })
          .eq('id', verification.id);

        return NextResponse.json({
          message: 'Verificação de antecedentes concluída (modo desenvolvimento).',
          ...mockResult,
        });
      }

      return NextResponse.json(
        { error: 'Serviço de verificação de antecedentes não configurado.' },
        { status: 503 }
      );
    }

    // Get Serasa OAuth token
    const tokenResponse = await fetch('https://auth.serasaexperian.com.br/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${serasaApiKey}:${serasaApiSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      console.error('Failed to get Serasa token');
      return NextResponse.json(
        { error: 'Erro ao autenticar com serviço de verificação.' },
        { status: 500 }
      );
    }

    const { access_token } = await tokenResponse.json();

    // Call Serasa Background Check API
    const cpfClean = verification.cpf.replace(/\D/g, '');
    const serasaUrl = 'https://api.serasaexperian.com.br/background-check/v1/consulta';

    const serasaResponse = await fetch(serasaUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cpf: cpfClean,
        nome: verification.full_name,
        data_nascimento: verification.date_of_birth,
        checks: [
          'criminal_record',      // Antecedentes criminais
          'pending_cases',        // Processos pendentes
          'credit_score',         // Score de crédito
          'credit_restrictions',  // Restrições financeiras (SPC/Serasa)
        ],
      }),
    });

    if (!serasaResponse.ok) {
      const errorData = await serasaResponse.json().catch(() => ({}));
      console.error('Serasa API error:', errorData);
      
      return NextResponse.json(
        { error: 'Erro ao verificar antecedentes. Tente novamente.' },
        { status: 500 }
      );
    }

    const serasaData = await serasaResponse.json();

    // Parse Serasa response and categorize criminal history
    let criminalRecordStatus: string = 'clean';
    const criminalDetails: any = {
      has_pending_cases: false,
      has_convictions: false,
      serious_crimes: false,
      convictions: [],
      pending_cases: [],
      checked_at: new Date().toISOString(),
    };

    // Check for serious crimes (murder, rape, kidnapping, etc.)
    const seriousCrimeKeywords = [
      'homicídio', 'latrocínio', 'estupro', 'sequestro', 'extorsão',
      'tráfico de drogas', 'associação criminosa', 'organização criminosa'
    ];

    if (serasaData.criminal_record?.convictions?.length > 0) {
      criminalDetails.has_convictions = true;
      criminalDetails.convictions = serasaData.criminal_record.convictions;

      const hasSeriousCrimes = serasaData.criminal_record.convictions.some((conviction: any) =>
        seriousCrimeKeywords.some(keyword => 
          conviction.crime_type?.toLowerCase().includes(keyword)
        )
      );

      if (hasSeriousCrimes) {
        criminalRecordStatus = 'serious_crimes';
      } else {
        criminalRecordStatus = 'criminal_history';
      }
    }

    if (serasaData.pending_cases?.cases?.length > 0) {
      criminalDetails.has_pending_cases = true;
      criminalDetails.pending_cases = serasaData.pending_cases.cases;
      
      if (criminalRecordStatus === 'clean') {
        criminalRecordStatus = 'pending_cases';
      }
    }

    // Parse credit information
    const creditScore = serasaData.credit_score?.score || null;
    let creditStatus = 'not_checked';
    
    if (creditScore !== null) {
      if (creditScore >= 800) creditStatus = 'excellent';
      else if (creditScore >= 600) creditStatus = 'good';
      else if (creditScore >= 400) creditStatus = 'fair';
      else creditStatus = 'poor';
    }

    const creditRestrictions = serasaData.credit_restrictions?.restrictions || [];
    if (creditRestrictions.length > 0) {
      creditStatus = 'restricted';
    }

    // Update verification record with results
    // Setting status to 'checking' will trigger the auto-verification rules
    await supabase
      .from('user_verifications')
      .update({
        criminal_record_status: criminalRecordStatus,
        criminal_record_details: criminalDetails,
        criminal_check_date: new Date().toISOString(),
        credit_score: creditScore,
        credit_status: creditStatus,
        credit_restrictions: creditRestrictions,
        credit_check_date: new Date().toISOString(),
        external_check_provider: 'serasa',
        external_check_response: serasaData,
        status: 'checking', // This triggers the auto-verification rules
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
        check_type: 'criminal_background',
        provider: 'serasa',
        criminal_record_status: criminalRecordStatus,
        credit_status: creditStatus,
        has_convictions: criminalDetails.has_convictions,
        has_pending_cases: criminalDetails.has_pending_cases,
      },
    });

    return NextResponse.json({
      message: 'Verificação de antecedentes concluída.',
      criminal_record_status: criminalRecordStatus,
      criminal_details: {
        has_convictions: criminalDetails.has_convictions,
        has_pending_cases: criminalDetails.has_pending_cases,
        serious_crimes: criminalDetails.serious_crimes,
      },
      credit_score: creditScore,
      credit_status: creditStatus,
      next_step: 'face_verification',
    });

  } catch (error) {
    console.error('Error checking criminal background:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar antecedentes. Tente novamente.' },
      { status: 500 }
    );
  }
}
