"use client";

import { useState } from "react";

interface Tour3DProps {
  tourUrl?: string;
  propertyName: string;
  images?: string[];
}

export default function Tour3D({ 
  tourUrl, 
  propertyName,
  images = [] 
}: Tour3DProps): JSX.Element {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // If no 3D tour URL, show image gallery as fallback
  if (!tourUrl) {
    return (
      <div className="bg-[#0b0b0b] border border-[#242424] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏠</div>
            <div>
              <h3 className="text-xl font-bold text-[#e6c86b]">Tour Virtual</h3>
              <p className="text-sm text-[#bfa97a]">{propertyName}</p>
            </div>
          </div>
        </div>

        {/* Image Gallery Placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl overflow-hidden mb-4">
          {images.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={images[currentImageIndex]}
                alt={`${propertyName} - foto ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
                  >
                    →
                  </button>
                </>
              )}
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 rounded-full text-white text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl mb-4">🏗️</div>
              <p className="text-[#bfa97a] mb-2 font-semibold">Tour 3D em Produção</p>
              <p className="text-sm text-[#bfa97a]/70 max-w-md">
                Estamos preparando um tour virtual completo desta propriedade. 
                Em breve você poderá explorar cada ambiente em 360°.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400">
                  📸 Fotos 360°
                </span>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400">
                  🎥 Vídeo tour
                </span>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400">
                  🗺️ Mapa interativo
                </span>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400">
                  📐 Planta baixa
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === idx
                    ? "border-amber-500"
                    : "border-[#242424] hover:border-amber-500/30"
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* CTA to schedule visit for 3D tour */}
        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-sm text-amber-400 mb-3 flex items-start gap-2">
            <span className="text-lg">✨</span>
            <span>
              Quer conhecer esta propriedade virtualmente? 
              Agende uma videoconferência e faremos um tour ao vivo!
            </span>
          </p>
          <a
            href="/schedule-visit"
            className="block text-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-all"
          >
            📅 Agendar Tour Virtual ao Vivo
          </a>
        </div>
      </div>
    );
  }

  // If 3D tour URL exists, show iframe
  return (
    <div className={`bg-[#0b0b0b] border border-[#242424] rounded-2xl overflow-hidden ${
      isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
    }`}>
      <div className="p-6 border-b border-[#242424] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🏠</div>
          <div>
            <h3 className="text-xl font-bold text-[#e6c86b]">Tour 3D Interativo</h3>
            <p className="text-sm text-[#bfa97a]">{propertyName}</p>
          </div>
        </div>
        <button
          onClick={toggleFullscreen}
          className="px-4 py-2 bg-[#0f0f0f] border border-[#242424] hover:border-amber-500/30 text-[#bfa97a] hover:text-amber-500 rounded-lg transition-all"
        >
          {isFullscreen ? "🗙 Fechar" : "⛶ Tela Cheia"}
        </button>
      </div>

      <div className={isFullscreen ? "h-[calc(100vh-80px)]" : "aspect-video"}>
        <iframe
          src={tourUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`Tour 3D - ${propertyName}`}
        />
      </div>

      {!isFullscreen && (
        <div className="p-4 border-t border-[#242424] bg-[#0f0f0f]">
          <div className="flex items-center gap-4 text-xs text-[#bfa97a]">
            <span className="flex items-center gap-1">
              🖱️ Clique e arraste para rotacionar
            </span>
            <span className="flex items-center gap-1">
              🔍 Use scroll para zoom
            </span>
            <span className="flex items-center gap-1">
              📱 Compatível com mobile
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
