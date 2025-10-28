import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Shopping com Creators: Como Geração Z Compra em Transmissões ao Vivo | PubliYellow',
  description: 'Combinação de entretenimento, autenticidade e compra imediata via lives gera conversão 8-12x superior.',
  keywords: ['Social Commerce','PubliYellow','Cultura & Juventude'],
  authors: [{ name: 'Bianca Souza' }]
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
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Social Commerce</span>
          <time dateTime="2025-10-21">2025-10-21</time>
          <span>·</span>
          <span>7 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>Live Shopping com Creators: Como Geração Z Compra em Transmissões ao Vivo</h1>
        <p style={{color:'var(--text-muted)'}}>Combinação de entretenimento, autenticidade e compra imediata via lives gera conversão 8-12x superior.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>Live shopping (transmissões ao vivo com links de compra integrados) explode entre Gen Z: autenticidade de creators + urgência de ofertas limitadas + interação em tempo real.</p>
<h2>Formato Vencedor</h2>
<ol style="color:var(--text-primary)">
  <li><strong>Creator autêntico:</strong> micro-influencer (10k-100k) com alta conexão</li>
  <li><strong>Produto limitado:</strong> 50-200 unidades com desconto exclusivo</li>
  <li><strong>Interação:</strong> responde perguntas, mostra produto em uso real</li>
  <li><strong>Countdown:</strong> ofertas relâmpago a cada 15-20min</li>
</ol>
<h2>Performance</h2>
<ul style="color:var(--text-primary)">
  <li>Conversão: 8-12% (vs 1,5-2,5% e-commerce tradicional)</li>
  <li>Ticket médio: +34% vs site</li>
  <li>CAC: R$ 12-28 (orgânico via comunidade do creator)</li>
</ul>
<div style="background:var(--bg-elevated);border:1px solid var(--border);padding:1rem;border-radius:0.5rem;margin-top:1.5rem">
  <strong>Plataformas:</strong> Instagram Live Shopping, TikTok Shop, Shopee Live. Média de 800-3.200 espectadores simultâneos por live.
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
