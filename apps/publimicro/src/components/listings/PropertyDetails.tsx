"use client";

import Image from "next/image";
import { useState } from "react";
import Tour3D from "./Tour3D";
import MapSearch from "../search/MapSearch";

interface PropertyDetailsProps {
  item: {
    id: string | number;
    titulo: string;
    descricao?: string;
    preco?: number;
    imagem?: string | null;
    imagens?: string;
    localizacao?: string;
    area?: string;
    quartos?: number;
    banheiros?: number;
    tour_3d_url?: string;
  };
}

export default function PropertyDetails({ item }: PropertyDetailsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<"details" | "tour" | "map">("details");

  // Normalize images: supports comma-separated list or single image
  const rawImages = item.imagens
    ? item.imagens.split(",").map((s) => s.trim()).filter(Boolean)
    : item.imagem
    ? [item.imagem]
    : [];

  const images = rawImages
    .map((p) => ensureAbsolute(p))
    .filter((p): p is string => !!p);

  const mainImage = images[0];

  const whatsappNumber = "5562999999999";
  const whatsappMessage = `Olá! Tenho interesse no imóvel: ${item.titulo}`;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
          {item.titulo}
        </h1>
        {item.localizacao && (
          <p className="text-[#e7d7a8] flex items-center gap-2 text-lg">
            <span className="text-amber-500">📍</span>
            {item.localizacao}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-[#3a2a0f]">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === "details"
              ? "text-amber-400 border-amber-500"
              : "text-[#e7d7a8] border-transparent hover:text-amber-300"
          }`}
        >
          🔎 Detalhes
        </button>
        <button
          onClick={() => setActiveTab("tour")}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === "tour"
              ? "text-amber-500 border-amber-500"
              : "text-[#bfa97a] border-transparent hover:text-[#e6c86b]"
          }`}
        >
          🏠 Tour 3D
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === "map"
              ? "text-amber-500 border-amber-500"
              : "text-[#bfa97a] border-transparent hover:text-[#e6c86b]"
          }`}
        >
          🗺️ Localização
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              {images.length > 0 && isValidUrl(images[0]) ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                  <Image
                    src={images[0]}
                    alt={item.titulo}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🏠</div>
                    <p className="text-[#bfa97a]">Imagem em breve</p>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mb-8">
                {images.slice(1, 5).map((img, idx) => (
                  isValidUrl(img) && (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`${item.titulo} - ${idx + 2}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-[#0b0b0b] border border-[#242424] rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-[#e6c86b] mb-4">Descrição</h2>
              <p className="text-[#bfa97a] leading-relaxed whitespace-pre-line">
                {item.descricao || "Descrição completa em breve."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-gradient-to-br from-amber-500/10 to-[#0b0b0b] border border-amber-500/30 rounded-2xl p-6">
              <div className="text-sm text-[#bfa97a] mb-2">Preço</div>
              <div className="text-4xl font-bold text-[#cfa847] mb-6">
                {item.preco ? `R$ ${item.preco.toLocaleString("pt-BR")}` : "Consulte"}
              </div>

              {/* Quick Contact */}
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-6 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span className="text-2xl">💬</span>
                  Contato via WhatsApp
                </a>

                <a
                  href={`/schedule-visit?propertyId=${item.id}&propertyTitle=${encodeURIComponent(item.titulo)}`}
                  className="block text-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all hover:scale-105"
                >
                  📅 Agendar Visita
                </a>

                <a
                  href={`/proposta?propId=${item.id}`}
                  className="block text-center px-6 py-3 bg-[#0f0f0f] border-2 border-amber-500/30 hover:border-amber-500/60 text-amber-500 font-bold rounded-xl transition-all hover:scale-105"
                >
                  📋 Fazer Proposta
                </a>
              </div>
            </div>

            {/* Features */}
            <div className="bg-[#0b0b0b] border border-[#242424] rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#e6c86b] mb-4">Características</h3>
              <div className="space-y-3">
                {item.area && (
                  <div className="flex items-center justify-between py-2 border-b border-[#242424]">
                    <span className="text-[#bfa97a] flex items-center gap-2">
                      <span>📏</span> Área
                    </span>
                    <span className="text-[#e6c86b] font-semibold">{item.area}</span>
                  </div>
                )}
                {item.quartos && (
                  <div className="flex items-center justify-between py-2 border-b border-[#242424]">
                    <span className="text-[#bfa97a] flex items-center gap-2">
                      <span>🛏️</span> Quartos
                    </span>
                    <span className="text-[#e6c86b] font-semibold">{item.quartos}</span>
                  </div>
                )}
                {item.banheiros && (
                  <div className="flex items-center justify-between py-2 border-b border-[#242424]">
                    <span className="text-[#bfa97a] flex items-center gap-2">
                      <span>🚿</span> Banheiros
                    </span>
                    <span className="text-[#e6c86b] font-semibold">{item.banheiros}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Security Badge */}
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-xs text-green-400 flex items-start gap-2">
                <span className="text-lg">✓</span>
                <span>
                  <strong>Anúncio Verificado</strong><br />
                  Documentação checada pela equipe Publimicro
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "tour" && (
        <Tour3D
          tourUrl={item.tour_3d_url}
          propertyName={item.titulo}
          images={images}
        />
      )}

      {activeTab === "map" && (
        <MapSearch />
      )}
    </div>
  );
}
