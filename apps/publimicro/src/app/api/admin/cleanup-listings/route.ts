import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabaseServer";

// Admin-only endpoint to remove test/demo listings by title substring.
// Protect with ADMIN_API_KEY (set in environment) via header 'x-admin-key'.
export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (adminKey) {
    const provided = req.headers.get("x-admin-key") || "";
    if (provided !== adminKey) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const q = (body.query || "").trim();
    const table = body.table || "both"; // 'properties' | 'listings' | 'both'

    if (!q || q.length < 2) return NextResponse.json({ error: "query must be provided and at least 2 chars" }, { status: 400 });

    const supabase = createServiceSupabaseClient();
    const like = `%${q}%`;

    const deleted: Record<string, any> = {};

    if (table === "properties" || table === "both") {
      const { data, error } = await supabase.from("properties").select("id").or(`title.ilike.${like}`);
      if (error) throw error;
      if (data && data.length > 0) {
        const ids = data.map((r: any) => r.id);
        const { error: delErr } = await supabase.from("properties").delete().in("id", ids);
        if (delErr) throw delErr;
        deleted.properties = ids.length;
      } else {
        deleted.properties = 0;
      }
    }

    if (table === "listings" || table === "both") {
      const { data, error } = await supabase.from("listings").select("id").or(`title.ilike.${like},name.ilike.${like}`);
      if (error) throw error;
      if (data && data.length > 0) {
        const ids = data.map((r: any) => r.id);
        const { error: delErr } = await supabase.from("listings").delete().in("id", ids);
        if (delErr) throw delErr;
        deleted.listings = ids.length;
      } else {
        deleted.listings = 0;
      }
    }

    return NextResponse.json({ ok: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
