import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bundles Dinâmicos com IA: Tarifas Inteligentes que Convertem | PubliJourney',
  description: 'Como combinar voo+hotel+experiências com preços em tempo real e elevar conversão em 18-27%.',
  keywords: ['Estratégia','PubliJourney','Viagens & Experiências'],
  authors: [{ name: 'Ana Luiza Prado' }],
  openGraph: {
    title: 'Bundles Dinâmicos com IA: Tarifas Inteligentes que Convertem',
    description: 'Como combinar voo+hotel+experiências com preços em tempo real e elevar conversão em 18-27%.',
    type: 'article',
    publishedTime: '2025-10-20',
    authors: ['Ana Luiza Prado']
  }
};

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || '/';

export default function ArticlePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 flex items-center gap-4 text-sm">
        <a href={HOME_URL} className="text-amber-600 hover:underline">← Home Publimicro</a>
        <span className="text-zinc-400">/</span>
        <a href="/pt/articles" className="text-blue-600 hover:underline">Artigos & Insights</a>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-zinc-500 mb-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Estratégia</span>
          <time dateTime="2025-10-20">2025-10-20</time>
          <span>·</span>
          <span>6 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">Bundles Dinâmicos com IA: Tarifas Inteligentes que Convertem</h1>
        <p className="text-zinc-600">Como combinar voo+hotel+experiências com preços em tempo real e elevar conversão em 18-27%.</p>
      </header>

      <div className="prose prose-lg max-w-none">
<p>Bundles dinâmicos usam modelos de elasticidade e inventário em tempo real para montar ofertas personalizadas (voo + hotel + experiência) com preços competitivos.</p>
<h2>Componentes</h2>
<ul className="list-disc pl-6">
  <li>Inventário: GDS + diretos com hotéis e operadoras</li>
  <li>Pricing: modelos de elasticidade por segmento</li>
  <li>Regras: janelas, estadias mínimas, políticas</li>
</ul>
<h2>Resultados</h2>
<ul className="list-disc pl-6">
  <li>Conversão +22% em tráfego qualificado</li>
  <li>ADR do pacote +11%</li>
  <li>Cancelamentos -9% (melhor fit de oferta)</li>
</ul>
      </div>

      <footer className="mt-12 pt-8 border-t">
        <div className="flex justify-between items-center text-sm">
          <a href="/pt/articles" className="text-blue-600 hover:underline">← Voltar para Artigos</a>
          <a href={HOME_URL} className="text-amber-600 hover:underline">Ir para Home</a>
        </div>
      </footer>
    </article>
  );
}
