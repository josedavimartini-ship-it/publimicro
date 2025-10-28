import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliOutdoor · Visão Geral Executiva',
  description: "Panorama executivo com posicionamento, audiência e KPIs de curto prazo.",
  keywords: ['OOH/DOOH','PubliOutdoor','trends','strategy','insights','pt']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <header>
        <h1 className="text-3xl font-semibold">PubliOutdoor — Visão Geral Executiva</h1>
        <p className="text-zinc-600 mt-2">Panorama executivo com posicionamento, audiência e KPIs de curto prazo.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Contexto</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>OOH/DOOH integra com digital.</li>
          <li>Mensuração evolui com mobile IDs.</li>
          <li>Criatividade dinâmica context-aware.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Mercado e Tendências</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Programmatic DOOH cresce.</li>
          <li>Criativos data-driven por clima/tráfego.</li>
          <li>Sinergia com social/search.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Propostas de Valor</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Planejamento por audiência real.</li>
          <li>Automação de compra e otimização.</li>
          <li>Estudos de brand lift integrados.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Casos de Uso</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Sequências OOH para Mobile.</li>
          <li>Criativos por geofencing e eventos.</li>
          <li>Bundles com retail media.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Métricas & KPIs</h2>
        <p className="text-zinc-700">Alcance, frequência, visitas incrementais, lift de busca, ROI.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Destaques</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliOutdoor - Propostas de Valor</h3>
          <p className="mt-2 text-zinc-600">Como PubliOutdoor entrega valor no segmento OOH/DOOH com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Leia mais →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliOutdoor - Mercado e Tendências</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Pesquisa →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliOutdoor - Casos de Uso</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Estudo de caso →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Próximos passos</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliOutdoor.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
