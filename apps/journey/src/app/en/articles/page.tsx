import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliJourney · Articles & Insights',
  description: "Original articles, analysis and research by the editorial team.",
  keywords: ['Viagens','PubliJourney','trends','strategy','insights','en']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <header>
        <h1 className="text-3xl font-semibold">PubliJourney — Articles & Insights</h1>
        <p className="text-zinc-600 mt-2">Original articles, analysis and research by the editorial team.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Context</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Volatilidade em demanda e tarifas.</li>
          <li>Experiência móvel é canal principal.</li>
          <li>Conteúdo e comunidade influenciam.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Market & Trends</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Bundles dinâmicos com IA.</li>
          <li>Loyalty ligado a experiências.</li>
          <li>Parcerias com creators e UGC.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Value Propositions</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Conversão com pricing transparente.</li>
          <li>Up/cross-sell inteligente.</li>
          <li>Atendimento 24/7 com automação.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Use Cases</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Campanhas por temporada e eventos.</li>
          <li>Geração de conteúdo local autêntico.</li>
          <li>Ofertas last-minute com inventário real.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Metrics & KPIs</h2>
        <p className="text-zinc-700">Conversão, ADR, RevPAR, taxa de reembolso, CAC, LTV.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Highlights</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliJourney - Value Propositions</h3>
          <p className="mt-2 text-zinc-600">Como PubliJourney entrega valor no segmento Viagens com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Read more →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliJourney - Market & Trends</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Research →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliJourney - Use Cases</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Case study →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">What's next</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliJourney.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
