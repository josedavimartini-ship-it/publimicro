import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CarcaraScene } from "@/components/CarcaraScene";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Home, Building2, Tractor, Sparkles } from "lucide-react";

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
  const categories = [
    {
      title: "Proper Urban",
      icon: <Building2 className="w-12 h-12" />,
      href: "/proper/urban",
      description: "Apartamentos, casas e imóveis urbanos",
      color: "from-[#FF6B35] to-[#FF8C42]",
    },
    {
      title: "Proper Rural",
      icon: <Tractor className="w-12 h-12" />,
      href: "/proper/rural",
      description: "Sítios, fazendas e chácaras",
      color: "from-[#5F7161] to-[#0D7377]",
    },
    {
      title: "Comercial",
      icon: <Building2 className="w-12 h-12" />,
      href: "/proper/comercial",
      description: "Salas, galpões e pontos comerciais",
      color: "from-[#B7791F] to-[#CD7F32]",
    },
    {
      title: "Lançamentos",
      icon: <Sparkles className="w-12 h-12" />,
      href: "/proper/lancamentos",
      description: "Novos empreendimentos",
      color: "from-[#FF6B35] to-[#B7791F]",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] via-[#CD7F32] to-[#B87333] mb-6">
            PubliProper
          </h1>
          <p className="text-2xl text-[#d8c68e] mb-4">Seu imóvel ideal está aqui</p>
          <p className="text-lg text-[#676767] max-w-2xl mx-auto">
            Do campo à cidade, encontre apartamentos, casas, sítios, fazendas e muito mais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 hover:border-[#FF6B35] transition-all hover:scale-105"
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center text-[#0a0a0a] mb-6`}>
                {category.icon}
              </div>
              <h2 className="text-3xl font-bold text-[#B7791F] group-hover:text-[#FF6B35] transition-colors mb-3">
                {category.title}
              </h2>
              <p className="text-[#676767]">{category.description}</p>
              <div className="mt-6 text-[#FF6B35] group-hover:translate-x-2 transition-transform">
                Ver anúncios →
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-[#B7791F] mb-4">Quer anunciar seu imóvel?</h3>
          <p className="text-[#676767] mb-6">Publique grátis e alcance milhares de compradores</p>
          <Link
            href="/anunciar"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] font-bold rounded-full transition-all hover:scale-105"
          >
            📢 Publicar Anúncio Grátis
          </Link>
        </div>
      </div>
    </main>
  );
}
