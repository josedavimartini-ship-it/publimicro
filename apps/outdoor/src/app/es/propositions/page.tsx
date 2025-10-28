import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliOutdoor · Propuestas de Valor',
  description: "Propuestas de valor y ofertas por segmentos y casos de uso.",
  keywords: ['OOH/DOOH','PubliOutdoor','trends','strategy','insights','es']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <header>
        <h1 className="text-3xl font-semibold">PubliOutdoor — Propuestas de Valor</h1>
        <p className="text-zinc-600 mt-2">Propuestas de valor y ofertas por segmentos y casos de uso.</p>
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
        <h2 className="text-xl font-medium">Mercado y Tendencias</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Programmatic DOOH cresce.</li>
          <li>Criativos data-driven por clima/tráfego.</li>
          <li>Sinergia com social/search.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Propuestas de Valor</h2>
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
        <h2 className="text-xl font-medium">Métricas y KPIs</h2>
        <p className="text-zinc-700">Alcance, frequência, visitas incrementais, lift de busca, ROI.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Destacados</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliOutdoor - Propuestas de Valor</h3>
          <p className="mt-2 text-zinc-600">Como PubliOutdoor entrega valor no segmento OOH/DOOH com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Leer más →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliOutdoor - Mercado y Tendencias</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Investigación →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliOutdoor - Casos de Uso</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Caso de estudio →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Próximos pasos</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliOutdoor.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
