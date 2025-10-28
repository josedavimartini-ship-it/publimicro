import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ConfianÃ§a em Escala: ReputaÃ§Ã£o, VerificaÃ§Ã£o e Seguro Nativo | PubliShare',
  description: 'Como construir trust layer que permite transaÃ§Ãµes P2P sem fricÃ§Ã£o excessiva.',
  keywords: ['Produto','PubliShare','Sharing Economy'],
  authors: [{ name: 'Ricardo Almeida' }]
};

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || '/';

export default function ArticlePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12" style={{color:'var(--text-primary)'}}>
      <nav className="mb-6 flex items-center gap-3 text-sm" style={{color:'var(--text-muted)'}}>
        <a href={HOME_URL} style={{color:'var(--accent-fire)'}} className="hover:underline">â† Home Publimicro</a>
        <span>/</span>
        <a href="/pt/articles" style={{color:'var(--accent)'}} className="hover:underline">Artigos</a>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Produto</span>
          <time dateTime="2025-10-21">2025-10-21</time>
          <span>Â·</span>
          <span>6 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>ConfianÃ§a em Escala: ReputaÃ§Ã£o, VerificaÃ§Ã£o e Seguro Nativo</h1>
        <p style={{color:'var(--text-muted)'}}>Como construir trust layer que permite transaÃ§Ãµes P2P sem fricÃ§Ã£o excessiva.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>Plataformas de sharing dependem de confianÃ§a entre estranhos. O equilÃ­brio Ã© proteger sem criar atrito que mate conversÃ£o.</p>
<h2>Trust Stack</h2>
<ul style={{color:"var(--text-primary)"}}>
  <li>VerificaÃ§Ã£o de identidade (doc + selfie + liveness)</li>
  <li>Sistema de avaliaÃ§Ãµes bidirecional</li>
  <li>Seguro embutido no preÃ§o</li>
  <li>Suporte 24/7 com SLA &lt;2min</li>
</ul>
<h2>ROI da ConfianÃ§a</h2>
<p>Plataformas com verificaÃ§Ã£o obrigatÃ³ria tÃªm churn 31% menor e fraude 68% menor vs opt-in.</p>
      </div>

      <footer className="mt-12 pt-8" style={{borderTop:'1px solid var(--border)'}}>
        <div className="flex justify-between items-center text-sm">
          <a href="/pt/articles" style={{color:'var(--accent)'}} className="hover:underline">â† Artigos</a>
          <a href={HOME_URL} style={{color:'var(--accent-fire)'}} className="hover:underline">Home</a>
        </div>
      </footer>
    </article>
  );
}
