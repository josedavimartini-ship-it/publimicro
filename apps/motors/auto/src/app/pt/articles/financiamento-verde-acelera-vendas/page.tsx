import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financiamento Verde: Como Linhas Especiais Aceleram Conversão | PubliAutos',
  description: 'Taxas reduzidas e prazos estendidos para EVs viram argumento decisivo em 41% das vendas.',
  keywords: ['Finanças','PubliAutos','Carlos Mendes'],
  authors: [{ name: 'Carlos Mendes' }],
  openGraph: {
    title: 'Financiamento Verde: Como Linhas Especiais Aceleram Conversão',
    description: 'Taxas reduzidas e prazos estendidos para EVs viram argumento decisivo em 41% das vendas.',
    type: 'article',
    publishedTime: '2025-10-10',
    authors: ['Carlos Mendes']
  }
};

export default function ArticlePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12" dir="ltr">
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-zinc-600 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Finanças</span>
          <time dateTime="2025-10-10">2025-10-10</time>
          <span>·</span>
          <span>6 min leitura</span>
        </div>
        
        <h1 className="text-4xl font-bold leading-tight mb-4">Financiamento Verde: Como Linhas Especiais Aceleram Conversão</h1>
        
        <p className="text-xl text-zinc-600 mb-6">Taxas reduzidas e prazos estendidos para EVs viram argumento decisivo em 41% das vendas.</p>
        
        <div className="flex items-center gap-3 pt-4 border-t">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            C
          </div>
          <div>
            <div className="font-semibold">Carlos Mendes</div>
            <div className="text-sm text-zinc-600">Especialista PubliAutos</div>
          </div>
        </div>
      </header>

      <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-p:text-zinc-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-900 prose-ul:my-4 prose-li:my-1">
<p className="lead">Bancos e fintechs lançaram R$ 8,5 bilhões em linhas verdes para veículos elétricos e híbridos em 2025. Com taxas 1,5-2,5 p.p. abaixo do crédito automotivo tradicional e prazos de até 84 meses, o financiamento virou peça-chave na estratégia comercial.</p>

<h2>Números do Mercado</h2>
<table className="w-full border-collapse my-6">
  <thead className="bg-zinc-100">
    <tr><th className="border p-2 text-left">Tipo</th><th className="border p-2">Taxa média</th><th className="border p-2">Prazo máx</th><th className="border p-2">LTV</th></tr>
  </thead>
  <tbody>
    <tr><td className="border p-2">Tradicional</td><td className="border p-2 text-center">1,89% a.m.</td><td className="border p-2 text-center">60 meses</td><td className="border p-2 text-center">80%</td></tr>
    <tr><td className="border p-2">Verde (EV)</td><td className="border p-2 text-center">1,39% a.m.</td><td className="border p-2 text-center">84 meses</td><td className="border p-2 text-center">90%</td></tr>
    <tr><td className="border p-2">Verde (Híbrido)</td><td className="border p-2 text-center">1,59% a.m.</td><td className="border p-2 text-center">72 meses</td><td className="border p-2 text-center">85%</td></tr>
  </tbody>
</table>

<h2>Impacto na Jornada</h2>
<p>Concessionárias que integram simuladores de crédito verde no site e apresentam comparativo de parcela + custo energia vs. parcela + combustível no primeiro atendimento aumentam taxa de aprovação em 28%.</p>

<h3>Case: Grupo Localiza</h3>
<p>Implementou calculadora de TCO comparativo em todas as landing pages de EVs:</p>
<ul className="list-disc pl-6 space-y-1">
  <li>Lead qualificado +35%</li>
  <li>Taxa de aprovação crédito: 71% (vs 54% sem calculadora)</li>
  <li>Ticket médio financiado: R$ 178k (vs R$ 142k)</li>
  <li>NPS pós-venda: 84</li>
</ul>

<blockquote className="border-l-4 border-green-600 pl-4 italic my-6">
"Cliente que simula financiamento verde antecipadamente chega à loja com decisão 80% tomada. Nossa função vira consultoria, não convencimento."
<footer className="text-sm text-zinc-600 mt-2">— Ana Paula Rocha, Head de Crédito, Grupo Localiza</footer>
</blockquote>

<h2>Parcerias Estratégicas</h2>
<p>Montadoras firmam acordos com bancos para oferecer taxa promocional em lançamentos:</p>
<ol className="list-decimal pl-6 space-y-2">
  <li><strong>BYD + Banco do Brasil</strong>: 0,99% a.m. primeiros 12 meses</li>
  <li><strong>GWG + Santander</strong>: carência de 90 dias + seguro incluso</li>
  <li><strong>Renault + Itaú</strong>: cashback de R$ 2k em wallbox para financiamentos acima de R$ 120k</li>
</ol>

<div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-8">
  <p className="font-semibold">📊 Métrica-chave</p>
  <p className="text-sm mt-2">Taxa de aprovação de crédito verde alcança 68% vs 51% do crédito tradicional, graças a perfil de renda 22% superior do comprador EV e scoring diferenciado para veículos sustentáveis.</p>
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
