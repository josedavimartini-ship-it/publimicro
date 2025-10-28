import type { Metadata } from "next"
import { Navbar, Footer } from "@publimicro/ui"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Destaques Premium — Publimicro",
  description: "Imóveis, veículos e serviços selecionados pela inteligência Publimicro",
}

// SÍTIOS CARCARÁ - FEATURED PROJECT (Always first)
const carcaraProject = {
  id: "sitios-carcara",
  category: "Proper Rural",
  type: "Projeto Especial",
  title: "Sítios Carcará — 6 Propriedades Ribeirinhas",
  location: "Goiás, Brasil",
  price: "A partir de R$ 850.000",
  image: "🌾",
  highlights: [
    "6 sítios ecológicos à venda",
    "Às margens do rio",
    "Projeto sustentável com reflorestamento",
    "Tour 3D disponível"
  ],
  badge: "DESTAQUE ESPECIAL",
  isFeatured: true,
  href: "/projetos/carcara",
  whatsapp: "5562999999999", // Replace with real number
}

const featuredItems = [
  {
    id: 1,
    category: "Proper",
    type: "Fazenda",
    title: "Fazenda Panorama Vista",
    location: "Região do Triângulo Mineiro, MG",
    price: "R$ 4.850.000",
    image: "🏞️",
    highlights: ["1.200 hectares", "Casa sede restaurada", "Infraestrutura completa"],
    badge: "OPORTUNIDADE",
    href: "/imoveis/1",
    whatsapp: "5562999999999",
  },
  {
    id: 2,
    category: "Motors",
    type: "Caminhonete",
    title: "Toyota Hilux SRX 2024",
    location: "São Paulo, SP",
    price: "R$ 285.000",
    image: "🚙",
    highlights: ["0 km", "Diesel 4x4", "Top de linha"],
    badge: "ZERO KM",
    href: "/motors/2",
    whatsapp: "5511999999999",
  },
  {
    id: 3,
    category: "Journey",
    type: "Experiência",
    title: "Pantanal Premium Safari",
    location: "Corumbá, MS",
    price: "R$ 8.500 /pessoa",
    image: "🦜",
    highlights: ["7 dias", "Guia especializado", "Hospedagem 5 estrelas"],
    badge: "EXCLUSIVO",
    href: "/journey/3",
    whatsapp: "5567999999999",
  },
  {
    id: 4,
    category: "Proper",
    type: "Apartamento",
    title: "Cobertura Jardins",
    location: "São Paulo, SP",
    price: "R$ 3.200.000",
    image: "🏙️",
    highlights: ["280m²", "4 suítes", "Vista panorâmica"],
    badge: "LUXO",
    href: "/imoveis/4",
    whatsapp: "5511999999999",
  },
  {
    id: 5,
    category: "Machina",
    type: "Trator",
    title: "John Deere 6195M",
    location: "Ribeirão Preto, SP",
    price: "R$ 620.000",
    image: "🚜",
    highlights: ["195 HP", "Transmissão AutoPowr", "Apenas 450h"],
    badge: "SEMINOVO",
    href: "/machina/5",
    whatsapp: "5516999999999",
  },
]

const categories = [
  { name: "Todos", value: "all", count: 156 },
  { name: "Proper", value: "proper", count: 45 },
  { name: "Motors", value: "motors", count: 38 },
  { name: "Journey", value: "journey", count: 22 },
  { name: "Machina", value: "machina", count: 18 },
  { name: "Outdoor", value: "outdoor", count: 15 },
]

