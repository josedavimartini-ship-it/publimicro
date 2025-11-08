import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

/**
 * Background Check API
 * Performs Federal Police and Interpol checks
 * INTERNAL USE ONLY - Called by server-side processes
 */

interface BackgroundCheckRequest {
  cpf: string;
  full_name: string;
  birth_date?: string;
  email?: string;
  pending_verification_id?: string;
  cidade?: string;
  estado?: string;
}

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  
  try {
    const body: BackgroundCheckRequest = await req.json();
  const { cpf, full_name, birth_date, email, pending_verification_id, cidade, estado } = body;
    
    if (!cpf || !full_name) {
      return NextResponse.json({ 
        error: 'CPF and full name are required' 
      }, { status: 400 });
    }
    
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // ============================================
    // 1. Federal Police Check (Polícia Federal)
    // ============================================
    
    let federalPoliceStatus: 'approved' | 'rejected' | 'needs_review' = 'approved';
    let federalPoliceResponse: any = null;
    
    try {
      // TODO: Integration with Brazilian Federal Police API
      // Endpoint: https://servicos.dpf.gov.br/api/antecedentes
      // This would check for:
      // - Criminal records
      // - Wanted persons
      // - Restrictions
      
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      federalPoliceResponse = {
        cpf: cleanCPF,
        name: full_name,
        has_criminal_record: false,
        is_wanted: false,
        restrictions: [],
        checked_at: new Date().toISOString()
      };
      
      // Log Federal Police check
      await supabase.from('verification_logs').insert({
        user_id: null,
        verification_type: 'federal_police',
        status: federalPoliceStatus,
        request_data: { cpf: cleanCPF, full_name, birth_date },
        response_data: federalPoliceResponse
      });
      
    } catch (error: any) {
      console.error('Federal Police check error:', error);
      federalPoliceStatus = 'needs_review';
      federalPoliceResponse = { error: error.message };
    }
    
    // ============================================
    // 2. Interpol Check (International Database)
    // ============================================
    
    let interpolStatus: 'approved' | 'rejected' | 'needs_review' = 'approved';
    let interpolResponse: any = null;
    
    try {
      // TODO: Integration with Interpol I-24/7 Database
      // Note: This requires special authorization from Interpol
      // Alternative: Use third-party services like:
      // - WorldCheck (Refinitiv)
      // - ComplyAdvantage
      // - Dow Jones Risk & Compliance
      
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      interpolResponse = {
        name: full_name,
        is_red_notice: false,
        is_wanted: false,
        travel_restrictions: [],
        checked_at: new Date().toISOString()
      };
      
      // Log Interpol check
      await supabase.from('verification_logs').insert({
        user_id: null,
        verification_type: 'interpol',
        status: interpolStatus,
        request_data: { full_name, birth_date },
        response_data: interpolResponse
      });
      
    } catch (error: any) {
      console.error('Interpol check error:', error);
      interpolStatus = 'needs_review';
      interpolResponse = { error: error.message };
    }
    
    // ============================================
    // 3. Determine Overall Result (auto/manual/alert)
    // ============================================
    let finalStatus: 'approved' | 'rejected' | 'needs_review';
    let rejectionReason: string | null = null;
    let policeAlert: boolean = false;

    // If any criminal/wanted/red notice, auto-reject and alert
    const isCriminal =
      federalPoliceResponse?.has_criminal_record === true ||
      federalPoliceResponse?.is_wanted === true ||
      interpolResponse?.is_red_notice === true ||
      interpolResponse?.is_wanted === true;

    if (isCriminal) {
      finalStatus = 'rejected';
      rejectionReason = 'Criminal or wanted status detected. Alert sent to authorities.';
      policeAlert = true;
      // Integrate with police alert system (placeholder)
      const alertPayload = {
        cpf: cleanCPF,
        full_name,
        birth_date,
        email,
        cidade,
        estado,
        federalPoliceResponse,
        interpolResponse,
        timestamp: new Date().toISOString(),
      };
      // TODO: Replace with real police alert integration (email, webhook, etc.)
      // await fetch('https://api.police-alert.local/alert', { method: 'POST', body: JSON.stringify(alertPayload) });
      await supabase.from('verification_logs').insert({
        user_id: null,
        verification_type: 'police_alert',
        status: 'alerted',
        request_data: alertPayload,
        response_data: { sent: false, reason: 'Integration not implemented' }
      });
    } else if (
      (federalPoliceStatus as any) === 'rejected' ||
      (interpolStatus as any) === 'rejected'
    ) {
      finalStatus = 'rejected';
      rejectionReason = 'Background check failed: status rejected by authority.';
    } else if (
      federalPoliceStatus === 'needs_review' ||
      interpolStatus === 'needs_review'
    ) {
      finalStatus = 'needs_review';
      rejectionReason = 'Manual review required: unable to determine status automatically.';
    } else {
      finalStatus = 'approved';
    }
    
    // ============================================
    // 4. Update Pending Verification Record
    // ============================================
    
    if (pending_verification_id) {
      await supabase
        .from('pending_verifications')
        .update({
          federal_police_check_status: federalPoliceStatus,
          federal_police_check_date: new Date().toISOString(),
          federal_police_response: federalPoliceResponse,
          interpol_check_status: interpolStatus,
          interpol_check_date: new Date().toISOString(),
          interpol_response: interpolResponse,
          verification_status: finalStatus,
          // Set verified_at only when explicitly approved
          verified_at: finalStatus === 'approved' ? new Date().toISOString() : null,
          verification_passed: finalStatus === 'approved',
          rejection_reason: rejectionReason,
          police_alert: policeAlert
        })
        .eq('id', pending_verification_id);
    }
    
    // ============================================
    // 5. Return Results
    // ============================================
    
    return NextResponse.json({
      status: finalStatus,
      police_alert: policeAlert,
      rejection_reason: rejectionReason,
      checks: {
        federal_police: {
          status: federalPoliceStatus,
          response: federalPoliceResponse
        },
        interpol: {
          status: interpolStatus,
          response: interpolResponse
        }
      },
      checked_at: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Background check error:', error);
    return NextResponse.json({ 
      error: error.message || 'Background check failed' 
    }, { status: 500 });
  }
}
