import Link from 'next/link';

export default function ProperRuralPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5F7161] to-[#0D7377] mb-6">
            Proper Rural
          </h1>
          <p className="text-xl text-[#d8c68e] mb-4">
            Sítios, fazendas e chácaras
          </p>
        </div>

        {/* Featured: Sítios Carcará */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-4 border-[#FF6B35] rounded-2xl p-12 mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 bg-[#FF6B35]/30 border-2 border-[#FF6B35] rounded-full">
            <span className="text-[#FF6B35] font-bold uppercase tracking-wider">
              🦅 Destaque Especial
            </span>
          </div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#B7791F] mb-4">
            Sítios Carcará's Project
          </h2>
          <p className="text-[#d8c68e] text-lg mb-6">
            6 propriedades exclusivas às margens da represa. Lances a partir de R$ 1.050.000
          </p>
          <Link
            href="/projetos/carcara"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] font-bold rounded-full transition-all hover:scale-105"
          >
            🏡 Explorar Projeto Completo
          </Link>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-12 text-center">
          <div className="text-6xl mb-6">🌾</div>
          <h2 className="text-2xl font-bold text-[#B7791F] mb-4">Mais imóveis rurais em breve!</h2>
          <p className="text-[#676767] mb-8">
            Estamos catalogando as melhores propriedades rurais para você.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/proper"
              className="px-8 py-3 border-2 border-[#5F7161] text-[#5F7161] hover:bg-[#5F7161]/10 font-bold rounded-full transition-all"
            >
              ← Voltar
            </Link>
            <Link
              href="/anunciar"
              className="px-8 py-3 bg-gradient-to-r from-[#5F7161] to-[#0D7377] hover:from-[#0D7377] hover:to-[#5F7161] text-white font-bold rounded-full transition-all hover:scale-105"
            >
              Anunciar Grátis
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}