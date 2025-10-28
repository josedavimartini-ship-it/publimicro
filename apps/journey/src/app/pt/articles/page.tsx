import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliJourney · Artigos & Insights',
  description: 'Análises e cases do mercado Viagens & Experiências.',
  keywords: ['Viagens & Experiências','PubliJourney','artigos','insights','tendências']
};

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || '/';

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <nav className="mb-6 text-sm">
        <a href={HOME_URL} className="text-amber-600 hover:underline">← Home Publimicro</a>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Artigos & Insights</h1>
        <p className="text-zinc-600">Conteúdos selecionados do setor Viagens & Experiências.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <article className="border rounded-lg p-6 hover:shadow-md transition">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Estratégia</span>
            <time>2025-10-20</time>
            <span>·</span>
            <span>6 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a className="hover:text-blue-600" href="/pt/articles/bundles-dinamicos-viagens-ia">Bundles Dinâmicos com IA: Tarifas Inteligentes que Convertem</a>
          </h3>
          <p className="text-zinc-600 mb-4">Como combinar voo+hotel+experiências com preços em tempo real e elevar conversão em 18-27%.</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Por Ana Luiza Prado</span>
            <a className="text-blue-600 hover:underline text-sm font-medium" href="/pt/articles/bundles-dinamicos-viagens-ia">Ler mais →</a>
          </div>
        </article>
        <article className="border rounded-lg p-6 hover:shadow-md transition">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Produto</span>
            <time>2025-10-23</time>
            <span>·</span>
            <span>5 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a className="hover:text-blue-600" href="/pt/articles/experiencia-mobile-checkin-sem-atrito">Experiência Mobile: Check-in Sem Atrito e Upsell Contextual</a>
          </h3>
          <p className="text-zinc-600 mb-4">Fluxos mobile-first reduzem atrito e abrem espaço para upsell de alto valor com timing perfeito.</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Por Bruno Nogueira</span>
            <a className="text-blue-600 hover:underline text-sm font-medium" href="/pt/articles/experiencia-mobile-checkin-sem-atrito">Ler mais →</a>
          </div>
        </article>

      </div>
    </main>
  );
}
