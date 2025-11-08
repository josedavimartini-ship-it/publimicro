import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * POST /api/verification/start
 * Initialize a verification record for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado. Faça login primeiro.' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { full_name, cpf, date_of_birth, phone_number } = body;

    // Validate required fields
    if (!full_name || !cpf || !date_of_birth) {
      return NextResponse.json(
        { error: 'Nome completo, CPF e data de nascimento são obrigatórios.' },
        { status: 400 }
      );
    }

    // Check if verification already exists
    const { data: existing, error: checkError } = await supabase
      .from('user_verifications')
      .select('id, status')
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    // If already verified, return existing status
    if (existing) {
      if (existing.status === 'approved') {
        return NextResponse.json({
          message: 'Você já está verificado.',
          verification: existing,
        });
      } else if (existing.status === 'pending' || existing.status === 'checking') {
        return NextResponse.json({
          message: 'Sua verificação já está em andamento.',
          verification: existing,
        });
      } else if (existing.status === 'rejected') {
        return NextResponse.json({
          message: 'Sua verificação anterior foi rejeitada. Entre em contato com suporte.',
          verification: existing,
        }, { status: 403 });
      }
    }

    // Create or update verification record
    const verificationData = {
      user_id: user.id,
      full_name,
      cpf: cpf.replace(/\D/g, ''), // Remove formatting
      date_of_birth,
      phone_number: phone_number || null,
      status: 'pending',
      email_verified: user.email_confirmed_at ? true : false,
      email_verified_at: user.email_confirmed_at || null,
    };

    const { data: verification, error: insertError } = await supabase
      .from('user_verifications')
      .upsert(verificationData, { onConflict: 'user_id' })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Log event
    await supabase.from('verification_audit_log').insert({
      user_verification_id: verification.id,
      user_id: user.id,
      event_type: 'verification_started',
      performed_by: user.id,
      performed_by_type: 'user',
      event_data: {
        full_name,
        cpf_provided: true,
        phone_provided: !!phone_number,
      },
    });

    return NextResponse.json({
      message: 'Verificação iniciada com sucesso.',
      verification,
      next_step: 'upload_documents',
    });

  } catch (error) {
    console.error('Error starting verification:', error);
    return NextResponse.json(
      { error: 'Erro ao iniciar verificação. Tente novamente.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/verification/start
 * Get current verification status for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado.' },
        { status: 401 }
      );
    }

    const { data: verification, error } = await supabase
      .from('user_verifications')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!verification) {
      return NextResponse.json({
        verified: false,
        message: 'Verificação não iniciada.',
      });
    }

    return NextResponse.json({
      verified: verification.status === 'approved',
      verification,
    });

  } catch (error) {
    console.error('Error getting verification status:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar status de verificação.' },
      { status: 500 }
    );
  }
}
