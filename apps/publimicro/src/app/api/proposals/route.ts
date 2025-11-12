import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// POST /api/proposals - Create a new proposal
export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { ad_id, amount, visit_id, message } = body;

    if (!ad_id || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user profile state (must have completed profile and be verified)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('profile_completed, verified, can_place_bids')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.profile_completed || !profile.verified) {
      return NextResponse.json({ error: 'Profile incomplete or not verified' }, { status: 403 });
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

    return NextResponse.json({ success: true, proposal: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/proposals - Get user's proposals
export async function GET(req: Request) {
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