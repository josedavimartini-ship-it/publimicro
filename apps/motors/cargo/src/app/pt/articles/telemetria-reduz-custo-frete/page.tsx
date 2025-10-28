import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Telemetria Reduz Custo Operacional de Frete em Até 23% | PubliCargo',
  description: 'Sensores IoT e IA para roteirização dinâmica cortam combustível, pneus e manutenção não-planejada.',
  keywords: ['Logística 4.0','PubliCargo','Fernando Oliveira'],
  authors: [{ name: 'Fernando Oliveira' }],
  openGraph: {
    title: 'Telemetria Reduz Custo Operacional de Frete em Até 23%',
    description: 'Sensores IoT e IA para roteirização dinâmica cortam combustível, pneus e manutenção não-planejada.',
    type: 'article',
    publishedTime: '2025-10-08',
    authors: ['Fernando Oliveira']
  }
};

export default function ArticlePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12" dir="ltr">
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-zinc-600 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Logística 4.0</span>
          <time dateTime="2025-10-08">2025-10-08</time>
          <span>·</span>
          <span>9 min leitura</span>
        </div>
        
        <h1 className="text-4xl font-bold leading-tight mb-4">Telemetria Reduz Custo Operacional de Frete em Até 23%</h1>
        
        <p className="text-xl text-zinc-600 mb-6">Sensores IoT e IA para roteirização dinâmica cortam combustível, pneus e manutenção não-planejada.</p>
        
        <div className="flex items-center gap-3 pt-4 border-t">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            F
          </div>
          <div>
            <div className="font-semibold">Fernando Oliveira</div>
            <div className="text-sm text-zinc-600">Especialista PubliCargo</div>
          </div>
        </div>
      </header>

      <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-p:text-zinc-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-900 prose-ul:my-4 prose-li:my-1">
<p className="lead">Frotas equipadas com telemetria avançada (GPS, sensores de combustível, acelerômetro, câmeras ADAS) combinadas a plataformas de IA alcançam redução de 18-23% no custo por km rodado. ROI da tecnologia: 8-14 meses.</p>

<h2>Stack Tecnológico</h2>
<div className="grid md:grid-cols-2 gap-4 my-6">
  <div className="border rounded-lg p-4">
    <h3 className="font-semibold mb-3">🔧 Hardware</h3>
    <ul className="text-sm space-y-2">
      <li><strong>OBD-II + GPS</strong>: posição, RPM, consumo instantâneo</li>
      <li><strong>Sensores de carga</strong>: peso por eixo, temperatura baú refrigerado</li>
      <li><strong>Dashcam AI</strong>: detecção de fadiga, distração, eventos de risco</li>
      <li><strong>TPMS</strong>: pressão de pneus em tempo real</li>
      <li><strong>LoRa/NB-IoT</strong>: conectividade em áreas remotas</li>
    </ul>
  </div>
  <div className="border rounded-lg p-4">
    <h3 className="font-semibold mb-3">💻 Software</h3>
    <ul className="text-sm space-y-2">
      <li><strong>TMS (Transport Mgmt System)</strong>: Logcomex, Softruck, Oneat</li>
      <li><strong>Roteirização IA</strong>: Google OR-Tools, NextBillion.ai</li>
      <li><strong>Manutenção preditiva</strong>: Uptake, Samsara</li>
      <li><strong>BI & Analytics</strong>: Power BI com dashboards customizados</li>
      <li><strong>Integração ERP</strong>: SAP, TOTVS via API</li>
    </ul>
  </div>
</div>

<h2>Casos de Uso e Economia</h2>

<h3>1. Roteirização Dinâmica com Tráfego Real</h3>
<p><strong>Problema:</strong> Rotas fixas ignoram congestionamentos, obras e janelas de entrega.</p>
<p><strong>Solução:</strong> IA reoptimiza rotas a cada 15min considerando tráfego (Waze/Google), histórico de tempo de descarga por cliente e prioridade de carga.</p>
<p><strong>Resultado:</strong></p>
<ul className="list-disc pl-6">
  <li>Redução 12-16% km rodado</li>
  <li>Aumento 8-11% entregas/dia por veículo</li>
  <li>Economia combustível: R$ 3.200/mês por caminhão (diesel a R$ 6,10/L)</li>
