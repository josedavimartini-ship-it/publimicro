import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Proper Rural — Fazendas, Sítios e Propriedades Rurais",
  description: "Fazendas, sítios, chácaras e propriedades rurais em todo o Brasil. Produção, lazer e investimento.",
}

const propertyTypes = [
  { value: "fazenda", label: "Fazendas", icon: "??", count: "320+", desc: "Produção e pecuária" },
  { value: "sitio", label: "Sítios", icon: "??", count: "450+", desc: "Lazer e moradia" },
  { value: "chacara", label: "Chácaras", icon: "??", count: "280+", desc: "Fim de semana" },
  { value: "terreno", label: "Terrenos", icon: "??", count: "190+", desc: "Investimento" },
]

const regions = [
  { name: "Triângulo Mineiro", state: "MG", properties: "85+" },
  { name: "Sul de Minas", state: "MG", properties: "120+" },
  { name: "Interior de SP", state: "SP", properties: "200+" },
  { name: "Norte do Paraná", state: "PR", properties: "65+" },
  { name: "Centro-Oeste", state: "GO/MT/MS", properties: "140+" },
  { name: "Vale do Paraíba", state: "SP/RJ", properties: "75+" },
]

export default function ProperRuralPage() {
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
            <span className="text-[#cfa847] font-semibold">Rural</span>
          </div>
          <Link 
            href="/post"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-lg transition-all"
          >
            Anunciar Propriedade
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 text-center bg-gradient-to-b from-[#0b0b0b] to-[#0f0f0f]">
        <div className="text-6xl mb-6">??</div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#cfa847] mb-4">
          Proper Rural
        </h1>
        <p className="text-[#bfa97a] max-w-2xl mx-auto text-lg">
          Fazendas, sítios, chácaras e propriedades rurais. 
          Do agronegócio ao refúgio de fim de semana.
        </p>
      </section>

      {/* Quick Stats */}
      <section className="border-y border-[#242424] bg-[#0b0b0b]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[#cfa847] mb-1">1.240+</div>
              <div className="text-xs text-[#bfa97a]">Propriedades</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#cfa847] mb-1">450K+</div>
              <div className="text-xs text-[#bfa97a]">Hectares Totais</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#cfa847] mb-1">R$ 2.8Bi</div>
              <div className="text-xs text-[#bfa97a]">Em Negociação</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#cfa847] mb-1">95%</div>
              <div className="text-xs text-[#bfa97a]">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="bg-[#0b0b0b] border border-[#242424] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[#e6c86b] mb-6">
            Encontre sua Propriedade Rural
          </h2>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="region" className="block text-sm text-[#bfa97a] mb-2">
                  Região
                </label>
                <select
                  id="region"
                  className="w-full rounded-lg px-4 py-3 bg-[#0f0f0f] border border-[#242424] text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Todas as regiões</option>
                  {regions.map((region) => (
                    <option key={region.name} value={region.name}>
                      {region.name}, {region.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm text-[#bfa97a] mb-2">
                  Tipo de Propriedade
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
                <label htmlFor="purpose" className="block text-sm text-[#bfa97a] mb-2">
                  Finalidade
                </label>
                <select
                  id="purpose"
                  className="w-full rounded-lg px-4 py-3 bg-[#0f0f0f] border border-[#242424] text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Todas</option>
                  <option value="producao">Produção/Agronegócio</option>
                  <option value="lazer">Lazer/Moradia</option>
                  <option value="investimento">Investimento</option>
                  <option value="misto">Misto</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="area-min" className="block text-sm text-[#bfa97a] mb-2">
                  Área Mínima (hectares)
                </label>
                <input
                  id="area-min"
                  type="number"
                  placeholder="0"
                  className="w-full rounded-lg px-4 py-3 bg-[#0f0f0f] border border-[#242424] text-[#e6c86b] placeholder-[#bfa97a]/50 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label htmlFor="area-max" className="block text-sm text-[#bfa97a] mb-2">
                  Área Máxima (hectares)
                </label>
                <input
                  id="area-max"
                  type="number"
                  placeholder="10000"
                  className="w-full rounded-lg px-4 py-3 bg-[#0f0f0f] border border-[#242424] text-[#e6c86b] placeholder-[#bfa97a]/50 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full rounded-lg bg-amber-500 hover:bg-amber-400 px-6 py-4 font-semibold text-black transition-all hover:scale-[1.02]"
            >
              Buscar Propriedades Rurais
            </button>
          </form>
        </div>
      </section>

      {/* Property Types Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <h2 className="text-2xl font-bold text-[#cfa847] mb-8">
          Buscar por Tipo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {propertyTypes.map((type) => (
            <button
              key={type.value}
              className="p-6 bg-[#0b0b0b] border border-[#242424] rounded-lg hover:border-amber-500/30 transition-all hover:scale-105 text-left"
            >
              <div className="text-5xl mb-4">{type.icon}</div>
              <div className="font-bold text-[#e6c86b] mb-1">
                {type.label}
              </div>
              <div className="text-xs text-[#bfa97a] mb-3">
                {type.desc}
              </div>
              <div className="text-sm text-amber-500 font-semibold">
                {type.count} disponíveis
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Regions */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <h2 className="text-2xl font-bold text-[#cfa847] mb-8">
          Regiões em Destaque
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => (
            <button
              key={region.name}
              className="p-6 bg-[#0b0b0b] border border-[#242424] rounded-lg hover:border-amber-500/30 transition-all hover:scale-105 text-left"
            >
              <div className="text-2xl mb-3">??</div>
              <div className="font-bold text-[#e6c86b] mb-1">
                {region.name}
              </div>
              <div className="text-xs text-[#bfa97a] mb-3">
                {region.state}
              </div>
              <div className="text-sm text-amber-500 font-semibold">
                {region.properties} propriedades
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <h2 className="text-2xl font-bold text-[#cfa847] mb-8">
          Propriedades em Destaque
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { name: "Fazenda São Francisco", area: "850 ha", location: "Uberaba, MG", price: "R$ 15.000.000" },
            { name: "Sítio Recanto Verde", area: "42 ha", location: "Socorro, SP", price: "R$ 1.850.000" },
            { name: "Fazenda Boa Vista", area: "1.200 ha", location: "Rio Verde, GO", price: "R$ 28.500.000" },
          ].map((property, i) => (
            <div 
              key={i}
              className="bg-[#0b0b0b] border border-[#242424] rounded-lg overflow-hidden hover:border-amber-500/30 transition-all"
            >
              <div className="aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center text-5xl">
                ??
              </div>
              <div className="p-6">
                <div className="text-xs text-amber-500 mb-2 font-semibold">DESTAQUE RURAL</div>
                <h3 className="font-bold text-[#e6c86b] mb-2">
                  {property.name}
                </h3>
                <p className="text-sm text-[#bfa97a] mb-1">
                  ?? {property.location}
                </p>
                <p className="text-sm text-[#bfa97a] mb-4">
                  ?? {property.area}
                </p>
                <div className="text-xl font-bold text-[#cfa847] mb-4">
                  {property.price}
                </div>
                <button className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-all">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-8 py-4 bg-[#0b0b0b] border border-[#242424] hover:border-amber-500/30 text-[#e6c86b] rounded-lg font-semibold transition-all hover:scale-105">
            Ver Todas as Propriedades Rurais
          </button>
        </div>
      </section>

      {/* CTA for Sellers */}
      <section className="px-6 py-16 text-center bg-gradient-to-t from-[#0b0b0b] to-[#0f0f0f]">
        <h2 className="text-3xl font-bold text-[#cfa847] mb-4">
          Tem uma propriedade rural para vender?
        </h2>
        <p className="text-[#bfa97a] mb-8 max-w-2xl mx-auto">
          Anuncie gratuitamente e conecte-se com compradores qualificados e investidores do agronegócio.
        </p>
        <Link
          href="/post"
          className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all hover:scale-105 shadow-lg"
        >
          Anunciar Propriedade — É Grátis
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#242424] bg-[#0b0b0b] px-6 py-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-[#bfa97a]">
          <p>© 2025 Publimicro Proper Rural. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
