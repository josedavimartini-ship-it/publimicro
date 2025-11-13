import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceSupabaseClient } from '@/lib/supabaseServer';

// Server-side proxy for in-app admin UI.
// This route requires a logged-in user and a check against a small admin email allowlist.
// It performs reads/writes to `app_settings` using the service role client so the UI
// doesn't need to hold ADMIN_API_KEY.

// Fallback admin list (used only if app_settings.admin_emails is missing)
const FALLBACK_ADMIN_EMAILS = [
  'admin@publimicro.com.br',
  'contato@publimicro.com.br',
];

async function ensureAdmin() {
  const serverSupabase = createServerSupabaseClient();
  const { data } = await serverSupabase.auth.getUser();
  const user = data?.user;
  if (!user || !user.email) return { ok: false };
  const email = user.email.toLowerCase();

  try {
    // Try to read admin_emails from app_settings
    const svc = createServiceSupabaseClient();
    const { data: setting, error } = await svc
      .from('app_settings')
      .select('value')
      .eq('key', 'admin_emails')
      .maybeSingle();

    if (!error && setting?.value) {
      try {
        const list = Array.isArray(setting.value) ? setting.value : JSON.parse(setting.value);
        const normalized = list.map((e) => String(e).toLowerCase());
        if (normalized.includes(email)) return { ok: true, user };
      } catch (err) {
        // ignore parse errors and fall back
      }
    }
  } catch (err) {
    console.error('Failed to read admin_emails from app_settings', err);
    // continue to fallback check
  }

  if (FALLBACK_ADMIN_EMAILS.includes(email)) return { ok: true, user };
  return { ok: false };
}

export async function GET(req: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'bidding_open')
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({ bidding_open: data?.value ?? false });
  } catch (err: any) {
    console.error('proxy: error reading bidding:', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const incoming = body?.bidding_open;
    if (typeof incoming !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload, expected { bidding_open: boolean }' }, { status: 400 });
    }

    const svc = createServiceSupabaseClient();

    // Read old value for audit
    const { data: existing, error: readErr } = await svc
      .from('app_settings')
      .select('value')
      .eq('key', 'bidding_open')
      .maybeSingle();

    if (readErr) throw readErr;
    const oldValue = existing?.value ?? null;

    const { error } = await svc
      .from('app_settings')
      .upsert({ key: 'bidding_open', value: incoming, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) throw error;

    // Insert audit record
    try {
      const changedBy = (auth.user && (auth.user.email || auth.user.id)) || null;
      await svc.from('app_settings_audit').insert({
        key: 'bidding_open',
        old_value: oldValue,
        new_value: incoming,
        changed_by: changedBy,
        changed_at: new Date().toISOString(),
      });
    } catch (auditErr) {
      // Log but don't fail the main request
      console.error('Failed to write app_settings_audit:', auditErr);
    }

    return NextResponse.json({ ok: true, bidding_open: incoming });
  } catch (err: any) {
    console.error('proxy: error updating bidding:', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
