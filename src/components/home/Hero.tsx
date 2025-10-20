export default function Hero(){
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-20 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-800 text-white">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Publimicro</h1>
      <p className="mt-4 text-lg max-w-2xl">O melhor portal de classificados, negócios e oportunidades — conectando pessoas, propriedades e ideias.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a href="/imoveis" className="bg-amber-400 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow">Ver Imóveis</a>
        <a href="/anunciar" className="bg-white/10 text-white border border-white/40 font-semibold px-6 py-3 rounded-lg">Anunciar agora</a>
      </div>
    </section>
  )
}
