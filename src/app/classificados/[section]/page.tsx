interface PageParams {
  section: string;
}

export default async function Page({ params }: { params: PageParams }) {
  const { section } = params;

  const titleMap: Record<string, string> = {
    alugueis: "Aluguéis de curto prazo / viagens",
    imoveis: "Imóveis residenciais e comerciais",
    autos: "Veículos e maquinários (Publimotors)",
    servicos: "Serviços e profissionais (Publiservices)",
    produtos: "Produtos novos e usados (Publicoisas)",
  };

  const title = titleMap[section] || "Classificados";

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6 text-emerald-900">{title}</h1>

      <p className="text-gray-700 leading-relaxed mb-4">
        Esta seção faz parte da plataforma Publimicro. Em breve, aqui você
        encontrará anúncios, filtros, mapas e ferramentas dedicadas a{" "}
        <strong>{title.toLowerCase()}</strong>.
      </p>

      <p className="text-gray-500 italic mt-4">
        © {new Date().getFullYear()} Publimicro — conectando pessoas, negócios e
        ideias.
      </p>
    </main>
  );
}
