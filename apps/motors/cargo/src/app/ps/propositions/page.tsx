import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliCargo · Value Propositions',
  description: "Value propositions and offers mapped to segments and use cases.",
  keywords: ['Logística','PubliCargo','trends','strategy','insights','ps']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="rtl">
      <header>
        <h1 className="text-3xl font-semibold">PubliCargo — Value Propositions</h1>
        <p className="text-zinc-600 mt-2">Value propositions and offers mapped to segments and use cases.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Context</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Pressão por eficiência na cadeia logística.</li>
          <li>Digitalização de frete e rastreabilidade.</li>
          <li>Sustentabilidade em foco (ESG).</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Market & Trends</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Telemetria e IA para roteirização.</li>
          <li>eCMR e documentação digital.</li>
          <li>Parcerias shipper-carrier com dados 1P.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Value Propositions</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Captação de frota com MQL qualificado.</li>
          <li>TMS integrado a mídia performance.</li>
          <li>Conteúdo técnico que educa o mercado.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Use Cases</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Geração de leads por lane e sazonalidade.</li>
          <li>Calculadoras de ROI para troca de frota.</li>
          <li>Casos de sucesso por vertical (CPG, Farma).</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Metrics & KPIs</h2>
        <p className="text-zinc-700">Custo por lead, tempo de ciclo, taxa de adesão, ocupação de carga, SLA.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Highlights</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliCargo - Value Propositions</h3>
          <p className="mt-2 text-zinc-600">Como PubliCargo entrega valor no segmento Logística com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Read more →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliCargo - Market & Trends</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Research →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliCargo - Use Cases</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Case study →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">What's next</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliCargo.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
