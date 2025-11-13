import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceSupabaseClient } from '@/lib/supabaseServer';

// Proxy for managing runtime app settings (admin_emails)
async function ensureAdmin() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  if (!user || !user.email) return { ok: false };
  const email = user.email.toLowerCase();

  // Read admin_emails from app_settings (service client)
  try {
    const svc = createServiceSupabaseClient();
    const { data: setting } = await svc.from('app_settings').select('value').eq('key', 'admin_emails').maybeSingle();
    if (setting?.value) {
      const list = Array.isArray(setting.value) ? setting.value : JSON.parse(setting.value);
      const normalized = list.map((e: any) => String(e).toLowerCase());
      if (normalized.includes(email)) return { ok: true, user };
    }
  } catch (err) {
    console.error('settings proxy: failed to read admin_emails', err);
  }

  // fallback
  const FALLBACK = ['admin@publimicro.com.br', 'contato@publimicro.com.br'];
  if (FALLBACK.includes(email)) return { ok: true, user };
  return { ok: false };
}

export async function GET(req: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const svc = createServiceSupabaseClient();
    const { data } = await svc.from('app_settings').select('key,value,updated_at').in('key', ['admin_emails']).order('updated_at', { ascending: false });
    const admin = data?.find((r: any) => r.key === 'admin_emails');
    return NextResponse.json({ admin_emails: admin?.value ?? ['admin@publimicro.com.br'] });
  } catch (err: any) {
    console.error('settings proxy GET error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const list = body?.admin_emails;
    if (!Array.isArray(list)) return NextResponse.json({ error: 'admin_emails must be an array' }, { status: 400 });

    const svc = createServiceSupabaseClient();
    const { error } = await svc.from('app_settings').upsert({ key: 'admin_emails', value: list, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;

    // write audit
    try {
      const changedBy = (auth.user && (auth.user.email || auth.user.id)) || null;
      await svc.from('app_settings_audit').insert({ key: 'admin_emails', old_value: null, new_value: list, changed_by: changedBy });
    } catch (auditErr) {
      console.error('Failed to write app_settings_audit for admin_emails', auditErr);
    }

    return NextResponse.json({ ok: true, admin_emails: list });
  } catch (err: any) {
    console.error('settings proxy POST error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
