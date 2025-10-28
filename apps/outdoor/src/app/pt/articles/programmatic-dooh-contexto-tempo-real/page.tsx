import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programmatic DOOH: Criatividade Dinâmica por Contexto em Tempo Real | PubliOutdoor',
  description: 'Como telas digitais ativam criativos sensíveis a clima, tráfego, eventos e audiência mobile.',
  keywords: ['Mídia Programática','PubliOutdoor','OOH/DOOH'],
  authors: [{ name: 'Bianca Alves' }]
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
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Mídia Programática</span>
          <time dateTime="2025-10-22">2025-10-22</time>
          <span>·</span>
          <span>8 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>Programmatic DOOH: Criatividade Dinâmica por Contexto em Tempo Real</h1>
        <p style={{color:'var(--text-muted)'}}>Como telas digitais ativam criativos sensíveis a clima, tráfego, eventos e audiência mobile.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>DOOH programático combina sinais de contexto (clima, tráfego, eventos) com dados de audiência mobile para ativar criativos dinâmicos e mensurar impacto incremental.</p>
<h2>Sinais de Ativação</h2>
<ul style="color:var(--text-primary)">
  <li><strong>Clima:</strong> temperatura, chuva, poluição → ajusta produto (ex: sorvete vs café quente)</li>
  <li><strong>Tráfego:</strong> congestionamento → expande tempo de exposição</li>
  <li><strong>Eventos:</strong> jogo, show, feriado → mensagem contextual</li>
  <li><strong>Audiência:</strong> densidade mobile por demografia e interesse</li>
</ul>
<h2>Stack Tecnológico</h2>
<ol style="color:var(--text-primary)">
  <li>SSP/DSP de DOOH: Hivestack, Vistar, Broadsign</li>
  <li>Creative Management: dynamic templates com API feeds</li>
  <li>Measurement: geofencing + panel matching para lift</li>
</ol>
<h2>Performance</h2>
<p>Campanhas com criativo dinâmico geram +37% CTR mobile e +22% visitas incrementais em varejo vs criativo estático.</p>
<div style="background:var(--bg-elevated);border:1px solid var(--border);padding:1rem;border-radius:0.5rem;margin-top:1.5rem">
  <strong>CPM médio:</strong> R$ 18-45 (SP/RJ prime locations) vs R$ 8-15 locais secundários.
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
