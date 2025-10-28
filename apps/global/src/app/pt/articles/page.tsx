import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliGlobal · Artigos & Insights',
  description: 'Análises do mercado Negócios Globais.',
  keywords: ['Negócios Globais','PubliGlobal','artigos']
};

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || 'http://localhost:3000';

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <nav className="mb-6 text-sm">
        <a href={HOME_URL} style={{color:'var(--accent-fire)'}} className="hover:underline">← Início</a>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{color:'var(--accent-light)'}}>Artigos & Insights</h1>
        <p style={{color:'var(--text-muted)'}}>Conteúdos selecionados do setor Negócios Globais.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <article className="rounded-lg p-6 hover:shadow-md transition" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
            <span className="px-2 py-1 rounded text-xs font-medium" style={{background:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Estratégia Global</span>
            <time>2025-10-17</time>
            <span>·</span>
            <span>7 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href="/pt/articles/localizacao-cultural-alem-traducao" style={{color:'var(--accent-light)'}} className="hover:underline">Localização Cultural: Além da Tradução, Adaptação de Jornada</a>
          </h3>
          <p className="mb-4" style={{color:'var(--text-muted)'}}>Como marcas globais adaptam funis, métodos de pagamento e conteúdo por cluster regional.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{color:'var(--text-subtle)'}}>Por Patricia Lemos</span>
            <a href="/pt/articles/localizacao-cultural-alem-traducao" className="text-sm font-medium hover:underline" style={{color:'var(--accent)'}}>Ler mais →</a>
          </div>
        </article>
        <article className="rounded-lg p-6 hover:shadow-md transition" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
            <span className="px-2 py-1 rounded text-xs font-medium" style={{background:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Legal & Compliance</span>
            <time>2025-10-22</time>
            <span>·</span>
            <span>6 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href="/pt/articles/compliance-dados-privacidade-global" style={{color:'var(--accent-light)'}} className="hover:underline">Compliance Global: GDPR, LGPD, CCPA e a Malha de Privacidade</a>
          </h3>
          <p className="mb-4" style={{color:'var(--text-muted)'}}>Como operar em múltiplas jurisdições sem explodir o custo de compliance.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{color:'var(--text-subtle)'}}>Por Marcos Tanaka</span>
            <a href="/pt/articles/compliance-dados-privacidade-global" className="text-sm font-medium hover:underline" style={{color:'var(--accent)'}}>Ler mais →</a>
          </div>
        </article>

      </div>
    </main>
  );
}
