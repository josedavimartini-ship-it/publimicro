"use client";

import Link from "next/link";
import { Trees, MapPin, Droplets, Home } from "lucide-react";

export default function RuralPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20">
      <div className="flex justify-end items-center max-w-7xl mx-auto px-6 mb-4">
        <a
          href="/anunciar"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A8C97F] to-[#B7791F] text-black font-bold rounded-full shadow-lg hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-[#A8C97F]"
          aria-label="Anunciar propriedade"
          tabIndex={0}
          role="button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
          Anunciar
        </a>
      </div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <Trees className="w-16 h-16 text-[#0D7377] mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-[#B7791F] mb-4">Imóveis Rurais</h1>
          <p className="text-[#d8c68e] text-xl max-w-2xl mx-auto">
            Sítios, fazendas, chácaras e propriedades rurais para investimento, moradia ou lazer.
          </p>
        </div>

        {/* Featured: Sítios Carcará */}
        <div className="bg-gradient-to-r from-[#A8C97F]/20 to-[#0D7377]/20 border-2 border-[#B7791F] rounded-3xl p-8 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-1">
              <div className="inline-block px-4 py-2 bg-[#E6C98B] text-black font-bold rounded-full text-sm mb-4">DESTAQUE</div>
              <h2 className="text-4xl font-bold text-[#B7791F] mb-3">Sítios Carcará</h2>
              <p className="text-[#d8c68e] mb-4">6 propriedades exclusivas em Corumbaíba, GO - Às margens da represa. Perfeito para descanso, agricultura sustentável e investimento.</p>
              <div className="flex flex-wrap gap-4 text-sm text-[#676767] mb-6">
                <div className="flex items-center gap-2" tabIndex={0} role="listitem" aria-label="Localização: Corumbaíba, GO">
                  <MapPin className="w-4 h-4" />
                  Corumbaíba, GO
                </div>
                <div className="flex items-center gap-2" tabIndex={0} role="listitem" aria-label="Acesso à represa">
                  <Droplets className="w-4 h-4" />
                  Acesso à represa
                </div>
                <div className="flex items-center gap-2" tabIndex={0} role="listitem" aria-label="6 unidades disponíveis">
                  <Home className="w-4 h-4" />
                  6 unidades disponíveis
                </div>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/projetos/carcara"
                  className="px-8 py-3 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white font-bold rounded-full hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-[#A8C97F]"
                  aria-label="Ver detalhes dos Sítios Carcará"
                  tabIndex={0}
                  role="button"
                >
                  Ver Detalhes
                </Link>
                <a
                  href="https://wa.me/5534992610004?text=Olá! Gostaria de agendar uma visita aos Sítios Carcará"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 border-2 border-[#25D366] text-[#25D366] font-bold rounded-full hover:bg-[#25D366]/10 transition-all"
                >
                   Agendar Visita
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* More properties coming soon */}
        <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl border-2 border-[#2a2a1a]">
          <Trees className="w-12 h-12 text-[#676767] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[#676767] mb-2">Mais propriedades em breve</h3>
          <p className="text-[#676767] mb-6">Estamos preparando novos sítios e fazendas para você.</p>
          <Link href="/proper" className="text-[#B7791F] hover:text-[#A8C97F] transition-colors">
            ← Voltar para PubliProper
          </Link>
        </div>
      </div>
    </main>
  );
}
