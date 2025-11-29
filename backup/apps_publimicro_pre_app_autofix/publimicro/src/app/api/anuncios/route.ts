import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface Anuncio {
  id?: string;
  titulo: string;
  descricao: string;
  preco: number;
  localizacao: string;
  imagens?: string;
  owner_id?: string;
  created_at?: string;
}

// Tipagem explícita e retorno definido
export async function GET(): Promise<NextResponse> {
  const { data, error } = await supabase
    .from("anuncios")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data as Anuncio[] });
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: Partial<Anuncio> = await req.json();

    const { titulo, descricao, preco, localizacao, imagens, owner_id } = body;

    const { data, error } = await supabase
      .from("anuncios")
      .insert([
        { titulo, descricao, preco, localizacao, imagens, owner_id },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data as Anuncio }, { status: 201 });
  } catch (err) {
    // TypeScript-friendly catch sem usar `any`
    const message =
      err instanceof Error ? err.message : "Erro desconhecido no servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
