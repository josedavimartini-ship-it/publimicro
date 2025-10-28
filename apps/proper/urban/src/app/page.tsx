import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Proper Urban — Imóveis Urbanos",
  description: "Apartamentos, casas, imóveis comerciais e terrenos urbanos em todo o Brasil",
}

const propertyTypes = [
  { value: "apartamento", label: "Apartamentos", icon: "??", count: "850+" },
  { value: "casa", label: "Casas", icon: "??", count: "620+" },
  { value: "comercial", label: "Comerciais", icon: "??", count: "340+" },
  { value: "terreno", label: "Terrenos", icon: "??", count: "180+" },
  { value: "cobertura", label: "Coberturas", icon: "??", count: "95+" },
  { value: "studio", label: "Studios", icon: "???", count: "210+" },
]

const featuredCities = [
  "São Paulo, SP",
  "Rio de Janeiro, RJ",
  "Belo Horizonte, MG",
  "Brasília, DF",
  "Curitiba, PR",
  "Porto Alegre, RS",
]

export default function ProperUrbanPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      {/* Navigation */}
      <nav className="border-b border-[#242424] bg-[#0b0b0b]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/proper"
              className="text-[#bfa97a] hover:text-amber-500 text-sm font-medium transition-colors"
            >
              ? Proper
            </Link>
            <span className="text-[#242424]">|</span>
            <span className="text-[#cfa847] font-semibold">Urban</span>
          </div>
          <Link 
            href="/post"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-lg transition-all"
          >
            Anunciar Imóvel
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 text-center bg-gradient-to-b from-[#0b0b0b] to-[#0f0f0f]">
        <div className="text-6xl mb-6">???</div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#cfa847] mb-4">
          Proper Urban
        </h1>
        <p className="text-[#bfa97a] max-w-2xl mx-auto text-lg">
          Imóveis urbanos em capitais e grandes cidades. Apartamentos, casas, 
          comerciais e oportunidades de investimento.
        </p>
      </section>

      {/* Search & Filters */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="bg-[#0b0b0b] border border-[#242424] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[#e6c86b] mb-6">
            Encontre seu Imóvel Urbano
          </h2>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm text-[#bfa97a] mb-2">
                  Cidade
                </label>
                <select
                  id="city"
                  className="w-full rounded-lg px-4 py-3 bg-[#0f0f0f] border border-[#242424] text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Todas as cidades</option>
                  {featuredCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm text-[#bfa97a] mb-2">
                  Tipo de Imóvel
                </label>
                <select
                  id="type"
                  className="w-full rounded-lg px-4 py-3 bg-[#0f0f0f] border border-[#242424] text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Todos os tipos</option>
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="transaction" className="block text-sm text-[#bfa97a] mb-2">
                  Finalidade
                </label>
                <select
                  id="transaction"
                  className="w-full rounded-lg px-4 py-3 bg-[#0f0f0f] border border-[#242424] text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Venda e Aluguel</option>
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price-min" className="block text-sm text-[#bfa97a] mb-2">
                  Preço Mínimo
                </label>
                <input
                  id="price-min"
                  type="number"
                  placeholder="R$ 0"
                  className="w-full rounded-lg px-4 py-3 bg-[#0f0f0f] border border-[#242424] text-[#e6c86b] placeholder-[#bfa97a]/50 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label htmlFor="price-max" className="block text-sm text-[#bfa97a] mb-2">
                  Preço Máximo
                </label>
                <input
                  id="price-max"
                  type="number"
                  placeholder="R$ 10.000.000"
                  className="w-full rounded-lg px-4 py-3 bg-[#0f0f0f] border border-[#242424] text-[#e6c86b] placeholder-[#bfa97a]/50 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full rounded-lg bg-amber-500 hover:bg-amber-400 px-6 py-4 font-semibold text-black transition-all hover:scale-[1.02]"
            >
              Buscar Imóveis Urbanos
            </button>
          </form>
        </div>
      </section>

      {/* Property Types Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <h2 className="text-2xl font-bold text-[#cfa847] mb-8">
          Buscar por Tipo
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {propertyTypes.map((type) => (
            <button
              key={type.value}
              className="p-6 bg-[#0b0b0b] border border-[#242424] rounded-lg hover:border-amber-500/30 transition-all hover:scale-105 text-center"
            >
              <div className="text-4xl mb-3">{type.icon}</div>
              <div className="font-semibold text-[#e6c86b] mb-1 text-sm">
                {type.label}
              </div>
              <div className="text-xs text-[#bfa97a]">
                {type.count}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Listings Placeholder */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <h2 className="text-2xl font-bold text-[#cfa847] mb-8">
          Destaques Urbanos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="bg-[#0b0b0b] border border-[#242424] rounded-lg overflow-hidden hover:border-amber-500/30 transition-all"
            >
              <div className="aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center text-4xl">
                ???
              </div>
              <div className="p-6">
                <div className="text-xs text-amber-500 mb-2">DESTAQUE</div>
                <h3 className="font-bold text-[#e6c86b] mb-2">
                  Imóvel em Destaque {i}
                </h3>
                <p className="text-sm text-[#bfa97a] mb-4">
                  Localização premium • Acabamento de alto padrão
                </p>
                <div className="text-xl font-bold text-[#cfa847]">
                  R$ {(250000 + i * 100000).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#242424] bg-[#0b0b0b] px-6 py-8 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-[#bfa97a]">
          <p>© 2025 Publimicro Proper Urban. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
