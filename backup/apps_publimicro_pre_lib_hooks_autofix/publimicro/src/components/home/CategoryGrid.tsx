import SectionCard from "@/components/SectionCard";

interface Category {
  name: string;
  desc: string;
  href: string;
}

const categories: Category[] = [
  {
    name: "Publiproper (Imóveis)",
    desc: "Imóveis residenciais, rurais, sítios e propriedades de alto valor.",
    href: "/imoveis",
  },
  {
    name: "Publiautos (Veículos)",
    desc: "Venda e aluguel de veículos, comerciais e de passeio.",
    href: "/classificados",
  },
  {
    name: "Publicoisas (Classificados Gerais)",
    desc: "Tudo que não cabe nas outras seções.",
    href: "/classificados",
  },
  {
    name: "Serviços Sob Demanda",
    desc: "Profissionais e serviços sob orçamento.",
    href: "/classificados",
  },
  {
    name: "Comércio Exterior & Logística",
    desc: "Intermediação de negócios internacionais.",
    href: "/classificados",
  },
  {
    name: "Co-ownership / Aquisições",
    desc: "Aquisições conjuntas de bens de alto valor.",
    href: "/classificados",
  },
];

export default function CategoryGrid(): JSX.Element {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <SectionCard
            key={c.name}
            title={c.name}
            description={c.desc}
            href={c.href}
          />
        ))}
      </div>
    </section>
  );
}
