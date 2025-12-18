import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { sendEmail, getVisitRequestEmail } from '@/lib/emailService';
import { checkRateLimit, getClientIP } from '@/lib/adminAuth';

// POST /api/visits - Create a new visit request
export async function POST(req: Request) {
  // Rate limiting - 10 visit requests per hour per IP
  const clientIP = getClientIP(req);
  if (!checkRateLimit(`visit:${clientIP}`, 10, 3600000)) {
    return NextResponse.json(
      { error: 'Too many visit requests. Please try again later.' },
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
    const { ad_id, visit_type, scheduled_at, guest_name, guest_email, guest_phone, notes } = body;

    if (!ad_id || !scheduled_at) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user has verified profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('profile_completed, full_name')
      .eq('id', user.id)
      .single();

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

    const { data, error } = await supabase
      .from('visits')
      .insert({
        ad_id,
        user_id: user.id,
        visit_type: visit_type || 'in_person',
        scheduled_at,
        guest_name: guest_name || user.user_metadata?.full_name || profile?.full_name,
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

    // Send email notification to property owner
    if (property && ownerEmail) {
      const visitDate = new Date(scheduled_at);
      await sendEmail(getVisitRequestEmail({
        userName: guest_name || profile?.full_name || 'Um visitante',
        propertyTitle: property.nome,
        propertyUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://publimicro.com.br'}/imoveis/${ad_id}`,
        visitDate: visitDate.toLocaleDateString('pt-BR'),
        visitTime: visitDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        ownerEmail
      }));
    }

    return NextResponse.json({ success: true, visit: data });
  } catch (error) {
    const message = error && typeof error === 'object' && 'message' in error ? (error as { message?: string }).message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
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