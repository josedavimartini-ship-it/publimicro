import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apps de Delivery Impulsionam 68% do Crescimento em Motos Urbanas | PubliMotos',
  description: 'Parcerias com iFood, Rappi e Loggi criam novo canal de vendas e financiamento para motociclistas profissionais.',
  keywords: ['Mercado','PubliMotos','Ricardo Santos'],
  authors: [{ name: 'Ricardo Santos' }],
  openGraph: {
    title: 'Apps de Delivery Impulsionam 68% do Crescimento em Motos Urbanas',
    description: 'Parcerias com iFood, Rappi e Loggi criam novo canal de vendas e financiamento para motociclistas profissionais.',
    type: 'article',
    publishedTime: '2025-10-12',
    authors: ['Ricardo Santos']
  }
};

export default function ArticlePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12" dir="ltr">
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-zinc-600 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Mercado</span>
          <time dateTime="2025-10-12">2025-10-12</time>
          <span>·</span>
          <span>6 min leitura</span>
        </div>
        
        <h1 className="text-4xl font-bold leading-tight mb-4">Apps de Delivery Impulsionam 68% do Crescimento em Motos Urbanas</h1>
        
        <p className="text-xl text-zinc-600 mb-6">Parcerias com iFood, Rappi e Loggi criam novo canal de vendas e financiamento para motociclistas profissionais.</p>
        
        <div className="flex items-center gap-3 pt-4 border-t">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            R
          </div>
          <div>
            <div className="font-semibold">Ricardo Santos</div>
            <div className="text-sm text-zinc-600">Especialista PubliMotos</div>
          </div>
        </div>
      </header>

      <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-p:text-zinc-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-900 prose-ul:my-4 prose-li:my-1">
<p className="lead">Demanda por mobilidade urbana e trabalho on-demand elevou vendas de motos 125-160cc em 42% no último ano. Fabricantes e concessionárias criam programas específicos para entregadores, com financiamento flexível e manutenção subsidiada.</p>

<h2>Números do Segmento</h2>
<ul className="list-disc pl-6 space-y-2">
  <li><strong>890 mil entregadores ativos</strong> em apps de delivery no Brasil (set/2025)</li>
  <li><strong>72% usam moto própria</strong> (vs 18% alugada, 10% bicicleta/patinete)</li>
  <li><strong>Troca a cada 18-24 meses</strong> devido a alto uso (média 220 km/semana)</li>
  <li><strong>Ticket médio R$ 14.800</strong> para motos 0km categoria delivery</li>
</ul>

<h2>Modelos de Parceria</h2>

<h3>1. Honda + iFood: Programa Moto Própria</h3>
<p>Entrada facilitada (R$ 800) + 48x com taxa subsidiada pelo iFood para entregadores com rating >4.7:</p>
<ul className="list-disc pl-6">
  <li>Seguro incluso no financiamento</li>
  <li>Manutenção gratuita primeiros 12 meses</li>
  <li>Kit de entrega (baú, suporte celular) sem custo</li>
  <li>Aprovação em 24h via análise de histórico no app</li>
</ul>
<p className="text-sm text-zinc-600 mt-2"><strong>Resultado:</strong> 12.400 motos vendidas em 6 meses, taxa inadimplência 4,2% (vs 9,8% mercado tradicional)</p>

<h3>2. Yamaha + Rappi: Flex Ownership</h3>
<p>Modelo híbrido aluguel-compra:</p>
<ul className="list-disc pl-6">
  <li>Aluguel de R$ 680/mês com opção de compra após 12 meses</li>
  <li>50% do valor pago em aluguel abate no preço final</li>
  <li>Manutenção e seguro inclusos durante locação</li>
  <li>Upgrade automático se atingir meta de entregas</li>
</ul>

<h3>3. Shineray + Loggi: Trade-In Garantido</h3>
<p>Compra garantida da moto usada após 18 meses por 55% do valor pago:</p>
<ul className="list-disc pl-6">
  <li>Entregador sempre pilota moto "nova" (reduz manutenção)</li>
  <li>Loggi revende no mercado de seminovos</li>
  <li>Fabricante mantém fluxo constante de vendas</li>
</ul>

<h2>Estratégias de Aquisição</h2>
<p>Como concessionárias captam esse público:</p>

<div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
  <h3 className="font-semibold mb-2">🎯 Canais de Alto ROI</h3>
  <ol className="list-decimal pl-6 space-y-2 text-sm">
    <li><strong>In-app ads nos próprios apps de delivery</strong>: banners e notificações para entregadores com moto >3 anos ou alugada</li>
    <li><strong>Grupos de WhatsApp e Telegram</strong>: comunidades de entregadores com 5k-50k membros</li>
    <li><strong>Parcerias com dark kitchens</strong>: stands em pontos de retirada</li>
    <li><strong>Creators de nicho</strong>: YouTubers "vida de entregador" com reviews de motos</li>
  </ol>
</div>

<h2>Tendências: Eletrificação Chega ao Delivery</h2>
<p>E-motos ganham tração com TCO 60% menor:</p>
<ul className="list-disc pl-6 space-y-2">
  <li><strong>Voltz EVS</strong>: parceria com Shell para recarga grátis em postos selecionados</li>
  <li><strong>Shineray SE</strong>: bateria swappable em 2min em rede de +400 estações</li>
  <li><strong>Tork Eletric</strong>: subscrição all-inclusive R$ 890/mês (moto + energia + seguro + manutenção)</li>
</ul>

<blockquote className="border-l-4 border-blue-600 pl-4 italic my-6">
"Com energia a R$ 0,65/kWh e consumo de 35 km/kWh, gasto R$ 130/mês. Com gasolina gastava R$ 680. Moto se paga em 14 meses só de economia."
<footer className="text-sm text-zinc-600 mt-2">— Júlio Ramos, entregador iFood, 3.200 entregas/ano</footer>
</blockquote>

<div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-8">
  <p className="font-semibold">💡 Oportunidade PubliMotos</p>
  <p className="text-sm mt-2">Marketplaces B2B conectando frotas de delivery a montadoras para compra em lote (50-200 unidades) com desconto de 12-18% + serviço white-label de gestão de frota. Endereçável: R$ 2,1 bi/ano.</p>
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
