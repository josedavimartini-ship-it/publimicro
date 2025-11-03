import { Navbar, Footer } from "@publimicro/ui"
import VisitScheduler from "@/components/scheduling/VisitScheduler"
import Image from "next/image"
import type { Metadata }from "next"

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
    <main className="min-h-screen flex flex-col relative">
      <Navbar />

      {/* Background Image with Bonfire */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/bonfire-campo.jpg"
          alt="Fogueira no campo"
          fill
          className="object-cover"
          priority
          unoptimized
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Fallback to Unsplash bonfire image
            target.src = "https://images.unsplash.com/photo-1525923838299-2312b60f6d69?w=1920&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />
      </div>

      <section className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#E6C98B] mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            Agendar Visita
          </h1>
          <p className="text-white text-lg max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
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
