import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// POST /api/visits - Create a new visit request
export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { ad_id, visit_type, scheduled_at, guest_name, guest_email, guest_phone, notes } = body;

    if (!ad_id || !scheduled_at) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user has verified profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('profile_completed')
      .eq('id', user.id)
      .single();

    const { data, error } = await supabase
      .from('visits')
      .insert({
        ad_id,
        user_id: user.id,
        visit_type: visit_type || 'in_person',
        scheduled_at,
        guest_name: guest_name || user.user_metadata?.full_name,
        guest_email: guest_email || user.email,
        guest_phone,
        notes,
        verification_passed: profile?.profile_completed || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, visit: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/visits - Get user's visits
export async function GET(req: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const ad_id = searchParams.get('ad_id');

  let query = supabase
    .from('visits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (ad_id) {
    query = query.eq('ad_id', ad_id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}