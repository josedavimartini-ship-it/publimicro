import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface ScheduleVisitData {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  cidade: string;
  estado: string;
  pais: string;
  dataPreferencia: string;
  horarioPreferencia: string;
  mensagem?: string;
  visitType: "presencial" | "video";
  propertyId?: string;
  propertyTitle?: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: ScheduleVisitData = await req.json();

    const {
      nome,
      email,
      telefone,
      documento,
      cidade,
      estado,
      pais,
      dataPreferencia,
      horarioPreferencia,
      mensagem,
      visitType,
      propertyId,
      propertyTitle,
    } = body;

    // Validação básica
    if (!nome || !email || !telefone || !documento || !dataPreferencia || !horarioPreferencia) {
      return NextResponse.json(
        { error: "Campos obrigatórios: nome, email, telefone, documento, data e horário." },
        { status: 400 }
      );
    }

    // Salvar no Supabase
    const { data, error } = await supabase
      .from("visitas_agendadas")
      .insert([
        {
          nome,
          email,
          telefone,
          documento,
          cidade,
          estado,
          pais,
          data_preferencia: dataPreferencia,
          horario_preferencia: horarioPreferencia,
          mensagem,
          tipo_visita: visitType,
          property_id: propertyId,
          property_title: propertyTitle,
          status: "pendente", // admin will confirm
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao agendar visita:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TODO: Send email notification to admin and user

    return NextResponse.json({ 
      data,
      message: "Visita agendada com sucesso! Entraremos em contato em breve." 
    }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro desconhecido ao agendar visita.";

    console.error("Erro no endpoint /api/schedule-visit:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
