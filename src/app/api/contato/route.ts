import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface ContatoRequestBody {
  nome: string;
  email: string;
  telefone?: string;
  cidade?: string;
  pais?: string;
  mensagem: string;
  preferencia_date?: string;
  prop_id?: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: ContatoRequestBody = await req.json();

    const {
      nome,
      email,
      telefone,
      cidade,
      pais,
      mensagem,
      preferencia_date,
      prop_id,
    } = body;

    // Validação básica
    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { error: "Campos obrigatórios: nome, email e mensagem." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("contatos")
      .insert([
        {
          nome,
          email,
          telefone,
          cidade,
          pais,
          mensagem,
          preferencia_date,
          prop_id,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erro desconhecido ao processar o contato.";

    console.error("Erro no endpoint /api/contato:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