export default function DestaquesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />

      {/* Hero Section with Gradient */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-[#0b0b0b] to-[#0f0f0f] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-full backdrop-blur-sm">
            <span className="text-2xl">✨</span>
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase">
              Premium Selection
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#cfa847] via-[#e6c86b] to-[#cfa847] bg-clip-text text-transparent">
            Destaques Premium
          </h1>
          
          <p className="text-[#bfa97a] max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-8">
            Anúncios cuidadosamente selecionados pela curadoria Publimicro. 
            <br className="hidden md:block" />
            <span className="text-amber-500/80">Qualidade, verificação e oportunidades exclusivas.</span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#cfa847] mb-1">156+</div>
              <div className="text-xs text-[#bfa97a]">Anúncios Premium</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#cfa847] mb-1">98%</div>
              <div className="text-xs text-[#bfa97a]">Satisfação</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#cfa847] mb-1">24h</div>
              <div className="text-xs text-[#bfa97a]">Suporte Dedicado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="sticky top-0 z-20 border-y border-[#242424] bg-[#0b0b0b]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className="group flex-shrink-0 px-5 py-2.5 rounded-full border border-[#242424] hover:border-amber-500/50 bg-[#0f0f0f] hover:bg-amber-500/10 transition-all"
              >
                <span className="text-sm font-medium text-[#e6c86b] group-hover:text-amber-500">
                  {cat.name}
                </span>
                <span className="ml-2 text-xs text-[#bfa97a]">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED: SÍTIOS CARCARÁ PROJECT - HERO CARD */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#cfa847] mb-2 flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            Projeto em Destaque
          </h2>
          <p className="text-[#bfa97a] text-sm">Oportunidade única de investimento sustentável</p>
        </div>

        {/* Carcará Hero Card */}
        <article className="relative bg-gradient-to-br from-amber-500/10 via-[#0b0b0b] to-[#0f0f0f] border-2 border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/20 mb-16">
          <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-bold rounded-full shadow-xl flex items-center gap-2">
            <span className="text-lg">🌟</span>
            {carcaraProject.badge}
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative h-96 md:h-auto bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0b0b0b] flex items-center justify-center text-9xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-80" />
              <span className="relative z-10 animate-pulse">
                {carcaraProject.image}
              </span>
            </div>

            {/* Content Section */}
            <div className="p-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-400 font-semibold">
                  {carcaraProject.category}
                </span>
                <span className="text-xs text-[#bfa97a]">
                  {carcaraProject.type}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-[#e6c86b] mb-4">
                {carcaraProject.title}
              </h2>

              <p className="text-sm text-[#bfa97a] mb-6 flex items-center gap-2">
                <span className="text-base">📍</span>
                {carcaraProject.location}
              </p>

              <ul className="space-y-3 mb-6">
                {carcaraProject.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-sm text-[#bfa97a] flex items-start gap-3">
                    <span className="text-amber-500 text-lg mt-0.5 flex-shrink-0">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-6 pb-6 border-b border-[#242424]">
                <div className="text-xs text-[#bfa97a] mb-2">A partir de</div>
                <div className="text-4xl font-bold text-[#cfa847]">
                  {carcaraProject.price}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href={carcaraProject.href}
                  className="block text-center px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-base font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/30"
                >
                  🌟 Ver Projeto Completo + Tour 3D
                </Link>

                <a
                  href={`https://wa.me/${carcaraProject.whatsapp}?text=Olá! Tenho interesse no projeto Sítios Carcará.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-6 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-bold rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span className="text-xl">💬</span>
                  Contato via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Other Featured Items Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#cfa847] mb-8">
            Outros Destaques Premium
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <article 
              key={item.id}
              className="group relative bg-gradient-to-b from-[#0b0b0b] to-[#0f0f0f] border border-[#242424] rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2"
            >
              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-amber-500 text-black text-xs font-bold rounded-full shadow-lg">
                {item.badge}
              </div>

              <div className="relative aspect-video bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0b0b0b] flex items-center justify-center text-7xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-60" />
                <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                  {item.image}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 font-semibold">
                    {item.category}
                  </span>
                  <span className="text-xs text-[#bfa97a]/70">
                    {item.type}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[#e6c86b] mb-3 group-hover:text-amber-500 transition-colors line-clamp-2">
                  {item.title}
                </h2>

                <p className="text-sm text-[#bfa97a] mb-4 flex items-center gap-2">
                  <span className="text-base">📍</span>
                  {item.location}
                </p>

                <ul className="space-y-2 mb-5 min-h-[72px]">
                  {item.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-xs text-[#bfa97a] flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5 flex-shrink-0">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-[#242424]">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="text-xs text-[#bfa97a] mb-1">Preço</div>
                      <div className="text-2xl font-bold text-[#cfa847]">
                        {item.price}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      href={item.href}
                      className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-sm font-bold rounded-lg transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20"
                    >
                      Ver Detalhes
                    </Link>
                    <a
                      href={`https://wa.me/${item.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg transition-all hover:scale-105 flex items-center justify-center"
                      title="Contato via WhatsApp"
                    >
                      <span className="text-xl">💬</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-[#bfa97a] mb-6">
            Mostrando <span className="text-[#cfa847] font-semibold">6</span> de{" "}
            <span className="text-[#cfa847] font-semibold">156</span> anúncios premium
          </p>
          <button className="group px-10 py-4 bg-[#0b0b0b] border-2 border-[#242424] hover:border-amber-500/50 text-[#e6c86b] hover:text-amber-500 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95">
            Carregar Mais Destaques
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
