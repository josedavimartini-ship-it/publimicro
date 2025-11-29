import type { Metadata } from "next"
import { Navbar, Footer } from "@publimicro/ui"

export const metadata: Metadata = {
  title: "Pesquisar — Publimicro",
  description: "Encontre imóveis, veículos, serviços e oportunidades em todo o Brasil",
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ""

  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />

      <section className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-[#cfa847] mb-8">
          Pesquisar Anúncios
        </h1>

        {/* Search Form */}
        <form 
          method="get" 
          className="mb-12"
          role="search"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="q" className="sr-only">
                Termo de busca
              </label>
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Buscar imóveis, veículos, serviços..."
                className="w-full rounded-lg px-6 py-4 bg-[#0b0b0b] border border-[#242424] text-[#e6c86b] placeholder-[#bfa97a]/70 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <button 
              type="submit"
              className="rounded-lg bg-amber-500 hover:bg-amber-400 px-8 py-4 font-semibold text-black transition-all hover:scale-105 active:scale-95"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="mb-8 p-6 bg-[#0b0b0b] border border-[#242424] rounded-lg">
          <h2 className="text-lg font-semibold text-[#e6c86b] mb-4">Filtros</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm text-[#bfa97a] mb-2">
                Categoria
              </label>
              <select
                id="category"
                name="category"
                className="w-full rounded-lg px-4 py-2 bg-[#0f0f0f] border border-[#242424] text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
              >
                <option value="">Todas</option>
                <option value="proper">Proper (Imóveis)</option>
                <option value="motors">Motors (Veículos)</option>
                <option value="journey">Journey (Viagens)</option>
                <option value="share">Share</option>
                <option value="global">Global</option>
                <option value="machina">Machina</option>
                <option value="outdoor">Outdoor</option>
                <option value="tudo">Tudo</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm text-[#bfa97a] mb-2">
                Localização
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Cidade, estado..."
                className="w-full rounded-lg px-4 py-2 bg-[#0f0f0f] border border-[#242424] text-[#e6c86b] placeholder-[#bfa97a]/70 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm text-[#bfa97a] mb-2">
                Faixa de Preço
              </label>
              <select
                id="price"
                name="price"
                className="w-full rounded-lg px-4 py-2 bg-[#0f0f0f] border border-[#242424] text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
              >
                <option value="">Qualquer valor</option>
                <option value="0-50000">Até R$ 50.000</option>
                <option value="50000-100000">R$ 50.000 - R$ 100.000</option>
                <option value="100000-250000">R$ 100.000 - R$ 250.000</option>
                <option value="250000-500000">R$ 250.000 - R$ 500.000</option>
                <option value="500000+">Acima de R$ 500.000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {query ? (
          <div>
            <p className="text-[#bfa97a] mb-6">
              Resultados para: <strong className="text-[#e6c86b]">{query}</strong>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for search results */}
              <div className="p-6 bg-[#0b0b0b] border border-[#242424] rounded-lg text-center">
                <p className="text-[#bfa97a]">
                  Nenhum resultado encontrado. Experimente outros termos de busca.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-[#e6c86b] mb-2">
              Digite algo para começar
            </h3>
            <p className="text-[#bfa97a]">
              Use a barra de busca acima para encontrar anúncios
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
