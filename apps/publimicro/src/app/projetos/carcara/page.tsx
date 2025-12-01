"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Maximize2, DollarSign, ChevronRight, Star, TreePine, Droplets, Zap } from 'lucide-react';
import { fetchCanonicalSitios, mapIdToDisplayName } from '@/lib/carcaraHelpers';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Sitio {
  id: string;
  slug: string;
  nome: string;
  localizacao: string;
  preco: number;
  area_total: number;
  fotos: string[];
  descricao: string;
  current_bid: number | null;
  agua: boolean;
  energia: boolean;
}

export default function CarcaraProjectPage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSitios() {
      try {
        const data = await fetchCanonicalSitios({ limit: 6 });
        setSitios(data as Sitio[]);
      } catch (error) {
        console.error('Error loading sitios:', error);
      } finally {
        setLoading(false);
      }
    }
    void loadSitios();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-[#A8C97F] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#8B9B6E]">Carregando Sítios Carcará...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/carcara-hero.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <Breadcrumbs />
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] via-[#A8C97F] to-[#6B8F71] mb-6 mt-8">
            Sítios Carcará
          </h1>
          <p className="text-xl text-[#B8A890] max-w-3xl mx-auto mb-8">
            Seis propriedades rurais exclusivas no coração do Brasil. 
            Natureza preservada, infraestrutura completa e qualidade de vida incomparável.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-[#1a1a1a]/80 px-4 py-2 rounded-full">
              <TreePine className="w-5 h-5 text-[#A8C97F]" />
              <span className="text-[#D4C4A8]">100% Natureza</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1a1a1a]/80 px-4 py-2 rounded-full">
              <Droplets className="w-5 h-5 text-[#6B8F71]" />
              <span className="text-[#D4C4A8]">Água Abundante</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1a1a1a]/80 px-4 py-2 rounded-full">
              <Zap className="w-5 h-5 text-[#E6C98B]" />
              <span className="text-[#D4C4A8]">Energia Solar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#E6C98B] mb-8 text-center">
            Conheça Nossos Sítios
          </h2>
          
          {sitios.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#8B9B6E]">Nenhum sítio disponível no momento.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sitios.map((sitio) => (
                <Link
                  key={sitio.id}
                  href={`/imoveis/${sitio.slug || sitio.id}`}
                  className="group bg-[#1a1a1a] border border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#6B7F5C] transition-all duration-300 hover:transform hover:scale-[1.02]"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    {sitio.fotos && sitio.fotos[0] ? (
                      <Image
                        src={sitio.fotos[0]}
                        alt={mapIdToDisplayName(sitio.slug) || sitio.nome}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-[#2a2a1a] flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-[#4a4a3a]" />
                      </div>
                    )}
                    {sitio.current_bid && (
                      <div className="absolute top-4 right-4 bg-[#A8C97F] text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Lance Ativo
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#E6C98B] mb-2 group-hover:text-[#A8C97F] transition-colors">
                      {mapIdToDisplayName(sitio.slug) || sitio.nome}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-[#8B9B6E] text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      {sitio.localizacao || 'Goiás, Brasil'}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Maximize2 className="w-4 h-4 text-[#6B8F71]" />
                        <span className="text-[#D4C4A8]">{sitio.area_total} ha</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#E6C98B]" />
                        <span className="text-[#E6C98B] font-bold">
                          {sitio.preco ? `R$ ${sitio.preco.toLocaleString('pt-BR')}` : 'Consulte'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#2a2a1a]">
                      <span className="text-[#8B9B6E] text-sm">Ver detalhes</span>
                      <ChevronRight className="w-5 h-5 text-[#6B7F5C] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#E6C98B] mb-4">
            Interessado em um Sítio Carcará?
          </h2>
          <p className="text-[#B8A890] mb-8">
            Agende uma visita ou faça uma proposta. Nossa equipe está pronta para ajudá-lo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contato"
              className="px-8 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] text-[#D4C4A8] font-bold rounded-full hover:from-[#7A8F6B] hover:to-[#3A6F7F] transition-all"
            >
              Fale Conosco
            </Link>
            <Link
              href="/proper/rural"
              className="px-8 py-3 border-2 border-[#6B7F5C] text-[#6B7F5C] font-bold rounded-full hover:bg-[#6B7F5C]/10 transition-all"
            >
              Ver Todos os Sítios
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}





















