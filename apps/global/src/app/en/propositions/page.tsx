import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliGlobal · Value Propositions',
  description: "Value propositions and offers mapped to segments and use cases.",
  keywords: ['Global','PubliGlobal','trends','strategy','insights','en']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <header>
        <h1 className="text-3xl font-semibold">PubliGlobal — Value Propositions</h1>
        <p className="text-zinc-600 mt-2">Value propositions and offers mapped to segments and use cases.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Context</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Localização cultural além da tradução.</li>
          <li>Canais e médias por país variam.</li>
          <li>Compliance e dados diferem.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Market & Trends</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Ops globais com hubs regionais.</li>
          <li>Criação com talentos locais.</li>
          <li>Infra multi-moeda e fiscal.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Value Propositions</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Playbooks por país.</li>
          <li>Catálogos e landing pages localizados.</li>
          <li>BI com recortes geográficos.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Use Cases</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Lançamentos por cluster de países.</li>
          <li>Parcerias com mídia local.</li>
          <li>Suporte 24/7 multi-idioma.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Metrics & KPIs</h2>
        <p className="text-zinc-700">Tempo de entrada em mercado, share por país, CAC/LTV por região, SLA.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Highlights</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliGlobal - Value Propositions</h3>
          <p className="mt-2 text-zinc-600">Como PubliGlobal entrega valor no segmento Global com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Read more →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliGlobal - Market & Trends</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Research →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliGlobal - Use Cases</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Case study →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">What's next</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliGlobal.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
