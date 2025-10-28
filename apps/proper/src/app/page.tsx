import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Proper — Imóveis Urbanos e Rurais",
  description: "Encontre imóveis urbanos e rurais em todo o Brasil. Apartamentos, casas, fazendas, sítios e mais.",
}

const categories = [
  {
    href: "/urban",
    icon: "???",
    title: "Proper Urban",
    description: "Apartamentos, casas, comerciais e terrenos urbanos",
    featured: ["São Paulo", "Rio de Janeiro", "Belo Horizonte"],
  },
  {
    href: "/rural",
    icon: "??",
    title: "Proper Rural",
    description: "Fazendas, sítios, chácaras e propriedades rurais",
    featured: ["Triângulo Mineiro", "Sul de Minas", "Interior SP"],
  },
]

const stats = [
  { value: "2.500+", label: "Imóveis Ativos" },
  { value: "450+", label: "Vendas/Mês" },
  { value: "98%", label: "Satisfação" },
]

export default function ProperHomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      {/* Navigation */}
      <nav className="border-b border-[#242424] bg-[#0b0b0b]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="text-[#cfa847] hover:text-amber-500 text-sm font-medium transition-colors"
          >
            ? Voltar ao Publimicro
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/urban" className="text-[#e6c86b] hover:text-amber-500 text-sm font-medium">
              Urban
            </Link>
            <Link href="/rural" className="text-[#e6c86b] hover:text-amber-500 text-sm font-medium">
              Rural
            </Link>
            <Link 
              href="/post"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-lg transition-all"
            >
              Anunciar Imóvel
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center bg-gradient-to-b from-[#0b0b0b] to-[#0f0f0f]">
        <h1 className="text-5xl md:text-6xl font-bold text-[#cfa847] mb-6">
          Proper
        </h1>
        
        <p className="text-[#bfa97a] max-w-3xl mx-auto text-xl mb-12">
          Imóveis urbanos e rurais em todo o Brasil. 
          Do apartamento na capital à fazenda no interior — encontre seu espaço ideal.
        </p>

        {/* Search */}
        <form 
          action="/search" 
          method="get"
          className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4"
        >
          <input
            name="q"
            type="search"
            placeholder="Buscar imóveis por localização, tipo, características..."
            className="flex-1 rounded-lg px-6 py-4 bg-[#0b0b0b] border border-[#242424] text-[#e6c86b] placeholder-[#bfa97a]/70 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
          <button 
            type="submit"
            className="rounded-lg bg-amber-500 hover:bg-amber-400 px-8 py-4 font-semibold text-black transition-all hover:scale-105"
          >
            Buscar
          </button>
        </form>
      </section>

      {/* Stats */}
      <section className="border-y border-[#242424] bg-[#0b0b0b]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-[#cfa847] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[#bfa97a]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full">
        <h2 className="text-3xl font-bold text-center text-[#cfa847] mb-12">
          Escolha seu Mercado
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group p-8 bg-[#0b0b0b] border border-[#242424] rounded-xl hover:border-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/5"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-[#e6c86b] mb-3 group-hover:text-amber-500 transition-colors">
                {category.title}
              </h3>
              
              <p className="text-[#bfa97a] mb-6">
                {category.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {category.featured.map((location) => (
                  <span 
                    key={location}
                    className="text-xs px-3 py-1 bg-[#0f0f0f] border border-[#242424] rounded-full text-[#bfa97a]"
                  >
                    {location}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 text-amber-500 font-semibold">
                Explorar {category.title}
                <span className="group-hover:translate-x-1 transition-transform">?</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center bg-gradient-to-t from-[#0b0b0b] to-[#0f0f0f]">
        <h2 className="text-3xl font-bold text-[#cfa847] mb-4">
          Tem um imóvel para vender ou alugar?
        </h2>
        <p className="text-[#bfa97a] mb-8 max-w-2xl mx-auto">
          Anuncie gratuitamente e alcance milhares de compradores e locatários em potencial.
        </p>
        <Link
          href="/post"
          className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all hover:scale-105 shadow-lg"
        >
          Anunciar Agora — É Grátis
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#242424] bg-[#0b0b0b] px-6 py-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-[#bfa97a]">
          <p>© 2025 Publimicro Proper. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
