import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

interface ScheduleVisitData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string; // Changed from 'documento'
  birth_date?: string; // Required for guest users
  cidade: string;
  estado: string;
  pais: string;
  dataPreferencia: string;
  horarioPreferencia: string;
  mensagem?: string;
  visitType: "presencial" | "video";
  propertyId?: string;
  propertyTitle?: string;
  isGuest?: boolean; // Flag to trigger background check
  user_id?: string; // For authenticated users
}

/**
 * ENHANCED VISIT SCHEDULING WITH GUEST SUPPORT
 * 
 * Flow:
 * 1. Authenticated users → Schedule directly
 * 2. Guest users → Collect info + Run background checks
 * 3. If checks pass → Create pending_verification record + Schedule visit
 * 4. Admin confirms visit → If first visit, enable can_place_bids
 */

export async function POST(req: Request): Promise<NextResponse> {
  const supabase = createServerSupabaseClient();
  
  try {
    const body: ScheduleVisitData = await req.json();

    const {
      nome,
      email,
      telefone,
      cpf, // Changed from documento
      birth_date,
      cidade,
      estado,
      pais,
      dataPreferencia,
      horarioPreferencia,
      mensagem,
      visitType,
      propertyId,
      propertyTitle,
      isGuest,
      user_id
    } = body;

    // Validação básica
    if (!nome || !email || !telefone || !cpf || !dataPreferencia || !horarioPreferencia) {
      return NextResponse.json(
        { error: "Campos obrigatórios: nome, email, telefone, cpf, data e horário." },
        { status: 400 }
      );
    }
    
    // Guest users require birth_date for background check
    if (isGuest && !birth_date) {
      return NextResponse.json(
        { error: "Data de nascimento é obrigatória para novos usuários." },
        { status: 400 }
      );
    }
    
    const cleanCPF = cpf.replace(/\D/g, '');

    // Get authenticated user if not explicitly guest
    let authenticatedUser = null;
    if (!isGuest) {
      const { data: { user } } = await supabase.auth.getUser();
      authenticatedUser = user;
    }

    // ============================================
    // GUEST USER FLOW - With Background Checks
    // ============================================
    
    if (isGuest || !authenticatedUser) {
      
      // 1. Check if CPF already exists (prevent duplicate registrations)
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('cpf', cleanCPF)
        .single();
      
      if (existingProfile) {
        return NextResponse.json({ 
          error: 'Este CPF já está cadastrado. Por favor, faça login para agendar sua visita.',
          code: 'CPF_EXISTS'
        }, { status: 400 });
      }
      
      // 2. Check if already has pending verification
      const { data: existingPending } = await supabase
        .from('pending_verifications')
        .select('id, verification_status')
        .eq('cpf', cleanCPF)
        .eq('account_created', false)
        .single();
      
      if (existingPending) {
        if (existingPending.verification_status === 'rejected') {
          return NextResponse.json({ 
            error: 'Não foi possível processar sua solicitação. Entre em contato para mais informações.',
            code: 'REGISTRATION_DENIED'
          }, { status: 403 });
        }
        
        if (existingPending.verification_status === 'pending' || existingPending.verification_status === 'in_progress') {
          return NextResponse.json({ 
            message: 'Sua verificação ainda está em andamento. Você receberá um email quando concluída.',
            code: 'PENDING_REVIEW',
            verification_id: existingPending.id
          }, { status: 202 });
        }
      }
      
      // 3. Validate CPF
      const cpfValidation = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/verify-cpf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: cleanCPF, full_name: nome, birth_date })
      });
      
      const cpfResult = await cpfValidation.json();
      
      if (!cpfResult.valid) {
        return NextResponse.json({ 
          error: 'CPF inválido. Por favor, verifique e tente novamente.',
          details: cpfResult.error
        }, { status: 400 });
      }
      
      // 4. Create Pending Verification Record
      const { data: pendingVerification, error: pendingError } = await supabase
        .from('pending_verifications')
        .insert({
          full_name: nome,
          email,
          cpf: cleanCPF,
          phone: telefone,
          birth_date,
          city: cidade,
          state: estado,
          country: pais || 'Brasil',
          source: 'visit_request',
          source_id: propertyId || null,
          cpf_validation_status: 'approved',
          cpf_validated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (pendingError) {
        console.error('Error creating pending verification:', pendingError);
        return NextResponse.json({ 
          error: 'Falha ao processar solicitação' 
        }, { status: 500 });
      }
      
      // 5. Run Background Checks
      const backgroundCheck = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/background-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: cleanCPF,
          full_name: nome,
          birth_date,
          email,
          pending_verification_id: pendingVerification.id
        })
      });
      
      const backgroundResult = await backgroundCheck.json();
      
      // 6. Handle Background Check Results
      if (backgroundResult.status === 'rejected') {
        // Silent rejection - don't reveal reason to user
        return NextResponse.json({ 
          error: 'Não foi possível processar sua solicitação no momento. Por favor, entre em contato conosco.',
          code: 'REGISTRATION_DENIED'
        }, { status: 403 });
      }
      
      if (backgroundResult.status === 'needs_review') {
        // Manual review required
        return NextResponse.json({ 
          message: 'Sua solicitação está em análise. Você receberá um email dentro de 24-48 horas.',
          code: 'PENDING_REVIEW',
          verification_id: pendingVerification.id
        }, { status: 202 });
      }
      
      // 7. APPROVED - Create Visit Request
      const scheduledAt = new Date(`${dataPreferencia}T${horarioPreferencia || '09:00'}`).toISOString();
      
      const { data: visitData, error: visitError } = await supabase
        .from("visits")
        .insert([
          {
            ad_id: propertyId || null,
            user_id: null, // No user account yet
            guest_name: nome,
            guest_email: email,
            guest_phone: telefone,
            guest_cpf: cleanCPF,
            guest_birth_date: birth_date,
            verification_pending_id: pendingVerification.id,
            background_check_required: true,
            background_check_completed: true,
            background_check_passed: true,
            visit_type: visitType === "presencial" ? "in_person" : "video",
            scheduled_at: scheduledAt,
            status: "pending", // Will be confirmed after account creation
            notes: mensagem || null,
          },
        ])
        .select()
        .single();
      
      if (visitError) {
        console.error("Erro ao criar visita:", visitError);
        return NextResponse.json({ error: visitError.message }, { status: 500 });
      }
      
      // 8. Auto-create account if background check passed
      if (backgroundResult.status === 'approved') {
        // Generate random password
        const randomPassword = `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`;
        
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password: randomPassword,
          email_confirm: true,
          user_metadata: {
            full_name: nome,
            phone: telefone
          }
        });
        
        if (!authError && authData.user) {
          // Create user profile
          await supabase
            .from('user_profiles')
            .insert({
              id: authData.user.id,
              full_name: nome,
              cpf: cleanCPF,
              phone: telefone,
              birth_date,
              city: cidade,
              state: estado,
              profile_completed: true,
              verified: true,
              can_schedule_visits: true,
              can_place_bids: false, // Only after visit completion
              cpf_validation_status: 'approved',
              cpf_validated_at: new Date().toISOString(),
              federal_police_check_status: 'approved',
              federal_police_check_date: new Date().toISOString(),
              interpol_check_status: 'approved',
              interpol_check_date: new Date().toISOString(),
              background_check_completed: true,
              background_check_passed: true,
              verified_at: new Date().toISOString()
            });
          
          // Update pending verification
          await supabase
            .from('pending_verifications')
            .update({
              account_created: true,
              user_id: authData.user.id
            })
            .eq('id', pendingVerification.id);
          
          // Update visit with user_id
          await supabase
            .from('visits')
            .update({ user_id: authData.user.id })
            .eq('id', visitData.id);
          
          // TODO: Send welcome email with credentials
        }
      }
      
      return NextResponse.json({ 
        success: true,
        message: backgroundResult.status === 'approved' ? 
          'Visita agendada com sucesso! Sua conta foi criada - verifique seu email.' : 
          'Solicitação recebida! Entraremos em contato em breve.'
      }, { status: 201 });
    }

    // ============================================
    // AUTHENTICATED USER FLOW - Simple Scheduling
    // ============================================
    
    const scheduledAt = new Date(`${dataPreferencia}T${horarioPreferencia || '09:00'}`).toISOString();

    const { data, error } = await supabase
      .from("visits")
      .insert([
        {
          ad_id: propertyId || null,
          user_id: user_id || authenticatedUser?.id || null,
          guest_name: nome,
          guest_email: email,
          guest_phone: telefone,
          visit_type: visitType === "presencial" ? "in_person" : "video",
          scheduled_at: scheduledAt,
          status: "requested",
          notes: mensagem || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao agendar visita:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TODO: Send email notification to admin and user

    return NextResponse.json({ 
      data,
      message: "Visita agendada com sucesso! Entraremos em contato em breve." 
    }, { status: 201 });
    
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro desconhecido ao agendar visita.";

    console.error("Erro no endpoint /api/schedule-visit:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
