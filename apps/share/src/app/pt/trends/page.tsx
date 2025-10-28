import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliShare · Tendências',
  description: "Forças de mercado que moldam a estratégia: demanda, digital, IA e regulação.",
  keywords: ['Sharing Economy','PubliShare','trends','strategy','insights','pt']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <header>
        <h1 className="text-3xl font-semibold">PubliShare — Tendências</h1>
        <p className="text-zinc-600 mt-2">Forças de mercado que moldam a estratégia: demanda, digital, IA e regulação.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Contexto</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Plataformas de dois lados precisam confiança.</li>
          <li>Liquidez local é crítica.</li>
          <li>Unidade econômica define escala.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Mercado e Tendências</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Verificação e seguro nativos.</li>
          <li>Recomendação com IA e reputação.</li>
          <li>Pagamentos instantâneos.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Propostas de Valor</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Onboarding friccão-zero.</li>
          <li>Proteção e suporte 24/7.</li>
          <li>Segmentação por densidade e horário.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Casos de Uso</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Campanhas para cold-start por bairro.</li>
          <li>Programas de referidos com bônus.</li>
          <li>Ofertas dinâmicas por demanda.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Métricas & KPIs</h2>
        <p className="text-zinc-700">Liquidez, matching rate, tempo de espera, CAC payback, fraude.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Destaques</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliShare - Propostas de Valor</h3>
          <p className="mt-2 text-zinc-600">Como PubliShare entrega valor no segmento Sharing Economy com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Leia mais →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliShare - Mercado e Tendências</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Pesquisa →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliShare - Casos de Uso</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Estudo de caso →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Próximos passos</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliShare.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
