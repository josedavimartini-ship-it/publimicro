import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliYellow · Tendências',
  description: "Forças de mercado que moldam a estratégia: demanda, digital, IA e regulação.",
  keywords: ['Cultura & Juventude','PubliYellow','trends','strategy','insights','pt']
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12" dir="ltr">
      <header>
        <h1 className="text-3xl font-semibold">PubliYellow — Tendências</h1>
        <p className="text-zinc-600 mt-2">Forças de mercado que moldam a estratégia: demanda, digital, IA e regulação.</p>
      </header>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-medium">Contexto</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Cultura jovem e criativa em fluxo.</li>
          <li>Drops e colabs movem atenção.</li>
          <li>Comunidades são o canal.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Mercado e Tendências</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Short-video e live shopping.</li>
          <li>Plataformas de creators.</li>
          <li>Economia de fandom.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Propostas de Valor</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Experiências interativas.</li>
          <li>Coleções limitadas e gamificação.</li>
          <li>Comunidade como produto.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Casos de Uso</h2>
        <ul className="list-disc pl-6 text-zinc-700">
          <li>Drops temáticos mensais.</li>
          <li>Labs abertos com co-criação.</li>
          <li>Eventos pop-up e digitais.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-medium">Métricas & KPIs</h2>
        <p className="text-zinc-700">Crescimento de comunidade, engajamento, GMV de drops, CAC orgânico.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Destaques</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliYellow - Propostas de Valor</h3>
          <p className="mt-2 text-zinc-600">Como PubliYellow entrega valor no segmento Cultura & Juventude com diferenciais claros.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Leia mais →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliYellow - Mercado e Tendências</h3>
          <p className="mt-2 text-zinc-600">Sinais de mercado e tendências que afetam diretamente a estratégia.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Pesquisa →</a>
          </div>
        </article>
        <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium">PubliYellow - Casos de Uso</h3>
          <p className="mt-2 text-zinc-600">Exemplos práticos com impacto em conversão, eficiência e marca.</p>
          <div className="mt-3">
            <a className="text-blue-600 hover:underline" href="#">Estudo de caso →</a>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-medium">Próximos passos</h2>
        <p className="text-zinc-700">Integraremos conteúdo editorial, dashboards e estudos de caso específicos de PubliYellow.
        Envie prioridades e regiões foco para priorizarmos.</p>
      </section>
    </main>
  );
}
