import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliOutdoor · Artigos & Insights',
  description: 'Análises do mercado OOH/DOOH.',
  keywords: ['OOH/DOOH','PubliOutdoor','artigos']
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
        <p style={{color:'var(--text-muted)'}}>Conteúdos selecionados do setor OOH/DOOH.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <article className="rounded-lg p-6 hover:shadow-md transition" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
            <span className="px-2 py-1 rounded text-xs font-medium" style={{background:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Mídia Programática</span>
            <time>2025-10-22</time>
            <span>·</span>
            <span>8 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href="/pt/articles/programmatic-dooh-contexto-tempo-real" style={{color:'var(--accent-light)'}} className="hover:underline">Programmatic DOOH: Criatividade Dinâmica por Contexto em Tempo Real</a>
          </h3>
          <p className="mb-4" style={{color:'var(--text-muted)'}}>Como telas digitais ativam criativos sensíveis a clima, tráfego, eventos e audiência mobile.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{color:'var(--text-subtle)'}}>Por Bianca Alves</span>
            <a href="/pt/articles/programmatic-dooh-contexto-tempo-real" className="text-sm font-medium hover:underline" style={{color:'var(--accent)'}}>Ler mais →</a>
          </div>
        </article>
        <article className="rounded-lg p-6 hover:shadow-md transition" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
            <span className="px-2 py-1 rounded text-xs font-medium" style={{background:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Estratégia de Mídia</span>
            <time>2025-10-24</time>
            <span>·</span>
            <span>6 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href="/pt/articles/ooh-mobile-sequencia-conversao" style={{color:'var(--accent-light)'}} className="hover:underline">Ponte OOH → Mobile: Sequências que Capturam Intenção</a>
          </h3>
          <p className="mb-4" style={{color:'var(--text-muted)'}}>Como encadear exposição em telas com retarget mobile e search para converter awareness em ação.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{color:'var(--text-subtle)'}}>Por Diego Campos</span>
            <a href="/pt/articles/ooh-mobile-sequencia-conversao" className="text-sm font-medium hover:underline" style={{color:'var(--accent)'}}>Ler mais →</a>
          </div>
        </article>

      </div>
    </main>
  );
}
