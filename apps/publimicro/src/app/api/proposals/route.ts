import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { sendEmail, getProposalEmail } from '@/lib/emailService';
import { checkRateLimit, getClientIP } from '@/lib/adminAuth';

// POST /api/proposals - Create a new proposal
export async function POST(req: Request) {
  // Rate limiting - 5 proposals per hour per IP
  const clientIP = getClientIP(req);
  if (!checkRateLimit(`proposal:${clientIP}`, 5, 3600000)) {
    return NextResponse.json(
      { error: 'Too many proposals. Please try again later.' },
      { status: 429 }
    );
  }

  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { ad_id, amount, visit_id: _visit_id, message } = body;

    if (!ad_id || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user profile state (must have completed profile and be verified)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('profile_completed, verified, can_place_bids, full_name')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.profile_completed || !profile.verified) {
      return NextResponse.json({ error: 'Profile incomplete or not verified' }, { status: 403 });
    }

    // Get property details for email
    const { data: property } = await supabase
      .from('sitios')
      .select('nome, user_id')
      .eq('id', ad_id)
      .single();

    // Get owner email separately
    let ownerEmail = null;
    if (property) {
      const { data: owner } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('user_id', property.user_id)
        .single();
      ownerEmail = owner?.email;
    }

    // Check for a completed visit for this ad
    const { data: visits } = await supabase
      .from('visits')
      .select('id, status')
      .eq('ad_id', ad_id)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .limit(1);

    let authorizedViaCode = false;

    if ((!visits || visits.length === 0) && body.auth_code) {
      // Validate authorization code (one-time use)
      const { data: codeRow } = await supabase
        .from('authorization_codes')
        .select('id, used')
        .eq('code', body.auth_code)
        .eq('property_id', ad_id)
        .eq('used', false)
        .single();

      if (codeRow) {
        // mark code as used
        await supabase
          .from('authorization_codes')
          .update({ used: true, used_at: new Date().toISOString() })
          .eq('id', codeRow.id);

        authorizedViaCode = true;
      }
    }

    if ((!visits || visits.length === 0) && !authorizedViaCode) {
      return NextResponse.json({ error: 'You must complete a visit or provide a valid authorization code', code: 'VISIT_REQUIRED' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('proposals')
      .insert({
        property_id: ad_id,  // Using property_id to match schema
        user_id: user.id,
        // visit_id: visit_id || visits[0]?.id,  // Optional
        amount,
        message,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send email notification to property owner
    if (property && ownerEmail) {
      await sendEmail(getProposalEmail({
        userName: profile?.full_name || user.email || 'Um interessado',
        propertyTitle: property.nome,
        propertyUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://publimicro.com.br'}/imoveis/${ad_id}`,
        proposalAmount: new Intl.NumberFormat('pt-BR').format(amount),
        ownerEmail
      }));
    }

    return NextResponse.json({ success: true, proposal: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/proposals - Get user's proposals
export async function GET(_req: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}





