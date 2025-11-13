import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabaseServer";

// Admin-only preview endpoint to locate rows containing a phone number across
// several tables/columns. Protect with ADMIN_API_KEY (header 'x-admin-key').
export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (adminKey) {
    const provided = req.headers.get("x-admin-key") || "";
    if (provided !== adminKey) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const phone = (body.phone || "").toString().replace(/\D/g, "");
    if (!phone || phone.length < 4) return NextResponse.json({ error: "phone must be provided (at least 4 digits)" }, { status: 400 });

    // Candidate tables and columns to probe
    const tables = [
      "properties",
      "listings",
      "user_profiles",
      "pending_verifications",
      "visits",
      "contacts",
      "proposals",
      "messages",
    ];

    const phoneCols = [
      "phone",
      "celular",
      "celular_numero",
      "contact_phone",
      "owner_phone",
      "user_phone",
      "phone_number",
      "phone_normalized",
      "phone_normalized_digits",
      "telephone",
      "telefone",
      "mobile",
      "cel",
      "telefone_contato",
      // also try some generic fields that sometimes contain phone (but are not phones)
      "contact",
      "email",
      "full_name",
      "name",
      "title",
    ];

    // Build a set of LIKE patterns to try server-side. We query using ILIKE
    // to match stored strings that may include formatting characters.
    const patterns = new Set<string>();
    patterns.add(`%${phone}%`);
    // add suffix variations: last 8 and last 9 digits (common storage forms)
    if (phone.length > 8) patterns.add(`%${phone.slice(-8)}%`);
    if (phone.length > 9) patterns.add(`%${phone.slice(-9)}%`);

    const supabase = createServiceSupabaseClient();
    const result: Record<string, any> = {};

    // helper: try each column on a table and collect matches. Will attempt
    // each column and each pattern and avoid failing on missing columns.
    async function findMatches(tableName: string) {
      const found: any[] = [];
      for (const col of phoneCols) {
        try {
          for (const p of Array.from(patterns)) {
            // Try to select the column and id; if column doesn't exist supabase returns an error
            const { data, error } = await supabase.from(tableName).select(`id, ${col}`).ilike(col, p).limit(500);
            if (error) {
              // likely the column doesn't exist or incompatible type; stop trying this column
              break;
            }
            if (data && data.length > 0) {
              for (const r of data) {
                // Normalize the candidate value server-side in JS and ensure the digits match
                const val = String(r[col] ?? "");
                const digits = val.replace(/\D/g, "");
                if (digits && (digits.includes(phone) || phone.includes(digits) || digits.endsWith(phone.slice(-8)))) {
                  // attach entire row object for inspection
                  const exists = found.find((f) => f.id === r.id);
                  if (!exists) found.push({ id: r.id, column: col, value: val, row: r });
                }
              }
            }
          }
        } catch (err) {
          // ignore and continue with next column
          continue;
        }
      }
      return found;
    }

    for (const t of tables) {
      try {
        const matches = await findMatches(t);
        result[t] = { count: matches.length, rows: matches };
      } catch (err) {
        result[t] = { error: String(err), count: 0, rows: [] };
      }
    }

    return NextResponse.json({ ok: true, phone: phone, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
