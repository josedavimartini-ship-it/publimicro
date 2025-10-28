import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eletrificação Transforma o Varejo Automotivo em 2025 | PubliAutos',
  description: 'Como concessionárias estão reinventando a experiência de compra para a era dos veículos elétricos.',
  keywords: ['Tendências','PubliAutos','Marina Costa'],
  authors: [{ name: 'Marina Costa' }],
  openGraph: {
    title: 'Eletrificação Transforma o Varejo Automotivo em 2025',
    description: 'Como concessionárias estão reinventando a experiência de compra para a era dos veículos elétricos.',
    type: 'article',
    publishedTime: '2025-10-15',
    authors: ['Marina Costa']
  }
};

export default function ArticlePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12" dir="ltr">
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-zinc-600 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Tendências</span>
          <time dateTime="2025-10-15">2025-10-15</time>
          <span>·</span>
          <span>8 min leitura</span>
        </div>
        
        <h1 className="text-4xl font-bold leading-tight mb-4">Eletrificação Transforma o Varejo Automotivo em 2025</h1>
        
        <p className="text-xl text-zinc-600 mb-6">Como concessionárias estão reinventando a experiência de compra para a era dos veículos elétricos.</p>
        
        <div className="flex items-center gap-3 pt-4 border-t">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            M
          </div>
          <div>
            <div className="font-semibold">Marina Costa</div>
            <div className="text-sm text-zinc-600">Especialista PubliAutos</div>
          </div>
        </div>
      </header>

      <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-p:text-zinc-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-900 prose-ul:my-4 prose-li:my-1">
<p className="lead">O mercado automotivo brasileiro passa por sua maior transformação em décadas. Com EVs representando 12% das vendas em 2025 e previsão de 35% até 2028, concessionárias enfrentam o desafio de adaptar modelo de negócio, infraestrutura e cultura organizacional.</p>

<h2>O Novo Perfil do Comprador</h2>
<p>Compradores de EVs têm jornada digital 40% mais longa que compradores de veículos convencionais. Passam média de 18 horas pesquisando antes da visita à loja, consultam 6-8 fontes diferentes e valorizam transparência sobre autonomia real, custo de recarga e infraestrutura local.</p>

<blockquote className="border-l-4 border-blue-600 pl-4 italic my-6">
"Não vendemos mais apenas carros. Vendemos ecossistemas de mobilidade elétrica, com wallbox, planos de energia e serviços conectados."
<footer className="text-sm text-zinc-600 mt-2">— Roberto Lima, Diretor Comercial, Concessionária Premium SP</footer>
</blockquote>

<h2>Infraestrutura e Experiência</h2>
<p>Showrooms investem em:</p>
<ul className="list-disc pl-6 space-y-2">
  <li><strong>Simuladores de autonomia</strong> baseados em rotas reais do cliente</li>
  <li><strong>Test drives de longa duração</strong> (24-48h) para validar uso diário</li>
  <li><strong>Transparência de TCO</strong> com calculadoras interativas comparando custo por km</li>
  <li><strong>Parcerias com energia</strong> para oferecer planos residenciais e comerciais</li>
</ul>

<h2>Dados e Performance</h2>
<div className="bg-zinc-50 p-6 rounded-lg my-6">
  <h3 className="font-semibold mb-3">Benchmarks 2025 (Brasil)</h3>
  <dl className="grid grid-cols-2 gap-4">
    <div><dt className="text-sm text-zinc-600">CPL EV</dt><dd className="text-xl font-semibold">R$ 180-240</dd></div>
    <div><dt className="text-sm text-zinc-600">Taxa conversão lead→visita</dt><dd className="text-xl font-semibold">22%</dd></div>
    <div><dt className="text-sm text-zinc-600">Taxa conversão visita→venda</dt><dd className="text-xl font-semibold">18%</dd></div>
    <div><dt className="text-sm text-zinc-600">Ciclo médio venda EV</dt><dd className="text-xl font-semibold">28 dias</dd></div>
  </dl>
</div>

<h2>Mídia e Aquisição</h2>
<p>Estratégias vencedoras combinam:</p>
<ol className="list-decimal pl-6 space-y-2">
  <li><strong>Search de cauda longa</strong>: "autonomia real BYD Dolphin inverno", "custo kWh recarga rápida SP"</li>
  <li><strong>YouTube educacional</strong>: reviews independentes e comparativos técnicos geram 3x mais leads qualificados</li>
  <li><strong>Retargeting contextual</strong>: visitantes de calculadoras de TCO recebem ofertas personalizadas de financiamento verde</li>
  <li><strong>Parcerias com charging networks</strong>: co-marketing com Tupinambá, Shell Recharge</li>
</ol>

<h2>O Futuro: Software-Defined Vehicles</h2>
<p>Próxima onda traz receita recorrente via OTA updates, features sob demanda e dados de telemetria. Concessionárias precisam evoluir de transacionais para relacionamento contínuo, vendendo upgrades de software, planos de conectividade e serviços preditivos.</p>

<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-8">
  <p className="font-semibold">💡 Insight PubliAutos</p>
  <p className="text-sm mt-2">Montadoras que oferecem trial de features premium (piloto automático, performance boost) via app têm taxa de conversão 34% maior para planos anuais de R$ 1.200-2.400.</p>
</div>
      </div>

      <footer className="mt-16 pt-8 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-2">Gostou deste artigo?</h3>
            <p className="text-sm text-zinc-600">Compartilhe com sua rede</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Compartilhar
            </button>
            <button className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition">
              Salvar
            </button>
          </div>
        </div>
      </footer>
    </article>
  );
}
