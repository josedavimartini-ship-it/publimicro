import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confiança em Escala: Reputação, Verificação e Seguro Nativo | PubliShare',
  description: 'Como construir trust layer que permite transações P2P sem fricção excessiva.',
  keywords: ['Produto','PubliShare','Sharing Economy'],
  authors: [{ name: 'Ricardo Almeida' }]
};

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || '/';

export default function ArticlePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12" style={{color:'var(--text-primary)'}}>
      <nav className="mb-6 flex items-center gap-3 text-sm" style={{color:'var(--text-muted)'}}>
        <a href={HOME_URL} style={{color:'var(--accent-fire)'}} className="hover:underline">← Home Publimicro</a>
        <span>/</span>
        <a href="/pt/articles" style={{color:'var(--accent)'}} className="hover:underline">Artigos</a>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Produto</span>
          <time dateTime="2025-10-21">2025-10-21</time>
          <span>·</span>
          <span>6 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>Confiança em Escala: Reputação, Verificação e Seguro Nativo</h1>
        <p style={{color:'var(--text-muted)'}}>Como construir trust layer que permite transações P2P sem fricção excessiva.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>Plataformas de sharing dependem de confiança entre estranhos. O equilíbrio é proteger sem criar atrito que mate conversão.</p>
<h2>Trust Stack</h2>
<ul style="color:var(--text-primary)">
  <li>Verificação de identidade (doc + selfie + liveness)</li>
  <li>Sistema de avaliações bidirecional</li>
  <li>Seguro embutido no preço</li>
  <li>Suporte 24/7 com SLA &lt;2min</li>
</ul>
<h2>ROI da Confiança</h2>
<p>Plataformas com verificação obrigatória têm churn 31% menor e fraude 68% menor vs opt-in.</p>
      </div>

      <footer className="mt-12 pt-8" style={{borderTop:'1px solid var(--border)'}}>
        <div className="flex justify-between items-center text-sm">
          <a href="/pt/articles" style={{color:'var(--accent)'}} className="hover:underline">← Artigos</a>
          <a href={HOME_URL} style={{color:'var(--accent-fire)'}} className="hover:underline">Home</a>
        </div>
      </footer>
    </article>
  );
}
