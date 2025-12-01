import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabaseServer";

// Allowed MIME types for upload
const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'application/pdf',
];

// Accepts JSON { files: [{ name, base64, mime }], bucket?, folder? }
// Uploads files to Supabase Storage using the service role key and returns public urls.
export async function POST(req: NextRequest) {
  // Admin API key is REQUIRED - reject if not configured or invalid
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    console.error("ADMIN_API_KEY not configured - rejecting upload request");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  
  const provided = req.headers.get("x-admin-key") || "";
  if (provided !== adminKey) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const raw = await req.json() as unknown;
    if (typeof raw !== 'object' || raw === null) return NextResponse.json({ error: 'invalid request body' }, { status: 400 });
    const body = raw as { files?: unknown; bucket?: unknown; folder?: unknown };
    const files = Array.isArray(body.files) ? (body.files as Array<Record<string, unknown>>) : [];
    const bucket = String(body.bucket ?? "property-photos");
    const folder = String(body.folder ?? "uploads").replace(/^\/+/, "");

    if (!Array.isArray(files) || files.length === 0) return NextResponse.json({ error: "No files provided" }, { status: 400 });

    const supabase = createServiceSupabaseClient();
    const results: { name: string; publicUrl?: string; error?: string }[] = [];

    for (const f of files) {
      const fname = String((f as Record<string, unknown>)?.name ?? 'file');
      const contentType = String((f as Record<string, unknown>)?.mime ?? '').toLowerCase();
      
      // Validate MIME type
      if (!ALLOWED_MIMES.includes(contentType)) {
        results.push({ name: fname, error: `File type not allowed: ${contentType}` });
        continue;
      }
      
      try {
        const name = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${fname}`;
        // base64 -> buffer
        const b = Buffer.from(String((f as Record<string, unknown>)?.base64 ?? ''), "base64");
        const { error: upErr } = await supabase.storage.from(bucket).upload(name, b, { contentType, upsert: false });
        if (upErr) {
          const upMsg = ((upErr as unknown) as { message?: unknown })?.message;
          results.push({ name: fname, error: String(upMsg ?? String(upErr)) });
          continue;
        }
        const { data } = supabase.storage.from(bucket).getPublicUrl(name);
        results.push({ name: fname, publicUrl: ((data as unknown) as { publicUrl?: unknown })?.publicUrl as string });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        results.push({ name: fname, error: msg });
      }
    }

    return NextResponse.json({ ok: true, results });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
