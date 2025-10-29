'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Carcara3D } from '@publimicro/ui';
import Image from 'next/image';
import Link from 'next/link';

// Supabase Sitio interface
interface Sitio {
  id: string;
  nome: string;
  localizacao: string;
  preco?: number;
  fotos: string[];
  destaque?: boolean;
  zona?: string;
  lance_inicial?: number;
}

export default function HomePage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSitios() {
      try {
        const { data, error } = await supabase
          .from('sitios')
          .select('*')
          .eq('destaque', true);
        
        if (error) {
          console.error('Error fetching sítios:', error);
          // Use fallback data if Supabase fails
          setSitios([]);
        } else {
          setSitios(data || []);
        }
      } catch (err) {
        console.error('Exception fetching sítios:', err);
        setSitios([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSitios();
  }, []);

  const sections = [
    {
      name: 'PubliProper',
      icon: '🏘️',
      href: '/proper',
      bgImage: '/images/sections/publiProper-bg.jpg',
      description: 'Imóveis Urbanos & Rurais',
    },
    {
      name: 'PubliMotors',
      icon: '🚗',
      href: '/motors',
      bgImage: '/images/sections/publiMotors-bg.jpg',
      description: 'Veículos e Transporte',
    },
    {
      name: 'PubliHeavyAgro',
      icon: '🚜',
      href: '/machina',
      bgImage: '/images/sections/publiHeavyAgro-bg.jpg',
      description: 'Máquinas & Agroindústria',
    },
    {
      name: 'PubliMarine',
      icon: '⛵',
      href: '/marine',
      bgImage: '/images/sections/publiMarine-bg.jpg',
      description: 'Náutica, Pesca & Aventura',
    },
    {
      name: 'PubliGlobal',
      icon: '🌍',
      href: '/global',
      bgImage: '/images/sections/publiGlobal-bg.jpg',
      description: 'Comércio Internacional',
    },
    {
      name: 'PubliJourney',
      icon: '✈️',
      href: '/journey',
      bgImage: '/images/sections/publiJourney-bg.jpg',
      description: 'Turismo & Viagens',
    },
    {
      name: 'PubliShare',
      icon: '🤝',
      href: '/share',
      bgImage: '/images/sections/publiShare-bg.jpg',
      description: 'Economia Colaborativa',
    },
    {
      name: 'PubliTudo',
      icon: '🛍️',
      href: '/tudo',
      bgImage: '/images/sections/publiTudo-bg.jpg',
      description: 'Marketplace & Serviços',
    },
  ];

  const carcaraSites = [
    {
      id: 'surucua',
      nome: 'Surucuá',
      zona: 'Zona da Mata',
      preco: 1700000,
      lance_inicial: 1050000,
      fotos: ['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/surucua.jpg'],
    },
    {
      id: 'juriti',
      nome: 'Juriti',
      zona: 'Zona da Mata',
      preco: 2000000,
      lance_inicial: 1200000,
      fotos: ['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/solposto.jpg'],
    },
    {
      id: 'seriema',
      nome: 'Seriema',
      zona: 'Zona da Mata',
      preco: 2350000,
      lance_inicial: 1550000,
      fotos: ['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol7.jpg'],
    },
    {
      id: 'mergulhao',
      nome: 'Mergulhão',
      zona: 'Beira-Rio',
      preco: 2950000,
      lance_inicial: 1950000,
      fotos: ['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mutum.jpg'],
    },
    {
      id: 'bigua',
      nome: 'Biguá',
      zona: 'Beira-Rio',
      preco: 3250000,
      lance_inicial: 2250000,
      fotos: ['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol1.jpg'],
    },
    {
      id: 'abare',
      nome: 'Abaré',
      zona: 'Beira-Rio',
      preco: 3650000,
      lance_inicial: 2550000,
      fotos: ['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosolOrange.jpg'],
    },
  ];

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Main Content - No right margin needed, sidebar is on RIGHT */}
      <div className="relative">
        {/* Hero Section - Ecosystem Intro */}
        <section className="text-center pt-12 pb-8 px-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] via-[#CD7F32] to-[#B87333] leading-tight">
            O Ecossistema PubliMicro
          </h1>
          <p className="text-[#d8c68e] text-xl md:text-2xl mb-2 leading-relaxed">
            Um universo de negócios, tecnologia e oportunidades
          </p>
          <p className="text-[#676767] text-lg">
            <span className="text-[#FF6B35] text-3xl font-bold">•</span> do campo à cidade, do local ao global <span className="text-[#FF6B35] text-3xl font-bold">•</span>
          </p>
        </section>

        {/* Sections Grid - 8 Full-Width Buttons with Background Images */}
        <section className="px-6 py-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sections.map((section) => (
              <Link
                key={section.name}
                href={section.href}
                className="group relative h-48 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#FF6B35]/30 transition-all duration-500 hover:scale-105"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${section.bgImage}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-6xl mb-3 transform group-hover:scale-110 transition-transform">
                    {section.icon}
                  </span>
                  <h3 className="text-xl font-bold text-[#B7791F] group-hover:text-[#FF6B35] transition-colors mb-1">
                    {section.name}
                  </h3>
                  <p className="text-sm text-[#676767]">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SUPER HIGHLIGHT - Sítios Carcará with BIRD */}
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FF6B35]/40 min-h-[500px]">
            <Image
              src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg"
              alt="Sítios Carcará Background"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/70 to-transparent" />
            
            {/* Bird Animation - positioned to avoid sidebar overlap */}
            <div className="absolute top-8 left-8 w-[200px] h-[250px] z-30">
              <Carcara3D scale={1.25} />
            </div>

            <div className="relative p-12 z-20">
              <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 bg-[#FF6B35]/30 border-2 border-[#FF6B35] rounded-full backdrop-blur-md">
                <span className="text-[#FF6B35] font-bold text-base tracking-widest uppercase">
                  🦅 Super Destaque
                </span>
              </div>
              <h2 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FF8C42] to-[#B7791F] mb-6 drop-shadow-2xl max-w-3xl">
                Sítios Carcará's Project
              </h2>
              <p className="text-[#d8c68e] text-2xl mb-8 max-w-2xl leading-relaxed">
                6 propriedades exclusivas às margens da represa. Natureza preservada, infraestrutura completa e lances a partir de R$ 1.050.000.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/projetos/carcara"
                  className="px-10 py-5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] text-lg font-bold rounded-full transition-all hover:scale-105 shadow-2xl"
                >
                  🏡 Explorar Projeto Completo
                </Link>
                <Link
                  href="/proper/rural"
                  className="px-10 py-5 border-3 border-[#0D7377] text-[#0D7377] hover:bg-[#0D7377]/10 text-lg font-bold rounded-full transition-all"
                >
                  🌾 Ver Mais Imóveis Rurais
                </Link>
              </div>
            </div>
          </div>

          {/* 6 Sítios Showcase */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {carcaraSites.map((site) => (
              <article
                key={site.id}
                className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-3 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#FF6B35] hover:shadow-2xl hover:shadow-[#FF6B35]/30 transition-all"
              >
                <div className="relative aspect-video">
                  <Image
                    src={site.fotos[0]}
                    alt={`Sítio ${site.nome}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-4 py-2 bg-[#2a2a2a]/95 backdrop-blur-md rounded-full border border-[#3a3a2a]">
                    <span className="text-[#5F7161] text-sm font-bold">{site.zona}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-3xl font-bold text-[#FF6B35] mb-4">{site.nome}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <div className="text-xs text-[#676767] mb-1">Valor estimado</div>
                      <div className="font-semibold text-[#D4A574] text-lg">
                        R$ {(site.preco / 1000000).toFixed(1).replace('.', ',')}M
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#676767] mb-1">Lance inicial</div>
                      <div className="font-bold text-[#FF6B35] text-lg">
                        R$ {(site.lance_inicial / 1000000).toFixed(2).replace('.', ',')}M
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/projetos/carcara/${site.id}`}
                    className="block text-center px-6 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
                  >
                    Ver Detalhes e Fazer Lance
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Featured Sitios from Supabase */}
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] to-[#CD7F32]">
              Recomendados para você
            </h3>
            <Link
              href="/anunciar"
              className="px-8 py-4 bg-gradient-to-r from-[#5F7161] to-[#0D7377] hover:from-[#0D7377] hover:to-[#5F7161] text-[#f2e6b1] font-bold rounded-full transition-all hover:scale-105 shadow-xl"
            >
              📢 Publicar seu anúncio grátis
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#FF6B35] border-t-transparent"></div>
            </div>
          ) : sitios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sitios.map((sitio) => (
                <article
                  key={sitio.id}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#B7791F] hover:shadow-xl hover:shadow-[#B7791F]/20 transition-all"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={sitio.fotos?.[0] || '/placeholder.jpg'}
                      alt={sitio.nome}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-[#B7791F] mb-2">{sitio.nome}</h4>
                    <p className="text-[#676767] text-sm mb-3">📍 {sitio.localizacao}</p>
                    <p className="text-[#d8c68e] text-xl font-semibold">
                      {sitio.preco ? `R$ ${sitio.preco.toLocaleString('pt-BR')}` : 'A negociar'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#676767] text-xl">Nenhum imóvel em destaque no momento.</p>
              <p className="text-[#676767] text-sm mt-2">Verifique novamente em breve!</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 bg-[#0a0a0c] border-t-2 border-[#2a2a1a] py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
              <CategoryList
                title="PubliProper"
                items={[
                  { label: 'Urban', href: '/proper/urban' },
                  { label: 'Rural', href: '/proper/rural' },
                ]}
              />
              <CategoryList
                title="PubliMotors"
                items={[
                  { label: 'Auto', href: '/motors/auto' },
                  { label: 'Cargo', href: '/motors/cargo' },
                  { label: 'Moto', href: '/motors/moto' },
                ]}
              />
              <CategoryList
                title="PubliHeavyAgro"
                items={[
                  { label: 'Máquinas', href: '/machina' },
                  { label: 'Agroindústria', href: '/machina/agroindustry' },
                ]}
              />
              <CategoryList
                title="PubliTudo"
                items={[
                  { label: 'Marketplace', href: '/tudo' },
                  { label: 'PubliYellow', href: '/tudo/yellow' },
                  { label: 'PubliFera', href: '/tudo/coisas' },
                ]}
              />
            </div>
            <div className="pt-8 border-t border-[#2a2a1a] text-center text-sm text-[#676767]">
              <p>© {new Date().getFullYear()} PubliMicro – Todos os direitos reservados.</p>
              <p className="mt-2">
                <Link href="/termos" className="hover:text-[#FF6B35] transition-colors">
                  Termos de Uso
                </Link>
                {' • '}
                <Link href="/privacidade" className="hover:text-[#FF6B35] transition-colors">
                  Privacidade
                </Link>
                {' • '}
                <Link href="/contato" className="hover:text-[#FF6B35] transition-colors">
                  Contato
                </Link>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

// Helper Components
function CategoryList({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-bold text-[#B7791F] mb-4 text-lg">{title}</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-[#cfcfcf] hover:text-[#FF6B35] transition-colors text-sm"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

