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
    const raw = await req.json() as unknown;
    if (typeof raw !== 'object' || raw === null) {
      return NextResponse.json({ error: 'invalid request body' }, { status: 400 });
    }
    const body = raw as { query?: unknown; table?: unknown; preview?: unknown };
    const q = String(body.query ?? "").trim();
    const table = String(body.table ?? "both"); // 'properties' | 'listings' | 'both'
    const preview = Boolean(body.preview); // when true, return matched rows instead of deleting

    if (!q || q.length < 2) return NextResponse.json({ error: "query must be provided and at least 2 chars" }, { status: 400 });

    const supabase = createServiceSupabaseClient();
    const like = `%${q}%`;

    const result: Record<string, unknown> = {};

    // Helper: attempt a column search inside try/catch to avoid errors when a column doesn't exist
    async function findMatches(tableName: string, columnsToTry: string[]) {
      const found: Array<Record<string, unknown>> = [];
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
              if (!found.find((f) => String((f as Record<string, unknown>).id) === String(((r as unknown) as Record<string, unknown>).id))) found.push((r as unknown) as Record<string, unknown>);
            }
          }
        } catch {
          // ignore and continue
          continue;
        }
      }
      return found;
    }

    if (table === "properties" || table === "both") {
      // sitios table uses 'nome' field instead of 'title'
      const matches = await findMatches("sitios", ["nome", "name"]);
      result.properties = { count: matches.length, rows: preview ? matches : matches.map((r) => ((r as unknown) as Record<string, unknown>).id) };
      if (!preview && matches.length > 0) {
        const ids = matches.map((r) => ((r as unknown) as Record<string, unknown>).id);
        const { error: delErr } = await supabase.from("sitios").delete().in("id", ids);
        if (delErr) throw delErr;
        (result.properties as Record<string, unknown>)['deleted'] = ids.length;
      }
    }

    if (table === "listings" || table === "both") {
      // listings may have 'title' or 'name' depending on schema; try both
      const matches = await findMatches("listings", ["title", "name"]);
      result.listings = { count: matches.length, rows: preview ? matches : matches.map((r) => ((r as unknown) as Record<string, unknown>).id) };
      if (!preview && matches.length > 0) {
        const ids = matches.map((r) => ((r as unknown) as Record<string, unknown>).id);
        const { error: delErr } = await supabase.from("listings").delete().in("id", ids);
        if (delErr) throw delErr;
        (result.listings as Record<string, unknown>)['deleted'] = ids.length;
      }
    }

    return NextResponse.json({ ok: true, result });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}






