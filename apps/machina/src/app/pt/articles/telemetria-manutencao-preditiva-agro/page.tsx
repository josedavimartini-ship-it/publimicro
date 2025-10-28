import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Telemetria e Manutenção Preditiva: ROI em 8-12 Meses | PubliMachina',
  description: 'Sensores + IA reduzem paradas não planejadas em 27% e elevam produtividade por hectare.',
  keywords: ['Tecnologia','PubliMachina','Máquinas & Agro'],
  authors: [{ name: 'Luana Ferreira' }]
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
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Tecnologia</span>
          <time dateTime="2025-10-18">2025-10-18</time>
          <span>·</span>
          <span>8 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>Telemetria e Manutenção Preditiva: ROI em 8-12 Meses</h1>
        <p style={{color:'var(--text-muted)'}}>Sensores + IA reduzem paradas não planejadas em 27% e elevam produtividade por hectare.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>Equipamentos agrícolas com telemetria entregam dados de consumo, horas ativas, falhas e produtividade, permitindo manutenção preditiva e otimização de uso.</p>
<h2>Stack</h2>
<ul style="color:var(--text-primary)">
  <li>Sensores: GPS, consumo, RPM, carga</li>
  <li>Conectividade: LoRa/NB-IoT para áreas remotas</li>
  <li>Plataforma: TMS + BI integrado</li>
</ul>
<h2>Economia</h2>
<ul style="color:var(--text-primary)">
  <li>-19% consumo diesel</li>
  <li>-27% paradas não planejadas</li>
  <li>+14% produtividade média</li>
</ul>
<div style="background:var(--bg-elevated);border:1px solid var(--border);padding:1rem;border-radius:0.5rem;margin-top:1.5rem">
  <strong>ROI médio:</strong> 10 meses | Payback conservador: 14 meses.
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
