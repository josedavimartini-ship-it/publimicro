import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

// GET /api/verification-status?id=...
export async function GET(req: Request) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing verification id" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("pending_verifications")
    .select("verification_status, rejection_reason, checked_at")
    .eq("id", id)
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  return NextResponse.json({
    status: data.verification_status,
    rejection_reason: data.rejection_reason,
    checked_at: data.checked_at,
  });
}
