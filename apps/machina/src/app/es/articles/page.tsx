import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliMachina · Artículos e Insights',
  description: "Artículos originales, análisis e investigación del equipo editorial.",
  keywords: ['Máquinas & Agro','PubliMachina','trends','strategy','insights','es']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <header>
        <h1 className="text-3xl font-semibold">PubliMachina — Artículos e Insights</h1>
        <p className="text-zinc-600 mt-2">Artículos originales, análisis e investigación del equipo editorial.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Contexto</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Capex alto exige prova de ROI.</li>
          <li>Safras e obras definem sazonalidade.</li>
          <li>Rede de dealers é decisiva.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Mercado y Tendencias</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Fintechs de agro/máquinas viabilizam crédito.</li>
          <li>Telemetria orienta manutenção preditiva.</li>
          <li>Conteúdos técnicos formam demanda.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Propuestas de Valor</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Ferramentas de ROI por operação e terreno.</li>
          <li>Catálogo técnico com comparativos.</li>
          <li>Jornadas com dealer locator e demos.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Casos de Uso</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Campanhas por cultura (soja, milho) e região.</li>
          <li>Leads por capacidade e implementos.</li>
          <li>Planos de manutenção conectados.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Métricas y KPIs</h2>
        <p className="text-zinc-700">Leads qualificados, taxa de demo, ciclo de venda, ticket médio, LTV.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Destacados</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliMachina - Propuestas de Valor</h3>
          <p className="mt-2 text-zinc-600">Como PubliMachina entrega valor no segmento Máquinas & Agro com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Leer más →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliMachina - Mercado y Tendencias</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Investigación →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliMachina - Casos de Uso</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Caso de estudio →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Próximos pasos</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliMachina.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
