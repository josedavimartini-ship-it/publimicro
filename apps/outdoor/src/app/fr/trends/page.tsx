import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliOutdoor · Trends',
  description: "Market forces shaping strategy: demand shifts, digital, AI and regulation.",
  keywords: ['OOH/DOOH','PubliOutdoor','trends','strategy','insights','fr']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <header>
        <h1 className="text-3xl font-semibold">PubliOutdoor — Trends</h1>
        <p className="text-zinc-600 mt-2">Market forces shaping strategy: demand shifts, digital, AI and regulation.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Context</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>OOH/DOOH integra com digital.</li>
          <li>Mensuração evolui com mobile IDs.</li>
          <li>Criatividade dinâmica context-aware.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Market & Trends</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Programmatic DOOH cresce.</li>
          <li>Criativos data-driven por clima/tráfego.</li>
          <li>Sinergia com social/search.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Value Propositions</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Planejamento por audiência real.</li>
          <li>Automação de compra e otimização.</li>
          <li>Estudos de brand lift integrados.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Use Cases</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Sequências OOH para Mobile.</li>
          <li>Criativos por geofencing e eventos.</li>
          <li>Bundles com retail media.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Metrics & KPIs</h2>
        <p className="text-zinc-700">Alcance, frequência, visitas incrementais, lift de busca, ROI.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Highlights</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliOutdoor - Value Propositions</h3>
          <p className="mt-2 text-zinc-600">Como PubliOutdoor entrega valor no segmento OOH/DOOH com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Read more →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliOutdoor - Market & Trends</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Research →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliOutdoor - Use Cases</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Case study →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">What's next</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliOutdoor.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
