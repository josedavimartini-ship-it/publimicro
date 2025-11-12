import { NextResponse } from "next/server";
import { createServerSupabaseClient } from '@/lib/supabaseServer';

interface PropostaData {
  nome: string;
  email: string;
  telefone?: string;
  cidade?: string;
  pais?: string;
  valor: string;
  condicoes?: string;
  justificativa?: string;
  prop_id?: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const formData = await req.formData();

    const data: PropostaData = {
      nome: (formData.get("nome") as string) || "",
      email: (formData.get("email") as string) || "",
      telefone: (formData.get("telefone")?.toString().trim() || undefined),
      cidade: (formData.get("cidade")?.toString().trim() || undefined),
      pais: (formData.get("pais")?.toString().trim() || undefined),
      valor: (formData.get("valor") as string) || "",
      condicoes: (formData.get("condicoes")?.toString().trim() || undefined),
      justificativa: (formData.get("justificativa")?.toString().trim() || undefined),
      prop_id: (formData.get("prop_id")?.toString().trim() || undefined),
    };

    // Enforce profile and visit/auth_code requirements similar to /api/proposals
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('profile_completed, verified')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.profile_completed || !profile.verified) {
      return NextResponse.json({ error: 'Profile incomplete or not verified' }, { status: 403 });
    }

    // check completed visit or optional auth_code
    const propId = data.prop_id;
    const { data: visits } = await supabase
      .from('visits')
      .select('id')
      .eq('ad_id', propId)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .limit(1);

    let authCode = (formData.get('auth_code') as string) || null;
    let authorized = visits && visits.length > 0;

    if (!authorized && authCode) {
      const { data: codeRow } = await supabase
        .from('authorization_codes')
        .select('id, used')
        .eq('code', authCode)
        .eq('property_id', propId)
        .eq('used', false)
        .single();

      if (codeRow) {
        await supabase
          .from('authorization_codes')
          .update({ used: true, used_at: new Date().toISOString() })
          .eq('id', codeRow.id);
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json({ error: 'You must complete a visit or provide a valid authorization code', code: 'VISIT_REQUIRED' }, { status: 403 });
    }

    // Validação mínima de campos obrigatórios
    if (!data.nome || !data.email || !data.valor) {
      return NextResponse.json(
        { error: "Campos obrigatórios: nome, email e valor." },
        { status: 400 }
      );
    }

    const { data: inserted, error } = await supabase
      .from("propostas")
      .insert([data])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erro desconhecido ao processar proposta.";

    console.error("Erro ao processar proposta:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
