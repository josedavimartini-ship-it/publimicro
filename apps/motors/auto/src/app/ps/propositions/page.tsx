import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliAutos · Value Propositions',
  description: "Value propositions and offers mapped to segments and use cases.",
  keywords: ['Automotivo','PubliAutos','trends','strategy','insights','ps']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="rtl">
      <header>
        <h1 className="text-3xl font-semibold">PubliAutos — Value Propositions</h1>
        <p className="text-zinc-600 mt-2">Value propositions and offers mapped to segments and use cases.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Context</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Eletrificação e conectividade avançam no varejo automotivo.</li>
          <li>Experiência omnicanal redefine funil de compra.</li>
          <li>Dados de frota e pós-venda viram diferenciais.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Market & Trends</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>EVs e híbridos puxam novos modelos de assinatura.</li>
          <li>1P data de montadoras acelera mídia retail.</li>
          <li>IA para precificação dinâmica e lead scoring.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Value Propositions</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Aquisicão qualificada com dados contextuais.</li>
          <li>Plataformas de estoque com SEO forte.</li>
          <li>CRM e pós-venda com jornadas personalizadas.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Use Cases</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Campanhas regionais por disponibilidade real de estoque.</li>
          <li>Catálogo com vídeo 360 e financiamento instantâneo.</li>
          <li>Ofertas de serviço vinculadas a telemetria.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Metrics & KPIs</h2>
        <p className="text-zinc-700">CPL, taxa de aprovação de crédito, tempo de estoque, VDP views, ROAS, CAC por modelo.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Highlights</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliAutos - Value Propositions</h3>
          <p className="mt-2 text-zinc-600">Como PubliAutos entrega valor no segmento Automotivo com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Read more →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliAutos - Market & Trends</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Research →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliAutos - Use Cases</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Case study →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">What's next</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliAutos.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
