import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drops Limitados e Economia de Fandom: Como Escassez Gera Demanda | PubliYellow',
  description: 'Marcas jovens criam hype com lançamentos limitados, co-criação e comunidades engajadas.',
  keywords: ['Cultura','PubliYellow','Cultura & Juventude'],
  authors: [{ name: 'Lucas Mendes' }]
};

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || 'http://localhost:3000';

export default function ArticlePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12" style={{color:'var(--text-primary)'}}>
      <nav className="mb-6 flex items-center gap-3 text-sm" style={{color:'var(--text-muted)'}}>
        <a href={HOME_URL} style={{color:'var(--accent-fire)'}} className="hover:underline">← Início</a>
        <span>/</span>
        <a href="/pt/articles" style={{color:'var(--accent)'}} className="hover:underline">Artigos</a>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Cultura</span>
          <time dateTime="2025-10-18">2025-10-18</time>
          <span>·</span>
          <span>6 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>Drops Limitados e Economia de Fandom: Como Escassez Gera Demanda</h1>
        <p style={{color:'var(--text-muted)'}}>Marcas jovens criam hype com lançamentos limitados, co-criação e comunidades engajadas.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>Marcas voltadas para jovens usam drops limitados (lançamentos surpresa com estoque restrito) para criar escassez, urgência e vínculo com comunidade.</p>
<h2>Mecânica de Drops</h2>
<ul style="color:var(--text-primary)">
  <li><strong>Anúncio surpresa:</strong> 24-48h de antecedência via redes sociais</li>
  <li><strong>Estoque limitado:</strong> 100-500 unidades, sem reposição</li>
  <li><strong>Co-criação:</strong> comunidade vota em cores, designs, features</li>
  <li><strong>Gamificação:</strong> acesso antecipado para membros ativos</li>
</ul>
<h2>Resultados</h2>
<p>Drops vendem 100% do estoque em média de 4h. GMV por drop: R$ 18k-85k dependendo do produto. CAC orgânico (boca-a-boca e UGC).</p>
<div style="background:var(--bg-elevated);border:1px solid var(--border);padding:1rem;border-radius:0.5rem;margin-top:1.5rem">
  <strong>Engajamento:</strong> Comunidades de drops têm NPS 82 e taxa de repeat purchase 64% vs 22% e-commerce tradicional.
</div>
      </div>

      <footer className="mt-12 pt-8" style={{borderTop:'1px solid var(--border)'}}>
        <div className="flex justify-between items-center text-sm">
          <a href="/pt/articles" style={{color:'var(--accent)'}} className="hover:underline">← Artigos</a>
          <a href={HOME_URL} style={{color:'var(--accent-fire)'}} className="hover:underline">Início</a>
        </div>
      </footer>
    </article>
  );
}
