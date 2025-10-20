
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req) {
  try {
    const body = await req.json();
    const { nome, email, telefone, cidade, pais, mensagem, preferencia_date, prop_id } = body;
    const { data, error } = await supabase.from('contatos_visitas').insert([{
      nome, email, telefone, cidade, pais, mensagem, preferencia_date, prop_id
    }]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