</ul>

<h3>2. Gestão Preditiva de Pneus</h3>
<p><strong>Problema:</strong> Pneus mal calibrados aumentam consumo em 4-8% e desgaste prematuro.</p>
<p><strong>Solução:</strong> TPMS alerta quando pressão cai abaixo do ideal; IA prevê necessidade de rodízio/troca baseado em km, carga e estilo de direção.</p>
<p><strong>Resultado:</strong></p>
<ul className="list-disc pl-6">
  <li>Vida útil pneu +22% (de 68k para 83k km)</li>
  <li>Economia: R$ 18k/ano por veículo (considerando jogo de pneus R$ 12k)</li>
</ul>

<h3>3. Coaching de Motoristas com Score Comportamental</h3>
<p><strong>Problema:</strong> Frenagens bruscas, excesso RPM e marcha lenta elevam consumo e risco.</p>
<p><strong>Solução:</strong> Dashboard individual com score semanal (0-100) e gamificação (bônus para top 10%).</p>
<p><strong>Resultado:</strong></p>
<ul className="list-disc pl-6">
  <li>Redução 9% consumo combustível</li>
  <li>Queda 31% em sinistros</li>
  <li>Redução 18% manutenção corretiva (freios, embreagem)</li>
</ul>

<h2>Case: Transportadora Regional Sul</h2>
<div className="bg-zinc-50 p-6 rounded-lg my-6">
  <p className="font-semibold mb-3">Frota: 180 caminhões | Operação: distribuição de bebidas e alimentos</p>
  <p className="text-sm mb-4"><strong>Investimento:</strong> R$ 2,8 milhões (hardware + plataforma 3 anos)</p>
  
  <h4 className="font-semibold mt-4 mb-2">Economia Anual Recorrente</h4>
  <table className="w-full text-sm">
    <tbody>
      <tr className="border-t"><td className="py-2">Combustível (-14%)</td><td className="text-right font-semibold">R$ 1.890.000</td></tr>
      <tr className="border-t"><td className="py-2">Pneus (-22% reposição)</td><td className="text-right font-semibold">R$ 412.000</td></tr>
      <tr className="border-t"><td className="py-2">Manutenção (-18%)</td><td className="text-right font-semibold">R$ 324.000</td></tr>
      <tr className="border-t"><td className="py-2">Seguro (-12% sinistralidade)</td><td className="text-right font-semibold">R$ 156.000</td></tr>
      <tr className="border-t"><td className="py-2">Produtividade (+9% entregas)</td><td className="text-right font-semibold">R$ 680.000</td></tr>
      <tr className="border-t font-bold"><td className="py-2">Total</td><td className="text-right text-green-600">R$ 3.462.000</td></tr>
    </tbody>
  </table>
  <p className="text-xs text-zinc-600 mt-3"><strong>ROI:</strong> 9,7 meses | <strong>Payback:</strong> 14 meses (conservador)</p>
</div>

<h2>Sustentabilidade e ESG</h2>
<p>Redução de emissões vira métrica C-level:</p>
<ul className="list-disc pl-6">
  <li>Transportadoras certificam pegada de carbono por tonelada-km</li>
  <li>Shippers pagam premium de 3-7% por "frete verde" certificado</li>
  <li>Fundos ESG exigem reporting mensal de emissões para financiamento</li>
</ul>

<blockquote className="border-l-4 border-green-600 pl-4 italic my-6">
"Clientes CPG agora pedem relatório de emissões por rota. Quem não tem telemetria perde o contrato."
<footer className="text-sm text-zinc-600 mt-2">— Márcia Alves, Dir. Operações, LOG Transportes</footer>
</blockquote>

<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-8">
  <p className="font-semibold">🚀 Próxima Fronteira</p>
  <p className="text-sm mt-2">Platooning (comboios autônomos) em testes em rodovias pedagiadas: caminhões conectados seguem líder humano com 10m de distância, reduzindo arrasto e consumo em 8-12%. Previsão de liberação regulatória: 2026-2027.</p>
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
