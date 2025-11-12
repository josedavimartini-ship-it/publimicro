import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabaseServer";

// Accepts JSON { files: [{ name, base64, mime }], bucket?, folder? }
// Uploads files to Supabase Storage using the service role key and returns public urls.
export async function POST(req: NextRequest) {
  // Basic admin guard
  const adminKey = process.env.ADMIN_API_KEY;
  if (adminKey) {
    const provided = req.headers.get("x-admin-key") || "";
    if (provided !== adminKey) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const files = body.files || [];
    const bucket = body.bucket || "property-photos";
    const folder = (body.folder || "uploads").replace(/^\/+/, "");

    if (!Array.isArray(files) || files.length === 0) return NextResponse.json({ error: "No files provided" }, { status: 400 });

    const supabase = createServiceSupabaseClient();
    const results: { name: string; publicUrl?: string; error?: string }[] = [];

    for (const f of files) {
      try {
        const name = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${f.name}`;
        // base64 -> buffer
        const b = Buffer.from(f.base64, "base64");
        const { error: upErr } = await supabase.storage.from(bucket).upload(name, b, { contentType: f.mime || "application/octet-stream", upsert: false });
        if (upErr) {
          results.push({ name: f.name, error: upErr.message });
          continue;
        }
        const { data } = supabase.storage.from(bucket).getPublicUrl(name);
        results.push({ name: f.name, publicUrl: data.publicUrl });
      } catch (err: any) {
        results.push({ name: f.name, error: err.message || String(err) });
      }
    }

    return NextResponse.json({ ok: true, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
