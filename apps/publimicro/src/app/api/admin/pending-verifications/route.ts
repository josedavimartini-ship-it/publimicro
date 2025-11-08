import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

// GET /api/admin/pending-verifications
export async function GET() {
  const supabase = createServerSupabaseClient();
  // TODO: Add admin authentication/authorization check here
  const { data, error } = await supabase
    .from("pending_verifications")
    .select("id, full_name, email, cpf, birth_date, created_at, verification_status, rejection_reason, police_alert")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ verifications: data });
}

// POST /api/admin/pending-verifications { id, action }
export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  // TODO: Add admin authentication/authorization check here
  const { id, action } = await req.json();
  if (!id || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  let update: any = {};
  if (action === 'approve') {
    update = {
      verification_status: 'approved',
      verified_at: new Date().toISOString(),
      verification_passed: true,
      rejection_reason: null
    };
  } else if (action === 'reject') {
    update = {
      verification_status: 'rejected',
      verified_at: new Date().toISOString(),
      verification_passed: false,
      rejection_reason: 'Rejected by admin review.'
    };
  }
  await supabase
    .from('pending_verifications')
    .update(update)
    .eq('id', id);
  // Audit trail
  await supabase.from('verification_logs').insert({
    user_id: null, // Optionally: admin id
    verification_type: 'admin_action',
    status: action,
    request_data: { id, action },
    response_data: update,
    created_at: new Date().toISOString()
  });
  // Return updated list
  const { data, error } = await supabase
    .from("pending_verifications")
    .select("id, full_name, email, cpf, birth_date, created_at, verification_status, rejection_reason, police_alert")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ verifications: data });
}
