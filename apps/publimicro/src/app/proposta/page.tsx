import ProposalForm from '@/components/forms/ProposalForm';
import { Navbar, Footer } from "@publimicro/ui";
import Image from "next/image";
import { Gavel, Shield, FileCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fazer Proposta — AcheMe",
  description: "Envie sua proposta de aquisição de forma segura",
};

type SearchParams = {
  propId?: string;
  property?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<JSX.Element> {
  const resolved = await searchParams;
  const propId = resolved?.propId ?? resolved?.property ?? null;

  return (
    <main className="min-h-screen flex flex-col relative">
      <Navbar />

      {/* Background Image - Professional Business Theme */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80"
          alt="Negociação profissional"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90" />
      </div>

      <section className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] rounded-full shadow-lg">
            <Gavel className="w-5 h-5 text-black" />
            <span className="text-black font-bold text-sm tracking-wider uppercase">Proposta de Aquisição</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#E6C98B] mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            Fazer Proposta
          </h1>
          <p className="text-[#B8A890] text-lg max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,1)] mb-8">
            Envie sua proposta com segurança. Nossa equipe analisará e entrará em contato em até 48 horas.
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-[#A8C97F]">
              <Shield className="w-5 h-5" />
              <span className="text-sm">100% Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-[#A8C97F]">
              <FileCheck className="w-5 h-5" />
              <span className="text-sm">Dados Protegidos</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a]/90 backdrop-blur-md rounded-2xl border-2 border-[#2a2a1a] p-8 shadow-2xl">
          <ProposalForm propId={propId} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
