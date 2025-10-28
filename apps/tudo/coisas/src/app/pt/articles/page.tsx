import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliCoisas · Artigos & Insights',
  description: 'Análises do mercado IoT & Dispositivos.',
  keywords: ['IoT & Dispositivos','PubliCoisas','artigos']
};

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || 'http://localhost:3000';

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <nav className="mb-6 text-sm">
        <a href={HOME_URL} style={{color:'var(--accent-fire)'}} className="hover:underline">← Início</a>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{color:'var(--accent-light)'}}>Artigos & Insights</h1>
        <p style={{color:'var(--text-muted)'}}>Conteúdos selecionados do setor IoT & Dispositivos.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <article className="rounded-lg p-6 hover:shadow-md transition" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
            <span className="px-2 py-1 rounded text-xs font-medium" style={{background:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Infraestrutura</span>
            <time>2025-10-16</time>
            <span>·</span>
            <span>7 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href="/pt/articles/edge-computing-5g-iot-residencial" style={{color:'var(--accent-light)'}} className="hover:underline">Edge Computing e 5G: Como IoT Residencial Escala com Latência Baixa</a>
          </h3>
          <p className="mb-4" style={{color:'var(--text-muted)'}}>Processamento local e conectividade 5G viabilizam novos casos de uso em smart home e automação.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{color:'var(--text-subtle)'}}>Por Rafael Costa</span>
            <a href="/pt/articles/edge-computing-5g-iot-residencial" className="text-sm font-medium hover:underline" style={{color:'var(--accent)'}}>Ler mais →</a>
          </div>
        </article>
        <article className="rounded-lg p-6 hover:shadow-md transition" style={{background:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2 text-sm mb-3" style={{color:'var(--text-subtle)'}}>
            <span className="px-2 py-1 rounded text-xs font-medium" style={{background:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Modelo de Negócio</span>
            <time>2025-10-19</time>
            <span>·</span>
            <span>6 min</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href="/pt/articles/modelos-assinatura-dispositivos-conectados" style={{color:'var(--accent-light)'}} className="hover:underline">Modelos de Assinatura para Dispositivos: Hardware + Serviço em Bundle</a>
          </h3>
          <p className="mb-4" style={{color:'var(--text-muted)'}}>Como fabricantes migram de venda única para receita recorrente com hardware-as-a-service.</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{color:'var(--text-subtle)'}}>Por Juliana Martins</span>
            <a href="/pt/articles/modelos-assinatura-dispositivos-conectados" className="text-sm font-medium hover:underline" style={{color:'var(--accent)'}}>Ler mais →</a>
          </div>
        </article>

      </div>
    </main>
  );
}
