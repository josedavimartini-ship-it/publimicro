import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliCoisas · Articles & Insights',
  description: "Original articles, analysis and research by the editorial team.",
  keywords: ['IoT & Dispositivos','PubliCoisas','trends','strategy','insights','ar']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="rtl">
      <header>
        <h1 className="text-3xl font-semibold">PubliCoisas — Articles & Insights</h1>
        <p className="text-zinc-600 mt-2">Original articles, analysis and research by the editorial team.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Context</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Edge e 5G habilitam novos devices.</li>
          <li>Privacidade e segurança são críticas.</li>
          <li>Hardware+serviço define valor.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Market & Trends</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Matter e padrões abertos.</li>
          <li>Energia eficiente e baterias melhores.</li>
          <li>Modelos as-a-Service.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Value Propositions</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Onboarding simples e seguro.</li>
          <li>Dashboards com valor claro.</li>
          <li>Suporte proativo automatizado.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Use Cases</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Bundles residenciais/industriais.</li>
          <li>Parcerias com telcos/ISPs.</li>
          <li>Planos por uso/consumo.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Metrics & KPIs</h2>
        <p className="text-zinc-700">Ativação, retenção, NPS, tickets por device, ARPU.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Highlights</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliCoisas - Value Propositions</h3>
          <p className="mt-2 text-zinc-600">Como PubliCoisas entrega valor no segmento IoT & Dispositivos com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Read more →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliCoisas - Market & Trends</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Research →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliCoisas - Use Cases</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Case study →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">What's next</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliCoisas.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
