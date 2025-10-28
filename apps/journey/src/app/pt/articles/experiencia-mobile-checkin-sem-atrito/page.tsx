import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiência Mobile: Check-in Sem Atrito e Upsell Contextual | PubliJourney',
  description: 'Fluxos mobile-first reduzem atrito e abrem espaço para upsell de alto valor com timing perfeito.',
  keywords: ['Produto','PubliJourney','Viagens & Experiências'],
  authors: [{ name: 'Bruno Nogueira' }],
  openGraph: {
    title: 'Experiência Mobile: Check-in Sem Atrito e Upsell Contextual',
    description: 'Fluxos mobile-first reduzem atrito e abrem espaço para upsell de alto valor com timing perfeito.',
    type: 'article',
    publishedTime: '2025-10-23',
    authors: ['Bruno Nogueira']
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
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Produto</span>
          <time dateTime="2025-10-23">2025-10-23</time>
          <span>·</span>
          <span>5 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">Experiência Mobile: Check-in Sem Atrito e Upsell Contextual</h1>
        <p className="text-zinc-600">Fluxos mobile-first reduzem atrito e abrem espaço para upsell de alto valor com timing perfeito.</p>
      </header>

      <div className="prose prose-lg max-w-none">
<p>Check-in mobile elimina filas, valida documentos e oferece upgrades com base em lotação e preferências do hóspede.</p>
<h2>Boas práticas</h2>
<ol className="list-decimal pl-6">
  <li>Pré-check-in 24h antes com verificação</li>
  <li>Chave digital e mapa do hotel</li>
  <li>Ofertas de upgrade contextuais (ex.: vista mar)</li>
</ol>
<div className="bg-emerald-50 border border-emerald-200 rounded p-4 mt-6">
  <strong>Métrica:</strong> +14% receita acessória por reserva com upsell no mobile.
</div>
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
