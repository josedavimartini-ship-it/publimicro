import Link from 'next/link';
import { Building2, Tractor, Sparkles } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliProper - Imóveis Urbanos e Rurais | ACHEME',
  description: 'Encontre imóveis urbanos, rurais e comerciais no PubliProper. Apartamentos, casas, sítios, fazendas e lançamentos. Compre, venda ou alugue com segurança no marketplace da ACHEME.',
  keywords: 'imóveis, casas, apartamentos, sítios, fazendas, imóveis rurais, imóveis urbanos, lançamentos imobiliários',
  openGraph: {
    title: 'PubliProper - Imóveis para Todos os Estilos',
    description: 'Imóveis urbanos, rurais e comerciais. Encontre sua próxima casa, apartamento, sítio ou fazenda.',
    type: 'website',
  },
};

export default function PubliProperPage() {
  const categories = [
    {
      title: 'Proper Urban',
      icon: <Building2 className="w-12 h-12" />,
      href: '/proper/urban',
      description: 'Apartamentos, casas e imóveis urbanos',
      color: 'from-[#A8C97F] to-[#0D7377]',
    },
    {
      title: 'Proper Rural',
      icon: <Tractor className="w-12 h-12" />,
      href: '/proper/rural',
      description: 'Sítios, fazendas e chácaras',
      color: 'from-[#5F7161] to-[#0D7377]',
    },
    {
      title: 'Comercial',
      icon: <Building2 className="w-12 h-12" />,
      href: '/proper/comercial',
      description: 'Salas, galpões e pontos comerciais',
      color: 'from-[#B7791F] to-[#CD7F32]',
    },
    {
      title: 'Lançamentos',
      icon: <Sparkles className="w-12 h-12" />,
      href: '/proper/lancamentos',
      description: 'Novos empreendimentos',
      color: 'from-[#E6C98B] to-[#B7791F]',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] via-[#CD7F32] to-[#B87333] mb-6">
            PubliProper
          </h1>
          <p className="text-2xl text-[#d8c68e] mb-4">
            Seu imóvel ideal está aqui
          </p>
          <p className="text-lg text-[#676767] max-w-2xl mx-auto">
            Do campo à cidade, encontre apartamentos, casas, sítios, fazendas e muito mais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 hover:border-[#A8C97F] transition-all hover:scale-105"
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center text-[#0a0a0a] mb-6`}>
                {category.icon}
              </div>
              <h2 className="text-3xl font-bold text-[#B7791F] group-hover:text-[#A8C97F] transition-colors mb-3">
                {category.title}
              </h2>
              <p className="text-[#676767]">{category.description}</p>
              <div className="mt-6 text-[#A8C97F] group-hover:translate-x-2 transition-transform">
                Ver anúncios →
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-[#B7791F] mb-4">
            Quer anunciar seu imóvel?
          </h3>
          <p className="text-[#676767] mb-6">
            Publique grátis e alcance milhares de compradores
          </p>
          <Link
            href="/anunciar"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] hover:from-[#0D7377] hover:to-[#A8C97F] text-white font-bold rounded-full transition-all hover:scale-105"
          >
            📢 Publicar Anúncio Grátis
          </Link>
        </div>
      </div>
    </main>
  );
}





