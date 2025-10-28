"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Carcara3D = dynamic(
  () => import("@publimicro/ui").then((mod) => mod.Carcara3D),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#8a8a6a]">Carregando carcará...</p>
        </div>
      </div>
    ),
  }
);

export function CarcaraScene() {
  return (
    <div 
      className="w-full max-w-2xl mx-auto h-56 relative rounded-xl overflow-hidden bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]"
      role="region"
      aria-label="Visualização 3D do Carcará"
    >
      <Suspense 
        fallback={
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#8a8a6a]">Preparando visualização...</p>
            </div>
          </div>
        }
      >
        <Carcara3D scale={1} />
      </Suspense>

      <div 
        className="absolute bottom-3 right-3 text-xs text-[#6a6a6a] pointer-events-none animate-pulse"
        aria-hidden="true"
      >
        Arraste para rotacionar
      </div>
    </div>
  );
}