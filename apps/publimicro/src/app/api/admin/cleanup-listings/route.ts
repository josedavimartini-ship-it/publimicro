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
    const preview = !!body.preview; // when true, return matched rows instead of deleting

    if (!q || q.length < 2) return NextResponse.json({ error: "query must be provided and at least 2 chars" }, { status: 400 });

    const supabase = createServiceSupabaseClient();
    const like = `%${q}%`;

    const result: Record<string, any> = {};

    // Helper: attempt a column search inside try/catch to avoid errors when a column doesn't exist
    async function findMatches(tableName: string, columnsToTry: string[]) {
      const found: any[] = [];
      for (const col of columnsToTry) {
        try {
          const { data, error } = await supabase.from(tableName).select("id," + col).ilike(col, like);
          if (error) {
            // if column missing or other error, ignore and continue trying other columns
            continue;
          }
          if (data && data.length > 0) {
            // append unique ids
            for (const r of data) {
              if (!found.find((f) => (f as any).id === (r as any).id)) found.push(r);
            }
          }
        } catch (err) {
          // ignore and continue
          continue;
        }
      }
      return found;
    }

    if (table === "properties" || table === "both") {
      // properties usually have a 'title' field
      const matches = await findMatches("properties", ["title", "name"]);
      result.properties = { count: matches.length, rows: preview ? matches : matches.map((r) => r.id) };
      if (!preview && matches.length > 0) {
        const ids = matches.map((r) => r.id);
        const { error: delErr } = await supabase.from("properties").delete().in("id", ids);
        if (delErr) throw delErr;
        result.properties.deleted = ids.length;
      }
    }

    if (table === "listings" || table === "both") {
      // listings may have 'title' or 'name' depending on schema; try both
      const matches = await findMatches("listings", ["title", "name"]);
      result.listings = { count: matches.length, rows: preview ? matches : matches.map((r) => r.id) };
      if (!preview && matches.length > 0) {
        const ids = matches.map((r) => r.id);
        const { error: delErr } = await supabase.from("listings").delete().in("id", ids);
        if (delErr) throw delErr;
        result.listings.deleted = ids.length;
      }
    }

    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
