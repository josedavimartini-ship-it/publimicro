import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liquidez Local: Como Marketplaces de Dois Lados Escalam por Bairro | PubliShare',
  description: 'Densidade de oferta e demanda em geografias pequenas define sucesso ou morte de plataformas de sharing.',
  keywords: ['Estratégia','PubliShare','Sharing Economy'],
  authors: [{ name: 'Camila Rocha' }]
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
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Estratégia</span>
          <time dateTime="2025-10-19">2025-10-19</time>
          <span>·</span>
          <span>7 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>Liquidez Local: Como Marketplaces de Dois Lados Escalam por Bairro</h1>
        <p style={{color:'var(--text-muted)'}}>Densidade de oferta e demanda em geografias pequenas define sucesso ou morte de plataformas de sharing.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>Plataformas de compartilhamento vivem ou morrem pela liquidez local: proporção entre oferta (carros, quartos, serviços) e demanda (usuários ativos) em raio restrito.</p>
<h2>Métricas-chave</h2>
<ul style="color:var(--text-primary)">
  <li>Densidade: ofertas ativas por km² ou CEP</li>
  <li>Matching rate: % pedidos atendidos em &lt;5min</li>
  <li>Cold-start: tempo para ativar novo bairro</li>
</ul>
<h2>Playbook de Lançamento</h2>
<ol style="color:var(--text-primary)">
  <li>Geo-target hiperfocado (1-3 bairros iniciais)</li>
  <li>Subsídio assimétrico: pague mais a lado escasso</li>
  <li>Gamificação com ranking local e bônus</li>
  <li>Parcerias com comércio local para ancoragem</li>
</ol>
<div style="background:var(--bg-elevated);border:1px solid var(--border);padding:1rem;border-radius:0.5rem;margin-top:1.5rem">
  <strong>Case:</strong> Rideshare atingiu liquidez em 8 bairros SP com CAC R$ 42 (vs R$ 180 sem geo-focus).
</div>
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
