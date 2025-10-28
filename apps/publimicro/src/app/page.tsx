import type { Metadata } from "next"
import { Navbar, Footer } from "@publimicro/ui"
import CarcaraHighlights from "../components/home/CarcaraHighlights"
import { CategoryCard } from "../components/CategoryCard"
import { CarcaraScene } from "../components/CarcaraScene"

export const metadata: Metadata = {
  title: "Publimicro — Ecossistema de Negócios",
  description: "Marketplace, classificados e oportunidades do campo à cidade. Imóveis, veículos, viagens e muito mais.",
  keywords: ["imóveis", "veículos", "classificados", "marketplace", "Brasil"],
  openGraph: {
    title: "Publimicro — Ecossistema de Negócios",
    description: "O maior ecossistema de oportunidades do Brasil",
    type: "website",
  },
}

const categories = [
  { href: "/proper",  icon: "🏠", title: "Proper",  description: "Imóveis urbanos e rurais" },
  { href: "/motors",  icon: "🚗", title: "Motors",  description: "Veículos e maquinários" },
  { href: "/journey", icon: "✈️", title: "Journey", description: "Viagens e experiências" },
  { href: "/share",   icon: "🤝", title: "Share",   description: "Compartilhamento" },
  { href: "/global",  icon: "🌍", title: "Global",  description: "Negócios internacionais" },
  { href: "/machina", icon: "⚙️", title: "Machina", description: "Equipamentos industriais" },
  { href: "/outdoor", icon: "🏕️", title: "Outdoor", description: "Aventura e natureza" },
  { href: "/tudo",    icon: "🛍️", title: "Tudo",    description: "Classificados gerais" },
]

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />

      {/* Hero + 3D */}
      <section
        aria-labelledby="hero-title"
        className="relative flex flex-col justify-center items-center px-6 py-16 text-center"
      >
        <h1 id="hero-title" className="text-4xl md:text-6xl font-bold text-amber-400 mb-4">
          O Ecossistema Publimicro
        </h1>

        <p className="text-[#e7d7a8] max-w-2xl mb-8 text-lg md:text-xl">
          Um universo de negócios, tecnologia e oportunidades — do campo à cidade, do local ao global.
        </p>

        <form
          action="/search"
          method="get"
          role="search"
          className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-2 mb-12"
        >
          <div className="relative w-full">
            <label htmlFor="q-hero" className="sr-only">Pesquisar anúncios</label>
            <input
              id="q-hero"
              name="q"
              type="search"
              autoComplete="off"
              placeholder="Buscar imóveis, veículos, serviços, localidades..."
              className="w-full rounded-full px-6 py-4 bg-[#0b0b0b]/60 border border-amber-900/40 text-[#e6c86b] placeholder-[#bfa97a]/70 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 px-8 py-4 font-semibold text-black transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            Buscar
          </button>
        </form>

        <CarcaraScene />
      </section>

      {/* Categorias */}
      <section aria-labelledby="categories-title" className="max-w-7xl mx-auto px-6 py-16">
        <h2 id="categories-title" className="text-3xl font-bold text-center text-amber-400 mb-12">
          Explore Nossos Mercados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.href} {...category} />
          ))}
        </div>
      </section>

      {/* Super destaque: Sítios Carcará + 6 unidades em destaque do Supabase */}
      <CarcaraHighlights />

      {/* Por que Publimicro */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-amber-400 mb-6">Por que Publimicro?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div>
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-semibold text-amber-300 mb-2">Segurança</h3>
            <p className="text-sm text-[#e7d7a8]">Anúncios verificados e transações protegidas</p>
          </div>
          <div>
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-semibold text-amber-300 mb-2">Rapidez</h3>
            <p className="text-sm text-[#e7d7a8]">Encontre o que procura em segundos</p>
          </div>
          <div>
            <div className="text-4xl mb-3">🌟</div>
            <h3 className="font-semibold text-amber-300 mb-2">Qualidade</h3>
            <p className="text-sm text-[#e7d7a8]">Curadoria premium e suporte dedicado</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}