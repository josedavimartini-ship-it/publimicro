'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { MapPin, Maximize2, DollarSign } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  total_area: number;
  fotos: string[];
}

export default function ProperRuralPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .in('id', ['surucua', 'juriti', 'seriema', 'mergulhao', 'bigua', 'abare'])
        .order('price', { ascending: true });

      if (!error && data) {
        setProperties(data);
      }
      setLoading(false);
    }
    fetchProperties();
  }, []);
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5F7161] to-[#0D7377] mb-6">
            Proper Rural
          </h1>
          <p className="text-xl text-[#d8c68e] mb-4">
            Sítios, fazendas e chácaras
          </p>
        </div>

        {/* Featured: Sítios Carcará */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-4 border-[#B7791F] rounded-2xl p-12 mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 bg-[#E6C98B]/30 border-2 border-[#B7791F] rounded-full">
            <span className="text-[#B7791F] font-bold uppercase tracking-wider">
              🦅 Destaque Especial
            </span>
          </div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] to-[#0D7377] mb-4">
            Sítios Carcará's Project
          </h2>
          <p className="text-[#d8c68e] text-lg mb-6">
            6 propriedades exclusivas às margens da represa. Lances a partir de R$ 1.050.000
          </p>
          <Link
            href="/projetos/carcara"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] hover:from-[#0D7377] hover:to-[#A8C97F] text-white font-bold rounded-full transition-all hover:scale-105"
          >
            🏡 Explorar Projeto Completo
          </Link>
        </div>

        {/* Sítios Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#A8C97F] border-t-transparent"></div>
          </div>
        ) : properties.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#E6C98B] mb-8 text-center">
              Propriedades Disponíveis - Sítios Carcará
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/imoveis/${property.id}`}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#A8C97F] transition-all hover:scale-105 shadow-lg hover:shadow-2xl group"
                >
                  {/* Image */}
                  <div className="relative w-full h-64 bg-[#2a2a1a] overflow-hidden">
                    {property.fotos && property.fotos[0] ? (
                      <Image
                        src={property.fotos[0]}
                        alt={`Sítio ${property.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-16 h-16 text-[#676767]" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#A8C97F] mb-3 group-hover:text-[#E6C98B] transition-colors">
                      Sítio {property.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-[#8B9B6E]">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{property.location}</span>
                      </div>

                      {property.total_area && (
                        <div className="flex items-center gap-2 text-[#8B9B6E]">
                          <Maximize2 className="w-4 h-4" />
                          <span className="text-sm">{property.total_area} hectares</span>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="p-4 bg-[#2a2a2a]/50 rounded-xl">
                      <div className="text-xs text-[#676767] mb-1">A partir de</div>
                      <div className="font-bold text-[#E6C98B] text-xl">
                        R$ {(property.price / 1000000).toFixed(2).replace('.', ',')}M
                      </div>
                      <div className="text-xs text-[#A8C97F] mt-2">
                        ⭐ Excelente oportunidade
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-12 text-center">
          <div className="text-6xl mb-6">🌾</div>
          <h2 className="text-2xl font-bold text-[#B7791F] mb-4">Mais imóveis rurais em breve!</h2>
          <p className="text-[#676767] mb-8">
            Estamos catalogando as melhores propriedades rurais para você.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/proper"
              className="px-8 py-3 border-2 border-[#5F7161] text-[#5F7161] hover:bg-[#5F7161]/10 font-bold rounded-full transition-all"
            >
              ← Voltar
            </Link>
            <Link
              href="/anunciar"
              className="px-8 py-3 bg-gradient-to-r from-[#5F7161] to-[#0D7377] hover:from-[#0D7377] hover:to-[#5F7161] text-white font-bold rounded-full transition-all hover:scale-105"
            >
              Anunciar Grátis
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}