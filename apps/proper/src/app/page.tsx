import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CarcaraScene } from "@/components/CarcaraScene";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "PubliProper — Imóveis Urbanos e Rurais",
  description: "Encontre imóveis urbanos e rurais em todo o Brasil. Apartamentos, casas, fazendas, sítios e mais.",
};

const sections = [
  { href: "/urban", icon: "🏙️", title: "Proper Urban", tagline: "Imóveis Urbanos" },
  { href: "/rural", icon: "🌾", title: "Proper Rural", tagline: "Imóveis Rurais" },
  { href: "/comercial", icon: "🏢", title: "Comercial", tagline: "Imóveis Comerciais" },
  { href: "/lancamentos", icon: "🏗️", title: "Lançamentos", tagline: "Novos Empreendimentos" },
  { href: "/aluguel", icon: "🔑", title: "Aluguel", tagline: "Locação" },
  { href: "/temporada", icon: "🏖️", title: "Temporada", tagline: "Férias" },
  { href: "/permuta", icon: "🔄", title: "Permuta", tagline: "Troca" },
  { href: "/leilao", icon: "⚖️", title: "Leilão", tagline: "Oportunidades" },
];

const featuredProperties = [
  {
    id: "1",
    title: "Apartamento 3 Quartos - Centro",
    location: "Uberlândia, MG",
    price: "R$ 450.000",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    type: "Urbano",
  },
  {
    id: "2",
    title: "Casa com Piscina - Condomínio",
    location: "Goiânia, GO",
    price: "R$ 850.000",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    type: "Urbano",
  },
  {
    id: "3",
    title: "Fazenda 50 Hectares",
    location: "Uberaba, MG",
    price: "R$ 2.500.000",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
    type: "Rural",
  },
];

export default function ProperHomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* SAME LAYOUT AS MAIN SITE */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-6">
            {/* LEFT 2 */}
            <div className="flex flex-col gap-3 w-64">
              {sections.slice(0, 2).map((s) => (
                <Link
                  key={s.title}
                  href={s.href}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] hover:border-[#FF6B35] transition-all shadow-lg hover:shadow-[#FF6B35]/20"
                >
                  <span className="text-5xl flex-shrink-0">{s.icon}</span>
                  <div className="min-w-0">
                    <div className="text-lg font-bold text-[#B7791F] group-hover:text-[#FF6B35] truncate">{s.title}</div>
                    <div className="text-xs text-[#676767] truncate">{s.tagline}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* CENTER */}
            <div className="flex-1 text-center px-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] via-[#CD7F32] to-[#B87333] leading-tight mb-4">
                PubliProper
              </h1>
              <p className="text-base sm:text-lg text-[#676767] leading-relaxed">
                Imóveis Urbanos e Rurais em Todo o Brasil
                <br />
                <span className="text-[#FF6B35] text-2xl font-bold">•</span> Do apartamento na capital à fazenda no interior
              </p>
            </div>

            {/* RIGHT 2 */}
            <div className="flex flex-col gap-3 w-64">
              {sections.slice(2, 4).map((s) => (
                <Link
                  key={s.title}
                  href={s.href}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] hover:border-[#0D7377] transition-all shadow-lg hover:shadow-[#0D7377]/20"
                >
                  <span className="text-5xl flex-shrink-0">{s.icon}</span>
                  <div className="min-w-0">
                    <div className="text-lg font-bold text-[#B7791F] group-hover:text-[#0D7377] truncate">{s.title}</div>
                    <div className="text-xs text-[#676767] truncate">{s.tagline}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* BOTTOM 4 */}
          <div className="grid grid-cols-4 gap-4">
            {sections.slice(4, 8).map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] hover:border-[#5F7161] transition-all shadow-lg hover:shadow-[#5F7161]/20"
              >
                <span className="text-5xl">{s.icon}</span>
                <div className="text-center">
                  <div className="text-base font-bold text-[#B7791F] group-hover:text-[#5F7161]">{s.title}</div>
                  <div className="text-xs text-[#676767] mt-1">{s.tagline}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BIRD */}
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <CarcaraScene />
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] to-[#CD7F32] mb-8 text-center">
            Destaques em Imóveis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <article
                key={prop.id}
                className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#FF6B35] hover:shadow-2xl hover:shadow-[#FF6B35]/30 transition-all"
              >
                <div className="relative aspect-video">
                  <Image
                    src={prop.image}
                    alt={prop.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-[#0D7377] text-[#0a0a0a] text-xs font-bold rounded-full">
                    {prop.type}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#FF6B35] mb-2">{prop.title}</h3>
                  <p className="text-sm text-[#676767] mb-3">📍 {prop.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#B7791F]">{prop.price}</span>
                    <Link
                      href={`/imoveis/${prop.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold rounded-lg hover:scale-105 transition-all"
                    >
                      Ver →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CARCARÁ HIGHLIGHT (on Proper page too) */}
      <section className="py-10 px-4 sm:px-6 bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-6 py-3 bg-[#FF6B35]/20 border border-[#FF6B35] rounded-full backdrop-blur-md">
            <span className="text-[#FF6B35] font-bold text-sm tracking-wider uppercase">🦅 Projeto Especial</span>
          </div>
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] mb-4">
            Sítios Carcará
          </h2>
          <p className="text-[#D4A574] text-xl mb-8 max-w-2xl mx-auto">
            6 propriedades exclusivas na beira da represa. Lances a partir de R$ 1.050.000.
          </p>
          <Link
            href="https://www.publimicro.com.br/projetos/carcara"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] font-bold rounded-full transition-all hover:scale-105 shadow-xl"
          >
            Explorar Projeto Completo →
          </Link>
        </div>
      </section>

      <footer className="bg-[#0a0a0a] border-t-2 border-[#2a2a1a] py-8 px-4 text-center text-sm text-[#676767]">
        © {new Date().getFullYear()} PubliProper. Todos os direitos reservados.
      </footer>

      <WhatsAppButton />
    </main>
  );
}
