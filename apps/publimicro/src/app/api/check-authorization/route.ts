import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const propId = searchParams.get("propId");

    if (!propId) {
      return NextResponse.json({ authorized: false }, { status: 200 });
    }

    // Check if user has a confirmed visit for this property
    // In production, you would check against user session/auth
    // For now, we return false to enforce the authorization flow
    
    // TODO: Implement proper authorization check
    // const { data } = await supabase
    //   .from("visitas_agendadas")
    //   .select("*")
    //   .eq("property_id", propId)
    //   .eq("status", "confirmada")
    //   .eq("user_email", userEmail) // from session
    //   .single();

    return NextResponse.json({ authorized: false }, { status: 200 });
  } catch (error) {
    console.error("Erro ao verificar autorização:", error);
    return NextResponse.json({ authorized: false }, { status: 200 });
  }
}
