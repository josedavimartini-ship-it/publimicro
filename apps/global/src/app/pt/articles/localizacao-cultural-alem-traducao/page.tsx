import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Localização Cultural: Além da Tradução, Adaptação de Jornada | PubliGlobal',
  description: 'Como marcas globais adaptam funis, métodos de pagamento e conteúdo por cluster regional.',
  keywords: ['Estratégia Global','PubliGlobal','Negócios Globais'],
  authors: [{ name: 'Patricia Lemos' }]
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
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Estratégia Global</span>
          <time dateTime="2025-10-17">2025-10-17</time>
          <span>·</span>
          <span>7 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>Localização Cultural: Além da Tradução, Adaptação de Jornada</h1>
        <p style={{color:'var(--text-muted)'}}>Como marcas globais adaptam funis, métodos de pagamento e conteúdo por cluster regional.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>Expansão internacional exige mais que traduzir UI. Jornadas de compra, meios de pagamento, calendários promocionais e tom de comunicação variam por região.</p>
<h2>Clusters Regionais</h2>
<ul style="color:var(--text-primary)">
  <li><strong>LATAM:</strong> pagamento parcelado sem juros, boleto, Pix, influência forte de marketplaces</li>
  <li><strong>Europa:</strong> SEPA, GDPR strict, preferência por marcas locais</li>
  <li><strong>Ásia-Pacífico:</strong> super-apps, social commerce, pagamento via QR, live shopping</li>
  <li><strong>MENA:</strong> calendário islâmico, COD dominante, preferência mobile-first</li>
</ul>
<h2>Playbook</h2>
<ol style="color:var(--text-primary)">
  <li>Pesquisa qualitativa local antes de lançar</li>
  <li>Parcerias com provedores de pagamento regionais</li>
  <li>Time local para criação de conteúdo e atendimento</li>
  <li>Infraestrutura multi-moeda e fiscal desde day 1</li>
</ol>
<div style="background:var(--bg-elevated);border:1px solid var(--border);padding:1rem;border-radius:0.5rem;margin-top:1.5rem">
  <strong>Métrica:</strong> Marcas com localização profunda têm conversão 2,4x maior vs apenas traduzir conteúdo.
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
