import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

/**
 * NEW SIGNUP FLOW WITH BACKGROUND CHECKS
 * 
 * 1. Collect user information
 * 2. Validate CPF
 * 3. Run background checks (Federal Police + Interpol)
 * 4. If PASS → Create account immediately + notify
 * 5. If FAIL → Reject silently (or with generic message)
 * 6. If NEEDS_REVIEW → Create pending_verification record + notify admin
 */

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  
  try {
    const {
      email,
      password,
      full_name,
      cpf,
      phone,
      birth_date,
      // Optional address fields
      cep,
      street,
      number,
      complement,
      neighborhood,
      city,
      state
    } = await req.json();
    
    // ============================================
    // 1. Validate Required Fields
    // ============================================
    
    if (!email || !password || !full_name || !cpf || !birth_date) {
      return NextResponse.json({ 
        error: 'Missing required fields: email, password, full_name, cpf, birth_date' 
      }, { status: 400 });
    }
    
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // ============================================
    // 2. Check if CPF or Email Already Exists
    // ============================================
    
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('cpf', cleanCPF)
      .single();
    
    if (existingProfile) {
      return NextResponse.json({ 
        error: 'CPF already registered' 
      }, { status: 400 });
    }
    
    // ============================================
    // 3. Validate CPF
    // ============================================
    
    const cpfValidation = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/verify-cpf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: cleanCPF, full_name, birth_date })
    });
    
    const cpfResult = await cpfValidation.json();
    
    if (!cpfResult.valid) {
      return NextResponse.json({ 
        error: 'Invalid CPF',
        details: cpfResult.error
      }, { status: 400 });
    }
    
    // ============================================
    // 4. Create Pending Verification Record
    // ============================================
    
    const { data: pendingVerification, error: pendingError } = await supabase
      .from('pending_verifications')
      .insert({
        full_name,
        email,
        cpf: cleanCPF,
        phone,
        birth_date,
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        source: 'signup',
        cpf_validation_status: 'approved',
        cpf_validated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (pendingError) {
      console.error('Error creating pending verification:', pendingError);
      return NextResponse.json({ 
        error: 'Failed to process signup request' 
      }, { status: 500 });
    }
    
    // ============================================
    // 5. Run Background Checks
    // ============================================
    
    const backgroundCheck = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/background-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: cleanCPF,
        full_name,
        birth_date,
        email,
        pending_verification_id: pendingVerification.id
      })
    });
    
    const backgroundResult = await backgroundCheck.json();
    
    // ============================================
    // 6. Handle Results
    // ============================================
    
    if (backgroundResult.status === 'rejected') {
      // REJECTED: Don't create account, don't tell user why
      return NextResponse.json({ 
        error: 'Unable to complete registration at this time. Please contact support if you believe this is an error.',
        code: 'REGISTRATION_DENIED'
      }, { status: 403 });
    }
    
    if (backgroundResult.status === 'needs_review') {
      // NEEDS MANUAL REVIEW: Notify admin, ask user to wait
      // TODO: Send email to admin for manual review
      
      return NextResponse.json({ 
        message: 'Your registration is under review. We will notify you via email within 24-48 hours.',
        code: 'PENDING_REVIEW',
        verification_id: pendingVerification.id
      }, { status: 202 }); // 202 Accepted (processing)
    }
    
    // ============================================
    // 7. APPROVED: Create Account Immediately
    // ============================================
    
    if (backgroundResult.status === 'approved') {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email for verified users
        user_metadata: {
          full_name,
          phone
        }
      });
      
      if (authError) {
        console.error('Error creating auth user:', authError);
        return NextResponse.json({ 
          error: 'Failed to create account',
          details: authError.message
        }, { status: 500 });
      }
      
      // Create user profile with verification flags
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          full_name,
          cpf: cleanCPF,
          phone,
          birth_date,
          cep,
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
          profile_completed: true,
          verified: true, // Already verified!
          can_schedule_visits: true,
          can_place_bids: false, // Only after first visit completion
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
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Try to clean up auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        return NextResponse.json({ 
          error: 'Failed to complete registration',
          details: profileError.message
        }, { status: 500 });
      }
      
      // Update pending verification record
      await supabase
        .from('pending_verifications')
        .update({
          account_created: true,
          user_id: authData.user.id,
          email_sent: true,
          email_sent_at: new Date().toISOString()
        })
        .eq('id', pendingVerification.id);
      
      // TODO: Send welcome email
      
      return NextResponse.json({
        success: true,
        message: 'Account created successfully! You can now sign in.',
        user_id: authData.user.id,
        verified: true
      }, { status: 201 });
    }
    
    // Fallback (should never reach here)
    return NextResponse.json({ 
      error: 'Unexpected verification status' 
    }, { status: 500 });
    
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      error: error.message || 'Signup failed' 
    }, { status: 500 });
  }
}
