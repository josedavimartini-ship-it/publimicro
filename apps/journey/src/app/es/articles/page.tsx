import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliJourney · Artículos e Insights',
  description: "Artículos originales, análisis e investigación del equipo editorial.",
  keywords: ['Viagens','PubliJourney','trends','strategy','insights','es']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <header>
        <h1 className="text-3xl font-semibold">PubliJourney — Artículos e Insights</h1>
        <p className="text-zinc-600 mt-2">Artículos originales, análisis e investigación del equipo editorial.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Contexto</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Volatilidade em demanda e tarifas.</li>
          <li>Experiência móvel é canal principal.</li>
          <li>Conteúdo e comunidade influenciam.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Mercado y Tendencias</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Bundles dinâmicos com IA.</li>
          <li>Loyalty ligado a experiências.</li>
          <li>Parcerias com creators e UGC.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Propuestas de Valor</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Conversão com pricing transparente.</li>
          <li>Up/cross-sell inteligente.</li>
          <li>Atendimento 24/7 com automação.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Casos de Uso</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Campanhas por temporada e eventos.</li>
          <li>Geração de conteúdo local autêntico.</li>
          <li>Ofertas last-minute com inventário real.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Métricas y KPIs</h2>
        <p className="text-zinc-700">Conversão, ADR, RevPAR, taxa de reembolso, CAC, LTV.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Destacados</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliJourney - Propuestas de Valor</h3>
          <p className="mt-2 text-zinc-600">Como PubliJourney entrega valor no segmento Viagens com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Leer más →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliJourney - Mercado y Tendencias</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Investigación →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliJourney - Casos de Uso</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Caso de estudio →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Próximos pasos</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliJourney.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
