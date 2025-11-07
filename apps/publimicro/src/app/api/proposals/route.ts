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

    // Check that user has completed a visit for this ad (OPTIONAL - commented out for now)
    // const { data: visits } = await supabase
    //   .from('visits')
    //   .select('id, status')
    //   .eq('ad_id', ad_id)
    //   .eq('user_id', user.id)
    //   .eq('status', 'completed');

    // if (!visits || visits.length === 0) {
    //   return NextResponse.json(
    //     { error: 'You must complete a visit before submitting a proposal' },
    //     { status: 403 }
    //   );
    // }

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