
export default function Page({ params }) {
  const { section } = params;
  const titleMap = {
    'alugueis':'Aluguéis de curto prazo / viagens',
    'veiculos':'Veículos (Publiautos)',
    'imoveis':'Imóveis (Publiproper)',
    'embarcacoes':'Embarcações',
    'equipamentos':'Equipamentos e bens de alto valor',
    'maquinarios':'Maquinários Agrícolas e Industriais',
    'aluguel-particulares':'Aluguel entre particulares',
    'co-ownership':'Co-ownership / Aquisição conjunta',
    'servicos':'Serviços sob demanda / profissionais',
    'comex':'Intermediação de negócios e Comércio Exterior',
    'publicoisas':'Classificados Geral de Vendas (Publicoisas)'
  };
  const title = titleMap[section] || 'Seção';

  return (
    <main style={{ padding: 24, maxWidth:900, margin:'0 auto' }}>
      <h1>{title}</h1>
      <p>Esta seção apresenta a proposta da área {title}. Em futuro desenvolvimento criaremos listagens completas, filtros e ferramentas dedicadas.</p>
    </main>
  )
}
