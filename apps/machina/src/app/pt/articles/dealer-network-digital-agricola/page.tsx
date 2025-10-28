import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rede de Dealers Digital: Da Venda ao Pós-venda Hiperlocal | PubliMachina',
  description: 'Playbook para integrar catálogo técnico, agendamento e peças em uma jornada só.',
  keywords: ['Distribuição','PubliMachina','Máquinas & Agro'],
  authors: [{ name: 'Rafael Gomes' }]
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
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Distribuição</span>
          <time dateTime="2025-10-20">2025-10-20</time>
          <span>·</span>
          <span>7 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>Rede de Dealers Digital: Da Venda ao Pós-venda Hiperlocal</h1>
        <p style={{color:'var(--text-muted)'}}>Playbook para integrar catálogo técnico, agendamento e peças em uma jornada só.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>Transformar a rede de dealers em plataforma digital é prioridade. Catálogo, disponibilidade, financiamento e peças em um só fluxo elevam conversão e NPS.</p>
<h2>Capacidades-chave</h2>
<ol style={{color:'var(--text-primary)'}}>
  <li>Catálogo com especificações e comparação por cultura/terreno</li>
  <li>Agendamento de demos no campo</li>
  <li>Financiamento rural integrado (Pronaf/Pronamp)</li>
  <li>Peças com SLA e logística reversa</li>
</ol>
<h2>Métricas</h2>
<p>CPL qualificado -32%, ciclo de venda -21 dias, NPS +18 pts.</p>
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
