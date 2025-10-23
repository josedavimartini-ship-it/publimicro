import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

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
