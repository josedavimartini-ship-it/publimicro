import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliMotos · Articles & Insights',
  description: "Original articles, analysis and research by the editorial team.",
  keywords: ['Duas Rodas','PubliMotos','trends','strategy','insights','en']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <header>
        <h1 className="text-3xl font-semibold">PubliMotos — Articles & Insights</h1>
        <p className="text-zinc-600 mt-2">Original articles, analysis and research by the editorial team.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Context</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Alta demanda por entrega e mobilidade urbana.</li>
          <li>Financiamento acessível atrai novos públicos.</li>
          <li>Comunidades digitais influenciam fortemente.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Market & Trends</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Crescem scooters elétricas e conectadas.</li>
          <li>Assinatura e pay-as-you-go para trabalho on-demand.</li>
          <li>Conteúdo UGC impulsiona consideração.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Value Propositions</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Simuladores de custo total (TCO) claros.</li>
          <li>Seguro e manutenção como bundle.</li>
          <li>Test rides agendados via chat.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Use Cases</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Lançamentos com creators locais.</li>
          <li>Marketplaces integrados a concessionárias.</li>
          <li>Planos para entregadores com benefícios.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Metrics & KPIs</h2>
        <p className="text-zinc-700">CPL, reservas de test ride, churn de assinatura, conversão por segmento, NPS.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Highlights</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliMotos - Value Propositions</h3>
          <p className="mt-2 text-zinc-600">Como PubliMotos entrega valor no segmento Duas Rodas com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Read more →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliMotos - Market & Trends</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Research →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliMotos - Use Cases</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Case study →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">What's next</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliMotos.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
