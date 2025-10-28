import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliMachina · Artigos & Insights',
  description: 'Análises do mercado Máquinas & Agro.',
  keywords: ['Máquinas & Agro','PubliMachina','artigos']
};

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || '/';

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <nav className="mb-6 text-sm">
        <a href={HOME_URL} style={{color:'var(--accent-fire)'}} className="hover:underline">← Home Publimicro</a>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{color:'var(--accent-light)'}}>Artigos & Insights</h1>
        <p style={{color:'var(--text-muted)'}}>Conteúdos do setor Máquinas & Agro.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <article className="rounded-lg p-6 hover:shadow-md transition" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
            <span className="px-2 py-1 rounded text-xs font-medium" style={{background:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Distribuição</span>
            <time>2025-10-20</time>
            <span>·</span>
            <span>7 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href="/pt/articles/dealer-network-digital-agricola" style={{color:'var(--accent-light)'}} className="hover:underline">Rede de Dealers Digital: Da Venda ao Pós-venda Hiperlocal</a>
          </h3>
          <p className="mb-4" style={{color:'var(--text-muted)'}}>Playbook para integrar catálogo técnico, agendamento e peças em uma jornada só.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{color:'var(--text-subtle)'}}>Por Rafael Gomes</span>
            <a href="/pt/articles/dealer-network-digital-agricola" className="text-sm font-medium hover:underline" style={{color:'var(--accent)'}}>Ler mais →</a>
          </div>
        </article>
        <article className="rounded-lg p-6 hover:shadow-md transition" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
            <span className="px-2 py-1 rounded text-xs font-medium" style={{background:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Tecnologia</span>
            <time>2025-10-18</time>
            <span>·</span>
            <span>8 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href="/pt/articles/telemetria-manutencao-preditiva-agro" style={{color:'var(--accent-light)'}} className="hover:underline">Telemetria e Manutenção Preditiva: ROI em 8-12 Meses</a>
          </h3>
          <p className="mb-4" style={{color:'var(--text-muted)'}}>Sensores + IA reduzem paradas não planejadas em 27% e elevam produtividade por hectare.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{color:'var(--text-subtle)'}}>Por Luana Ferreira</span>
            <a href="/pt/articles/telemetria-manutencao-preditiva-agro" className="text-sm font-medium hover:underline" style={{color:'var(--accent)'}}>Ler mais →</a>
          </div>
        </article>

      </div>
    </main>
  );
}
