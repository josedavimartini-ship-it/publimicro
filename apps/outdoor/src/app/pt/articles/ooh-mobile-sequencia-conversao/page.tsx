import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ponte OOH → Mobile: Sequências que Capturam Intenção | PubliOutdoor',
  description: 'Como encadear exposição em telas com retarget mobile e search para converter awareness em ação.',
  keywords: ['Estratégia de Mídia','PubliOutdoor','OOH/DOOH'],
  authors: [{ name: 'Diego Campos' }]
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
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Estratégia de Mídia</span>
          <time dateTime="2025-10-24">2025-10-24</time>
          <span>·</span>
          <span>6 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>Ponte OOH → Mobile: Sequências que Capturam Intenção</h1>
        <p style={{color:'var(--text-muted)'}}>Como encadear exposição em telas com retarget mobile e search para converter awareness em ação.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>Exposição OOH gera awareness e memorização. A sequência correta com mobile e search captura intenção no momento certo.</p>
<h2>Sequência Otimizada</h2>
<ol style={{color:'var(--text-primary)'}}>
  <li><strong>OOH com geofencing:</strong> captura mobile IDs em raio de 500m-1km de telas</li>
  <li><strong>Retarget mobile (24-48h):</strong> display/video com oferta específica</li>
  <li><strong>Search de marca + categoria:</strong> lance elevado para usuários expostos</li>
  <li><strong>Landing com geo-personalização:</strong> estoque, loja mais próxima, horário</li>
</ol>
<h2>Medição de Lift</h2>
<ul style={{color:'var(--text-primary)'}}>
  <li>Painel de controle (expostos vs não expostos)</li>
  <li>Incremento em busca de marca: +18-34%</li>
  <li>Visitas em loja via match probabilístico: +12-19%</li>
</ul>
<div style={{background:'var(--bg-elevated)',border:'1px solid var(--border)',padding:'1rem',borderRadius:'0.5rem',marginTop:'1.5rem'}}>
  <strong>ROAS integrado:</strong> OOH + Mobile + Search atinge 4,2-6,8x vs canais isolados.
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
