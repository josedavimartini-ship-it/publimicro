'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Home, Trees, Droplets, Zap, ShieldCheck, Calendar, TrendingUp } from 'lucide-react';
import VisitModal from '@/components/VisitModal';
import ProposalModal from '@/components/ProposalModal';

interface Sitio {
  id: string;
  nome: string;
  zona: string;
  preco: number;
  lance_inicial: number;
  fotos: string[];
  descricao?: string;
  area_total?: number;
}

export default function CarcaraProjectPage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [selectedSitio, setSelectedSitio] = useState<Sitio | null>(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSitios() {
      const { data, error } = await supabase
        .from('sitios')
        .select('*')
        .in('id', ['surucua', 'juriti', 'seriema', 'mergulhao', 'bigua', 'abare'])
        .order('preco', { ascending: true });

      if (!error && data) {
        setSitios(data);
      }
      setLoading(false);
    }
    fetchSitios();
  }, []);

  const features = [
    { icon: <Trees className="w-8 h-8" />, title: 'Natureza Preservada', desc: 'Mata nativa e biodiversidade' },
    { icon: <Droplets className="w-8 h-8" />, title: 'Acesso à Água', desc: 'Margem da represa' },
    { icon: <Zap className="w-8 h-8" />, title: 'Infraestrutura', desc: 'Energia e estrada' },
    { icon: <ShieldCheck className="w-8 h-8" />, title: 'Documentação', desc: 'Regularizado' },
  ];

  const handleScheduleVisit = (sitio: Sitio) => {
    setSelectedSitio(sitio);
    setShowVisitModal(true);
  };

  const handleMakeProposal = (sitio: Sitio) => {
    setSelectedSitio(sitio);
    setShowProposalModal(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] pb-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg"
          alt="Sítios Carcará"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#0a0a0a]" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-[#FF6B35]/30 border-2 border-[#FF6B35] rounded-full backdrop-blur-md">
            <span className="text-[#FF6B35] font-bold text-lg tracking-widest uppercase">
              🦅 Lançamento Exclusivo
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FF8C42] to-[#B7791F] mb-6 leading-tight">
            Sítios Carcará
          </h1>
          
          <p className="text-2xl md:text-3xl text-[#d8c68e] mb-4 leading-relaxed">
            6 propriedades exclusivas às margens da represa
          </p>
          
          <p className="text-lg text-[#676767] mb-8 max-w-3xl mx-auto">
            Natureza preservada, infraestrutura completa e localização privilegiada. 
            Lances a partir de <span className="text-[#FF6B35] font-bold">R$ 1.050.000</span>
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#sitios"
              className="px-10 py-5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] text-lg font-bold rounded-full transition-all hover:scale-105 shadow-2xl"
            >
              🏡 Ver Propriedades
            </a>
            <a
              href="#sobre"
              className="px-10 py-5 border-3 border-[#0D7377] text-[#0D7377] hover:bg-[#0D7377]/10 text-lg font-bold rounded-full transition-all"
            >
              📋 Sobre o Projeto
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-7xl mx-auto" id="sobre">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] to-[#CD7F32] mb-12">
          Diferenciais do Projeto
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6 hover:border-[#FF6B35] transition-all hover:scale-105"
            >
              <div className="w-16 h-16 bg-[#FF6B35]/20 rounded-full flex items-center justify-center text-[#FF6B35] mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#B7791F] mb-2">{feature.title}</h3>
              <p className="text-[#676767]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sitios Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto" id="sitios">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#B7791F] mb-4">
          Propriedades Disponíveis
        </h2>
        <p className="text-center text-[#676767] mb-12 max-w-2xl mx-auto">
          Escolha sua propriedade ideal. Agende uma visita e faça sua proposta.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#FF6B35] border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sitios.map((sitio) => (
              <article
                key={sitio.id}
                className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-3 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#FF6B35] hover:shadow-2xl hover:shadow-[#FF6B35]/30 transition-all"
              >
                <div className="relative aspect-video">
                  <Image
                    src={sitio.fotos[0]}
                    alt={`Sítio ${sitio.nome}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-4 py-2 bg-[#2a2a2a]/95 backdrop-blur-md rounded-full border border-[#3a3a2a]">
                    <span className="text-[#5F7161] text-sm font-bold">{sitio.zona}</span>
                  </div>
                  <div className="absolute top-3 right-3 px-4 py-2 bg-[#0D7377] text-[#0a0a0a] text-sm font-bold rounded-full shadow-lg">
                    Disponível
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-3xl font-bold text-[#FF6B35] mb-3">{sitio.nome}</h3>
                  
                  {sitio.descricao && (
                    <p className="text-[#676767] text-sm mb-4">{sitio.descricao}</p>
                  )}

                  {sitio.area_total && (
                    <div className="flex items-center gap-2 text-[#B7791F] mb-4">
                      <Home className="w-4 h-4" />
                      <span className="text-sm">{sitio.area_total} hectares</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-[#2a2a2a]/50 rounded-lg">
                    <div>
                      <div className="text-xs text-[#676767] mb-1">Valor estimado</div>
                      <div className="font-semibold text-[#D4A574] text-lg">
                        R$ {(sitio.preco / 1000000).toFixed(1).replace('.', ',')}M
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#676767] mb-1">Lance inicial</div>
                      <div className="font-bold text-[#FF6B35] text-lg">
                        R$ {(sitio.lance_inicial / 1000000).toFixed(2).replace('.', ',')}M
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleScheduleVisit(sitio)}
                      className="flex-1 px-4 py-3 border-2 border-[#0D7377] text-[#0D7377] hover:bg-[#0D7377]/10 font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Visitar
                    </button>
                    <button
                      onClick={() => handleMakeProposal(sitio)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] font-bold rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Proposta
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Location & Contact */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[#B7791F] mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Localização
            </h3>
            <p className="text-[#676767] mb-4">
              Zona Rural privilegiada, às margens da represa, com acesso asfaltado e próximo aos principais centros urbanos.
            </p>
            <ul className="space-y-2 text-sm text-[#676767]">
              <li>• 45 min do centro da cidade</li>
              <li>• Acesso por estrada pavimentada</li>
              <li>• Vista panorâmica da represa</li>
              <li>• Área de preservação ambiental</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[#B7791F] mb-4">
              Dúvidas? Fale Conosco
            </h3>
            <p className="text-[#676767] mb-6">
              Nossa equipe está pronta para te atender e esclarecer todas as suas dúvidas sobre o projeto.
            </p>
            <div className="space-y-3">
              <a
                href="https://wa.me/5534992610004"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-lg transition-all hover:scale-105 text-center"
              >
                📱 WhatsApp: (34) 99261-0004
              </a>
              <a
                href="mailto:contato@publimicro.com.br"
                className="block px-6 py-4 border-2 border-[#B7791F] text-[#B7791F] hover:bg-[#B7791F]/10 font-bold rounded-lg transition-all text-center"
              >
                ✉️ contato@publimicro.com.br
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedSitio && (
        <>
          <VisitModal
            adId={selectedSitio.id}
            adTitle={`Sítio ${selectedSitio.nome}`}
            open={showVisitModal}
            onClose={() => setShowVisitModal(false)}
          />
          <ProposalModal
            adId={selectedSitio.id}
            adTitle={`Sítio ${selectedSitio.nome}`}
            currentBid={selectedSitio.preco}
            minBid={selectedSitio.lance_inicial}
            open={showProposalModal}
            onClose={() => setShowProposalModal(false)}
          />
        </>
      )}
    </main>
  );
}
