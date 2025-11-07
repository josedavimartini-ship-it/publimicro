import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

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
  const supabase = createServerSupabaseClient();
  
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

    // Get authenticated user (optional - guests can also schedule)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Combine date and time for scheduled_at
    const scheduledAt = new Date(`${dataPreferencia}T${horarioPreferencia}`).toISOString();

    // Salvar no Supabase - using 'visits' table
    const { data, error } = await supabase
      .from("visits")
      .insert([
        {
          ad_id: propertyId || "general",
          user_id: user?.id || null,
          guest_name: nome,
          guest_email: email,
          guest_phone: telefone,
          visit_type: visitType === "presencial" ? "in_person" : "video",
          scheduled_at: scheduledAt,
          status: "requested",
          notes: mensagem || null,
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
