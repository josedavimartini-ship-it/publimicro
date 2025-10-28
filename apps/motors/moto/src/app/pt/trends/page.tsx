import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliMotos · Tendências',
  description: "Forças de mercado que moldam a estratégia: demanda, digital, IA e regulação.",
  keywords: ['Duas Rodas','PubliMotos','trends','strategy','insights','pt']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <header>
        <h1 className="text-3xl font-semibold">PubliMotos — Tendências</h1>
        <p className="text-zinc-600 mt-2">Forças de mercado que moldam a estratégia: demanda, digital, IA e regulação.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Contexto</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Alta demanda por entrega e mobilidade urbana.</li>
          <li>Financiamento acessível atrai novos públicos.</li>
          <li>Comunidades digitais influenciam fortemente.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Mercado e Tendências</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Crescem scooters elétricas e conectadas.</li>
          <li>Assinatura e pay-as-you-go para trabalho on-demand.</li>
          <li>Conteúdo UGC impulsiona consideração.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Propostas de Valor</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Simuladores de custo total (TCO) claros.</li>
          <li>Seguro e manutenção como bundle.</li>
          <li>Test rides agendados via chat.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Casos de Uso</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Lançamentos com creators locais.</li>
          <li>Marketplaces integrados a concessionárias.</li>
          <li>Planos para entregadores com benefícios.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Métricas & KPIs</h2>
        <p className="text-zinc-700">CPL, reservas de test ride, churn de assinatura, conversão por segmento, NPS.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Destaques</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliMotos - Propostas de Valor</h3>
          <p className="mt-2 text-zinc-600">Como PubliMotos entrega valor no segmento Duas Rodas com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Leia mais →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliMotos - Mercado e Tendências</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Pesquisa →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliMotos - Casos de Uso</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Estudo de caso →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Próximos passos</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliMotos.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
