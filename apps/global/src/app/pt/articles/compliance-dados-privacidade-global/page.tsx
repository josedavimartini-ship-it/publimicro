import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compliance Global: GDPR, LGPD, CCPA e a Malha de Privacidade | PubliGlobal',
  description: 'Como operar em múltiplas jurisdições sem explodir o custo de compliance.',
  keywords: ['Legal & Compliance','PubliGlobal','Negócios Globais'],
  authors: [{ name: 'Marcos Tanaka' }]
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
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Legal & Compliance</span>
          <time dateTime="2025-10-22">2025-10-22</time>
          <span>·</span>
          <span>6 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>Compliance Global: GDPR, LGPD, CCPA e a Malha de Privacidade</h1>
        <p style={{color:'var(--text-muted)'}}>Como operar em múltiplas jurisdições sem explodir o custo de compliance.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>Cada região tem framework de privacidade único. Operar globalmente exige arquitetura de dados que acomoda opt-in/opt-out, retenção variável e direito ao esquecimento.</p>
<h2>Principais Regimes</h2>
<ul style={{color:'var(--text-primary)'}}>
  <li><strong>GDPR (UE):</strong> opt-in obrigatório, consentimento granular, multas até 4% do faturamento global</li>
  <li><strong>LGPD (Brasil):</strong> base legal clara, DPO obrigatório, titular tem 8 direitos</li>
  <li><strong>CCPA (Califórnia):</strong> opt-out, direito de saber e deletar</li>
  <li><strong>PIPL (China):</strong> localização de dados críticos, auditoria governamental</li>
</ul>
<h2>Arquitetura Recomendada</h2>
<ol style={{color:'var(--text-primary)'}}>
  <li>Consent Management Platform (CMP) multi-região</li>
  <li>Data residency: servidores locais ou clean rooms</li>
  <li>Políticas de retenção por país</li>
  <li>Processos automatizados para DSAR (data subject access requests)</li>
</ol>
<div style={{background:'var(--bg-elevated)',border:'1px solid var(--border)',padding:'1rem',borderRadius:'0.5rem',marginTop:'1.5rem'}}>
  <strong>Custo médio:</strong> R$ 400k-1,2M setup + R$ 80k/mês operação para empresa mid-market com presença em 4+ regiões.
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
