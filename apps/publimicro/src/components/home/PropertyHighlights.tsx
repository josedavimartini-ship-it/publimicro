import Link from "next/link";

export default function PropertyHighlights() {
  // This will be replaced with real data from Supabase
  const highlights = [
    {
      id: 1,
      title: "Casa com 3 quartos",
      location: "Uberlândia, MG",
      price: "R$ 450.000",
      image: "/placeholder-property.jpg",
      type: "Urbano"
    },
    // Add more mock data as needed
  ];

  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-amber-400 mb-2">
              Destaques em Imóveis
            </h2>
            <p className="text-[#8a8a6a]">
              Propriedades selecionadas para você
            </p>
          </div>
          <Link 
            href="https://proper.publimicro.com.br"
            className="hidden sm:flex items-center gap-2 px-4 py-2 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 rounded-full transition-colors"
          >
            Ver todos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder cards - will be replaced with real data */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item}
              className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg overflow-hidden hover:border-amber-500/50 transition-all group"
            >
              <div className="aspect-video bg-[#1a1a1a] flex items-center justify-center">
                <span className="text-[#4a4a4a]">Imagem do imóvel</span>
              </div>
              <div className="p-4">
                <div className="text-xs text-amber-500 mb-1">Urbano</div>
                <h3 className="font-semibold text-[#e6c86b] mb-2 group-hover:text-amber-400">
                  Propriedade {item}
                </h3>
                <p className="text-sm text-[#8a8a6a] mb-3">Uberlândia, MG</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-amber-400">R$ —</span>
                  <Link
                    href={`https://proper.publimicro.com.br/imovel/${item}`}
                    className="text-sm text-amber-500 hover:text-amber-400"
                  >
                    Ver detalhes →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="https://proper.publimicro.com.br"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full transition-all hover:scale-105"
          >
            Ver todos os imóveis
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}