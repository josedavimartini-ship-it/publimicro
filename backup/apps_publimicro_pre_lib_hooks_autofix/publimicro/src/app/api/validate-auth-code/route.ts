import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface ValidateCodeData {
  code: string;
  propId?: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: ValidateCodeData = await req.json();
    const { code, propId } = body;

    if (!code) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // Check if code exists and is valid
    const { data, error } = await supabase
      .from("authorization_codes")
      .select("*")
      .eq("code", code)
      .eq("property_id", propId)
      .eq("used", false)
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    // Mark code as used
    await supabase
      .from("authorization_codes")
      .update({ used: true, used_at: new Date().toISOString() })
      .eq("id", data.id);

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao validar código:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
