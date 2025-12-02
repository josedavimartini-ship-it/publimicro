import Link from "next/link";

export default function Hero(): JSX.Element {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-20 bg-gradient-to-br from-[#1a2a1a] via-[#2a3a2a] to-[#0d1a0d]">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#CD7F32] bg-clip-text text-transparent">Ache</span>
        <span className="bg-gradient-to-r from-[#8B9B6E] via-[#A8C97F] to-[#6B8E23] bg-clip-text text-transparent">Me</span>
      </h1>
      <p className="mt-4 text-lg max-w-2xl text-[#C9A87C]">
        Ecossistema de negócios — imóveis, veículos, oportunidades globais.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/imoveis"
          className="bg-gradient-to-r from-[#6B7F5C] to-[#8B9B6E] text-[#0a0a0a] font-semibold px-6 py-3 rounded-lg shadow-xl hover:from-[#8B9B6E] hover:to-[#A8C97F] transition"
        >
          Ver Anúncios
        </Link>
        <Link
          href="/anunciar"
          className="bg-[#1a2a1a]/50 text-[#A8C97F] border-2 border-[#6B7F5C] font-semibold px-6 py-3 rounded-lg hover:bg-[#6B7F5C]/20 transition"
        >
          Anunciar Agora
        </Link>
      </div>
    </section>
  );
}
