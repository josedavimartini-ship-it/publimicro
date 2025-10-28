import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edge Computing e 5G: Como IoT Residencial Escala com Latência Baixa | PubliCoisas',
  description: 'Processamento local e conectividade 5G viabilizam novos casos de uso em smart home e automação.',
  keywords: ['Infraestrutura','PubliCoisas','IoT & Dispositivos'],
  authors: [{ name: 'Rafael Costa' }]
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
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Infraestrutura</span>
          <time dateTime="2025-10-16">2025-10-16</time>
          <span>·</span>
          <span>7 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>Edge Computing e 5G: Como IoT Residencial Escala com Latência Baixa</h1>
        <p style={{color:'var(--text-muted)'}}>Processamento local e conectividade 5G viabilizam novos casos de uso em smart home e automação.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>IoT residencial evolui de conectividade básica para edge computing: dispositivos processam localmente, reduzindo latência e dependência de cloud.</p>
<h2>Arquitetura Edge</h2>
<ul style="color:var(--text-primary)">
  <li><strong>Gateway local:</strong> processa sensores, aciona atuadores sem internet</li>
  <li><strong>5G/Wi-Fi 6:</strong> baixa latência para automação crítica (segurança, saúde)</li>
  <li><strong>Sync seletivo:</strong> apenas eventos relevantes vão para cloud</li>
</ul>
<h2>Casos de Uso</h2>
<ol style="color:var(--text-primary)">
  <li>Segurança com reconhecimento facial local (privacidade)</li>
  <li>Automação por presença e rotinas aprendidas</li>
  <li>Gestão energética com previsão de consumo</li>
</ol>
<div style="background:var(--bg-elevated);border:1px solid var(--border);padding:1rem;border-radius:0.5rem;margin-top:1.5rem">
  <strong>Economia:</strong> Edge reduz tráfego cloud em 68% e latência de 180ms para 12ms em média.
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
