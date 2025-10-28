import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modelos de Assinatura para Dispositivos: Hardware + Serviço em Bundle | PubliCoisas',
  description: 'Como fabricantes migram de venda única para receita recorrente com hardware-as-a-service.',
  keywords: ['Modelo de Negócio','PubliCoisas','IoT & Dispositivos'],
  authors: [{ name: 'Juliana Martins' }]
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
          <span className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor:'var(--accent-petroleum)',color:'var(--text-primary)'}}>Modelo de Negócio</span>
          <time dateTime="2025-10-19">2025-10-19</time>
          <span>·</span>
          <span>6 min leitura</span>
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{color:'var(--accent-light)'}}>Modelos de Assinatura para Dispositivos: Hardware + Serviço em Bundle</h1>
        <p style={{color:'var(--text-muted)'}}>Como fabricantes migram de venda única para receita recorrente com hardware-as-a-service.</p>
      </header>

      <div className="prose prose-lg max-w-none" style={{color:'var(--text-primary)'}}>
<p>Dispositivos conectados permitem modelo de assinatura: hardware subsidiado ou alugado + serviços recorrentes (storage, features premium, suporte).</p>
<h2>Modelos Populares</h2>
<ul style="color:var(--text-primary)">
  <li><strong>Hardware gratuito + plano:</strong> câmera grátis, paga cloud storage R$ 29/mês</li>
  <li><strong>Aluguel com opção de compra:</strong> R$ 49/mês por 24 meses, dispositivo seu ao final</li>
  <li><strong>Freemium:</strong> funções básicas grátis, automações e IA sob assinatura</li>
</ul>
<h2>Economia de Unidade</h2>
<p>LTV de assinante (36 meses) = R$ 1.248 vs R$ 380 de venda única de hardware. CAC payback: 4-7 meses.</p>
<div style="background:var(--bg-elevated);border:1px solid var(--border);padding:1rem;border-radius:0.5rem;margin-top:1.5rem">
  <strong>Churn médio:</strong> 4,2% ao mês. Retenção aumenta 18% com gamificação e automações sugeridas.
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
