import { Navbar, Footer } from "@publimicro/ui"
import VisitScheduler from "@/components/scheduling/VisitScheduler"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agendar Visita — Publimicro",
  description: "Agende uma visita presencial ou por videoconferência",
}

export default async function ScheduleVisitPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; propertyId?: string; propertyTitle?: string }>
}) {
  const params = await searchParams;
  const { project, propertyId, propertyTitle } = params;

  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />

      <section className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#cfa847] mb-4">
            Agendar Visita
          </h1>
          <p className="text-[#bfa97a] text-lg max-w-2xl mx-auto">
            Escolha entre visita presencial ou videoconferência. 
            Nossa equipe entrará em contato para confirmar o agendamento.
          </p>
        </div>

        <VisitScheduler 
          propertyId={propertyId || project}
          propertyTitle={propertyTitle}
        />
      </section>

      <Footer />
    </main>
  )
}
