import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabaseClient, createServerSupabaseClient } from '@/lib/supabaseServer';

// Admin API (external) — header-protected using ADMIN_API_KEY
// External scripts should call this route with header 'x-admin-key' == ADMIN_API_KEY

export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return NextResponse.json({ error: 'ADMIN_API_KEY not configured' }, { status: 500 });

  const provided = req.headers.get('x-admin-key') || '';
  if (provided !== adminKey) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'bidding_open')
      .maybeSingle();

    if (error) throw error;
    const value = data?.value ?? false;
    return NextResponse.json({ bidding_open: value });
  } catch (err: any) {
    console.error('Error reading bidding status:', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return NextResponse.json({ error: 'ADMIN_API_KEY not configured' }, { status: 500 });

  const provided = req.headers.get('x-admin-key') || '';
  if (provided !== adminKey) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const incoming = body?.bidding_open;
    if (typeof incoming !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload, expected { bidding_open: boolean }' }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key: 'bidding_open', value: incoming, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) throw error;
    return NextResponse.json({ ok: true, bidding_open: incoming });
  } catch (err: any) {
    console.error('Error updating bidding status:', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
