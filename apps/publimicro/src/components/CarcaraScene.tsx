"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Carcara3D = dynamic(
  () => import("@publimicro/ui").then((mod) => mod.Carcara3D),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 animate-pulse flex items-center justify-center text-[#bfa97a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#cfa847] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Carregando modelo 3D...</p>
        </div>
      </div>
    ),
  }
);

const BirdAudioToggle = dynamic(
  () => import("./BirdAudioToggle"), 
  { 
    ssr: false,
    loading: () => (
      <div className="rounded-full bg-[#111] px-3 py-2 animate-pulse">
        <span className="text-sm text-[#bfa97a]">...</span>
      </div>
    ),
  }
);

export function CarcaraScene() {
  const handleSoundTrigger = () => {
    try {
      const audioController = window.__publimicroCarcaraAudio;
      if (audioController?.play) {
        audioController.play();
      }
    } catch (error) {
      console.warn("Audio controller not available:", error);
    }
  };

  return (
    <div 
      className="w-full max-w-4xl h-[420px] relative rounded-xl overflow-hidden bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] shadow-2xl"
      role="region"
      aria-label="Visualização 3D do Carcará"
    >
      <Suspense 
        fallback={
          <div className="h-full flex items-center justify-center text-[#bfa97a]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#cfa847] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Preparando visualização...</p>
            </div>
          </div>
        }
      >
        <Carcara3D
          onSoundTrigger={handleSoundTrigger}
          scale={1.5}
        />
      </Suspense>

      <div 
        className="absolute left-4 top-4 flex items-center gap-3 z-10"
        role="toolbar"
        aria-label="Controles de áudio e ações"
      >
        <BirdAudioToggle />
        
        <a
          href="/post"
          className="rounded-full bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg"
          aria-label="Criar novo anúncio"
        >
          POSTAR ANÚNCIO
        </a>
      </div>

      <div 
        className="absolute bottom-4 right-4 text-xs text-[#bfa97a]/70 pointer-events-none animate-pulse"
        aria-hidden="true"
      >
        Arraste para rotacionar
      </div>
    </div>
  );
}