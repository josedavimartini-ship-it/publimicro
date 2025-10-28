import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dados First-Party: Como Montadoras Revolucionam Mídia Automotiva | PubliAutos',
  description: 'Plataformas próprias de dados conectados geram ROAS 4-6x superior a campanhas tradicionais.',
  keywords: ['Marketing','PubliAutos','Daniela Ferreira'],
  authors: [{ name: 'Daniela Ferreira' }],
  openGraph: {
    title: 'Dados First-Party: Como Montadoras Revolucionam Mídia Automotiva',
    description: 'Plataformas próprias de dados conectados geram ROAS 4-6x superior a campanhas tradicionais.',
    type: 'article',
    publishedTime: '2025-10-05',
    authors: ['Daniela Ferreira']
  }
};

export default function ArticlePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12" dir="ltr">
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-zinc-600 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Marketing</span>
          <time dateTime="2025-10-05">2025-10-05</time>
          <span>·</span>
          <span>7 min leitura</span>
        </div>
        
        <h1 className="text-4xl font-bold leading-tight mb-4">Dados First-Party: Como Montadoras Revolucionam Mídia Automotiva</h1>
        
        <p className="text-xl text-zinc-600 mb-6">Plataformas próprias de dados conectados geram ROAS 4-6x superior a campanhas tradicionais.</p>
        
        <div className="flex items-center gap-3 pt-4 border-t">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            D
          </div>
          <div>
            <div className="font-semibold">Daniela Ferreira</div>
            <div className="text-sm text-zinc-600">Especialista PubliAutos</div>
          </div>
        </div>
      </header>

      <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-p:text-zinc-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-900 prose-ul:my-4 prose-li:my-1">
<p className="lead">Montadoras acumulam bilhões de pontos de dados via apps, telemetria e sistemas embarcados. Esse ativo, combinado com retail media, cria vantagem competitiva insuperável frente a revendas independentes e marketplaces.</p>

<h2>Ecossistema de Dados</h2>
<p>Principais fontes de dados first-party automotivos:</p>

<div className="grid md:grid-cols-3 gap-4 my-6">
  <div className="border rounded-lg p-4">
    <h3 className="font-semibold mb-2">🚗 Telemetria</h3>
    <ul className="text-sm space-y-1">
      <li>Padrões de uso (km, rotas)</li>
      <li>Estilo de direção</li>
      <li>Manutenções preditivas</li>
      <li>Consumo real</li>
    </ul>
  </div>
  <div className="border rounded-lg p-4">
    <h3 className="font-semibold mb-2">📱 Apps & Conectividade</h3>
    <ul className="text-sm space-y-1">
      <li>Preferências de features</li>
      <li>Agendamentos serviço</li>
      <li>Interação com conteúdo</li>
      <li>Upgrades ativados</li>
    </ul>
  </div>
  <div className="border rounded-lg p-4">
    <h3 className="font-semibold mb-2">🏪 Retail & CRM</h3>
    <ul className="text-sm space-y-1">
      <li>Histórico test drives</li>
      <li>Configurações salvas</li>
      <li>Interações concessionária</li>
      <li>NPS e feedback</li>
    </ul>
  </div>
</div>

<h2>Casos de Uso Retail Media</h2>

<h3>1. Retargeting Comportamental Avançado</h3>
<p>Usuário que configura modelo no site mas não agenda test drive recebe campanha sequential com:</p>
<ul className="list-disc pl-6 space-y-1">
  <li>Dia 1-2: Review em vídeo do modelo configurado</li>
  <li>Dia 3-5: Depoimento de cliente com perfil similar</li>
  <li>Dia 6-7: Oferta limitada de test drive VIP + brinde</li>
  <li>Dia 8+: Desconto de lançamento ou taxa especial</li>
</ul>

<h3>2. Lookalike Preditivo</h3>
<p>Modelo de ML identifica prospects com probabilidade >60% de compra nos próximos 90 dias baseado em:</p>
<ul className="list-disc pl-6">
  <li>Tempo desde última compra de veículo (dados DMV)</li>
  <li>Engajamento com conteúdo da marca</li>
  <li>Sinais de pesquisa (search, YouTube)</li>
  <li>Eventos de vida (mudança, novo emprego via parcerias)</li>
</ul>

<h3>3. Upsell Pós-Venda Personalizado</h3>
<p>Proprietários de veículos recebem ofertas contextuais:</p>
<ul className="list-disc pl-6">
  <li><strong>Km 8.000-12.000</strong>: Revisão + upgrade de features via OTA</li>
  <li><strong>Fim de garantia</strong>: Extensão + plano de manutenção</li>
  <li><strong>2-3 anos de uso</strong>: Trade-in com bônus de fidelidade</li>
</ul>

<h2>Performance: Antes vs Depois</h2>
<div className="bg-zinc-50 p-6 rounded-lg my-6">
  <h3 className="font-semibold mb-3">Case Montadora Premium (12 meses)</h3>
  <table className="w-full">
    <thead className="text-sm text-zinc-600">
      <tr><th className="text-left pb-2">Métrica</th><th className="pb-2">Mídia Tradicional</th><th className="pb-2">1P Data + Retail Media</th><th className="pb-2">∆</th></tr>
    </thead>
    <tbody className="text-sm">
      <tr className="border-t"><td className="py-2">CPL</td><td>R$ 420</td><td>R$ 185</td><td className="text-green-600 font-semibold">-56%</td></tr>
      <tr className="border-t"><td className="py-2">Taxa conversão</td><td>3,2%</td><td>11,8%</td><td className="text-green-600 font-semibold">+269%</td></tr>
      <tr className="border-t"><td className="py-2">ROAS</td><td>2,1x</td><td>8,4x</td><td className="text-green-600 font-semibold">+300%</td></tr>
      <tr className="border-t"><td className="py-2">Ciclo venda</td><td>42 dias</td><td>26 dias</td><td className="text-green-600 font-semibold">-38%</td></tr>
    </tbody>
  </table>
</div>

<h2>Privacidade e Governança</h2>
<p>LGPD exige transparência e opt-in explícito. Montadoras vencedoras:</p>
<ol className="list-decimal pl-6 space-y-2">
  <li>Oferecem valor claro em troca de dados (features gratuitas, descontos exclusivos)</li>
  <li>Permitem controle granular de compartilhamento</li>
  <li>Praticam data minimization (coletam apenas necessário)</li>
  <li>Anonimizam dados para parcerias (clean rooms)</li>
</ol>

<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-8">
  <p className="font-semibold">🎯 Recomendação PubliAutos</p>
  <p className="text-sm mt-2">Concessionárias devem criar CDP (Customer Data Platform) compartilhado com montadora via clean room, permitindo ativação de audiências sem expor PII. Ferramentas: Salesforce CDP Automotive, Adobe Experience Platform, Treasure Data.</p>
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
