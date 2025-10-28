import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliCargo · Resumen Ejecutivo',
  description: "Panorama ejecutivo con posicionamiento, audiencia y KPIs de corto plazo.",
  keywords: ['Logística','PubliCargo','trends','strategy','insights','es']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <header>
        <h1 className="text-3xl font-semibold">PubliCargo — Resumen Ejecutivo</h1>
        <p className="text-zinc-600 mt-2">Panorama ejecutivo con posicionamiento, audiencia y KPIs de corto plazo.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Contexto</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Pressão por eficiência na cadeia logística.</li>
          <li>Digitalização de frete e rastreabilidade.</li>
          <li>Sustentabilidade em foco (ESG).</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Mercado y Tendencias</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Telemetria e IA para roteirização.</li>
          <li>eCMR e documentação digital.</li>
          <li>Parcerias shipper-carrier com dados 1P.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Propuestas de Valor</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Captação de frota com MQL qualificado.</li>
          <li>TMS integrado a mídia performance.</li>
          <li>Conteúdo técnico que educa o mercado.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Casos de Uso</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Geração de leads por lane e sazonalidade.</li>
          <li>Calculadoras de ROI para troca de frota.</li>
          <li>Casos de sucesso por vertical (CPG, Farma).</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Métricas y KPIs</h2>
        <p className="text-zinc-700">Custo por lead, tempo de ciclo, taxa de adesão, ocupação de carga, SLA.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Destacados</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliCargo - Propuestas de Valor</h3>
          <p className="mt-2 text-zinc-600">Como PubliCargo entrega valor no segmento Logística com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Leer más →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliCargo - Mercado y Tendencias</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Investigación →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliCargo - Casos de Uso</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Caso de estudio →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Próximos pasos</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliCargo.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
