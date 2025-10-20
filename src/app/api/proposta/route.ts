
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const nome = formData.get('nome');
    const email = formData.get('email');
    const telefone = formData.get('telefone');
    const cidade = formData.get('cidade');
    const pais = formData.get('pais');
    const valor = formData.get('valor');
    const condicoes = formData.get('condicoes');
    const justificativa = formData.get('justificativa');
    const prop_id = formData.get('prop_id') || null;

    const { data, error } = await supabase.from('propostas').insert([{
      nome, email, telefone, cidade, pais, valor, condicoes, justificativa, prop_id
    }]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
