import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * GET /api/verification/status
 * Get detailed verification status for authenticated user
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

    // Get verification record with full details
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
        status: 'not_started',
        message: 'Verificação não iniciada.',
        next_step: 'start_verification',
      });
    }

    // Determine next step based on current status
    let nextStep = null;
    let message = '';

    switch (verification.status) {
      case 'pending':
        nextStep = 'upload_documents';
        message = 'Aguardando envio de documentos.';
        break;
      case 'checking':
        nextStep = 'wait_for_results';
        message = 'Verificação em andamento. Aguarde o resultado.';
        break;
      case 'approved':
        nextStep = null;
        message = 'Verificação aprovada! Você pode realizar compras e assinar planos.';
        break;
      case 'manual_review':
        nextStep = 'wait_for_review';
        message = 'Sua verificação está em análise manual. Retornaremos em breve.';
        break;
      case 'rejected':
        nextStep = 'appeal';
        message = 'Verificação rejeitada. Você pode entrar em contato para recurso.';
        break;
      case 'suspended':
        nextStep = 'contact_support';
        message = 'Sua conta foi suspensa. Entre em contato com suporte.';
        break;
      default:
        nextStep = 'start_verification';
        message = 'Status desconhecido.';
    }

    // Check which steps are completed
    const stepsCompleted = {
      personal_info: !!verification.full_name && !!verification.cpf,
      documents_uploaded: !!verification.document_front_url && !!verification.selfie_url,
      cpf_validated: verification.cpf_valid === true,
      background_checked: verification.criminal_record_status !== 'not_checked',
      phone_verified: verification.phone_verified === true,
    };

    const completionPercentage = Object.values(stepsCompleted).filter(Boolean).length * 20;

    return NextResponse.json({
      verified: verification.status === 'approved',
      status: verification.status,
      message,
      next_step: nextStep,
      verification: {
        id: verification.id,
        status: verification.status,
        full_name: verification.full_name,
        cpf_valid: verification.cpf_valid,
        criminal_record_status: verification.criminal_record_status,
        risk_score: verification.risk_score,
        risk_level: verification.risk_level,
        requires_manual_review: verification.requires_manual_review,
        manual_review_reason: verification.manual_review_reason,
        rejection_reason: verification.rejection_reason,
        rejection_details: verification.rejection_details,
        created_at: verification.created_at,
        approved_at: verification.approved_at,
        rejected_at: verification.rejected_at,
      },
      steps_completed: stepsCompleted,
      completion_percentage: completionPercentage,
    });

  } catch (error) {
    console.error('Error getting verification status:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar status de verificação.' },
      { status: 500 }
    );
  }
}
