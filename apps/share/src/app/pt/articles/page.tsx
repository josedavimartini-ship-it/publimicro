import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliShare · Artigos & Insights',
  description: 'Análises do mercado Sharing Economy.',
  keywords: ['Sharing Economy','PubliShare','artigos']
};

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || '/';

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <nav className="mb-6 text-sm">
        <a href={HOME_URL} style={{color:'var(--accent-fire)'}} className="hover:underline">← Home Publimicro</a>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{color:'var(--accent-light)'}}>Artigos & Insights</h1>
        <p style={{color:'var(--text-muted)'}}>Conteúdos do setor Sharing Economy.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <article className="rounded-lg p-6 hover:shadow-md transition" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
            <span className="px-2 py-1 rounded text-xs font-medium" style={{background:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Estratégia</span>
            <time>2025-10-19</time>
            <span>·</span>
            <span>7 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href="/pt/articles/liquidez-local-marketplaces-dois-lados" style={{color:'var(--accent-light)'}} className="hover:underline">Liquidez Local: Como Marketplaces de Dois Lados Escalam por Bairro</a>
          </h3>
          <p className="mb-4" style={{color:'var(--text-muted)'}}>Densidade de oferta e demanda em geografias pequenas define sucesso ou morte de plataformas de sharing.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{color:'var(--text-subtle)'}}>Por Camila Rocha</span>
            <a href="/pt/articles/liquidez-local-marketplaces-dois-lados" className="text-sm font-medium hover:underline" style={{color:'var(--accent)'}}>Ler mais →</a>
          </div>
        </article>
        <article className="rounded-lg p-6 hover:shadow-md transition" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
            <span className="px-2 py-1 rounded text-xs font-medium" style={{background:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Produto</span>
            <time>2025-10-21</time>
            <span>·</span>
            <span>6 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href="/pt/articles/confianca-reputacao-verificacao" style={{color:'var(--accent-light)'}} className="hover:underline">Confiança em Escala: Reputação, Verificação e Seguro Nativo</a>
          </h3>
          <p className="mb-4" style={{color:'var(--text-muted)'}}>Como construir trust layer que permite transações P2P sem fricção excessiva.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{color:'var(--text-subtle)'}}>Por Ricardo Almeida</span>
            <a href="/pt/articles/confianca-reputacao-verificacao" className="text-sm font-medium hover:underline" style={{color:'var(--accent)'}}>Ler mais →</a>
          </div>
        </article>

      </div>
    </main>
  );
}
