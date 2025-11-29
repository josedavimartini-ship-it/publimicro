"use client";

import Image from "next/image";
import { useState } from "react";
import Tour3D from "./Tour3D";
import MapSearch from "../search/MapSearch";
import { WhatsAppLink } from "@publimicro/ui";

// Get from env - this will be replaced at build time
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://irrzpwzyqcubhhjeuakc.supabase.co";

function isValidUrl(url?: string | null): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function ensureAbsolute(path?: string | null): string | null {
  if (!path) return null;
  const s = path.trim();
  if (!s) return null;
  if (isValidUrl(s)) return s;
  if (!SUPABASE_URL) return null;

  // Remove leading slash to avoid double //
  const clean = s.replace(/^\/+/, "");

  // If path already starts with storage prefix, just add base
  if (clean.startsWith("storage/v1/object/public/")) {
    return `${SUPABASE_URL}/${clean}`;
  }
  if (clean.startsWith("storage/")) {
    return `${SUPABASE_URL}/${clean}`;
  }
  
  // Otherwise, assume it's a file inside a public bucket
  return `${SUPABASE_URL}/storage/v1/object/public/${clean}`;
}

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
            <span className="text-amber-500"></span>
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
           Detalhes
        </button>
        <button
          onClick={() => setActiveTab("tour")}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === "tour"
              ? "text-amber-400 border-amber-500"
              : "text-[#e7d7a8] border-transparent hover:text-amber-300"
          }`}
        >
           Tour 3D
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === "map"
              ? "text-amber-400 border-amber-500"
              : "text-[#e7d7a8] border-transparent hover:text-amber-300"
          }`}
        >
           Localização
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              {mainImage ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden ring-1 ring-amber-500/20">
                  <Image
                    src={mainImage}
                    alt={item.titulo}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl flex items-center justify-center ring-1 ring-amber-500/20">
                  <div className="text-center">
                    <div className="text-6xl mb-2"></div>
                    <p className="text-amber-300">Imagem em breve</p>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mb-8">
                {images.slice(1, 5).map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden ring-1 ring-amber-500/20">
                    <Image
                      src={img}
                      alt={`${item.titulo} - ${idx + 2}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-[#0b0b0b] border border-amber-900/40 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-amber-300 mb-4">Descrição</h2>
              <p className="text-[#e7d7a8] leading-relaxed whitespace-pre-line">
                {item.descricao || "Descrição completa em breve."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-gradient-to-br from-amber-500/10 to-[#0b0b0b] border border-amber-600/50 rounded-2xl p-6">
              <div className="text-sm text-[#e7d7a8] mb-2">Preço</div>
              <div className="text-4xl font-extrabold text-amber-400 mb-6 tracking-tight">
                {item.preco ? `R$ ${item.preco.toLocaleString("pt-BR")}` : "Consulte"}
              </div>

              {/* Quick Contact */}
              <div className="space-y-3">
                <WhatsAppLink
                  number={whatsappNumber}
                  message={whatsappMessage}
                  className="block text-center px-6 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                  aria-label="Contato via WhatsApp"
                >
                  <span className="text-2xl"></span>
                  Contato via WhatsApp
                </WhatsAppLink>

                <a
                  href={`/schedule-visit?propertyId=${item.id}&propertyTitle=${encodeURIComponent(item.titulo)}`}
                  className="block text-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold rounded-xl transition-all hover:scale-105"
                >
                   Agendar Visita
                </a>

                <a
                  href={`/proposta?propId=${item.id}`}
                  className="block text-center px-6 py-3 bg-[#0f0f0f] border-2 border-amber-600/60 hover:border-amber-400 text-amber-300 hover:text-amber-200 font-bold rounded-xl transition-all hover:scale-105"
                >
                   Fazer Proposta
                </a>
              </div>
            </div>

            {/* Features */}
            <div className="bg-[#0b0b0b] border border-amber-900/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">Características</h3>
              <div className="space-y-3">
                {item.area && (
                  <div className="flex items-center justify-between py-2 border-b border-[#2a220f]">
                    <span className="text-[#e7d7a8] flex items-center gap-2">
                      <span className="text-amber-400"></span> Área
                    </span>
                    <span className="text-amber-200 font-semibold">{item.area}</span>
                  </div>
                )}
                {item.quartos && (
                  <div className="flex items-center justify-between py-2 border-b border-[#2a220f]">
                    <span className="text-[#e7d7a8] flex items-center gap-2">
                      <span className="text-amber-400"></span> Quartos
                    </span>
                    <span className="text-amber-200 font-semibold">{item.quartos}</span>
                  </div>
                )}
                {item.banheiros && (
                  <div className="flex items-center justify-between py-2 border-b border-[#2a220f]">
                    <span className="text-[#e7d7a8] flex items-center gap-2">
                      <span className="text-amber-400"></span> Banheiros
                    </span>
                    <span className="text-amber-200 font-semibold">{item.banheiros}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Security Badge */}
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-xs text-green-400 flex items-start gap-2">
                <span className="text-lg"></span>
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

      {activeTab === "map" && <MapSearch />}
    </div>
  );
}
