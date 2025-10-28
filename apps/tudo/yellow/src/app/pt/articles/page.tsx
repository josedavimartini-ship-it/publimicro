import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliYellow · Artigos & Insights',
  description: 'Análises do mercado Cultura & Juventude.',
  keywords: ['Cultura & Juventude','PubliYellow','artigos']
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
        <p style={{color:'var(--text-muted)'}}>Conteúdos selecionados do setor Cultura & Juventude.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <article className="rounded-lg p-6 hover:shadow-md transition" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
            <span className="px-2 py-1 rounded text-xs font-medium" style={{background:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Cultura</span>
            <time>2025-10-18</time>
            <span>·</span>
            <span>6 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href="/pt/articles/drops-limitados-economia-fandom" style={{color:'var(--accent-light)'}} className="hover:underline">Drops Limitados e Economia de Fandom: Como Escassez Gera Demanda</a>
          </h3>
          <p className="mb-4" style={{color:'var(--text-muted)'}}>Marcas jovens criam hype com lançamentos limitados, co-criação e comunidades engajadas.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{color:'var(--text-subtle)'}}>Por Lucas Mendes</span>
            <a href="/pt/articles/drops-limitados-economia-fandom" className="text-sm font-medium hover:underline" style={{color:'var(--accent)'}}>Ler mais →</a>
          </div>
        </article>
        <article className="rounded-lg p-6 hover:shadow-md transition" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
            <span className="px-2 py-1 rounded text-xs font-medium" style={{background:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Social Commerce</span>
            <time>2025-10-21</time>
            <span>·</span>
            <span>7 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href="/pt/articles/live-shopping-creators-geracao-z" style={{color:'var(--accent-light)'}} className="hover:underline">Live Shopping com Creators: Como Geração Z Compra em Transmissões ao Vivo</a>
          </h3>
          <p className="mb-4" style={{color:'var(--text-muted)'}}>Combinação de entretenimento, autenticidade e compra imediata via lives gera conversão 8-12x superior.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{color:'var(--text-subtle)'}}>Por Bianca Souza</span>
            <a href="/pt/articles/live-shopping-creators-geracao-z" className="text-sm font-medium hover:underline" style={{color:'var(--accent)'}}>Ler mais →</a>
          </div>
        </article>

      </div>
    </main>
  );
}
