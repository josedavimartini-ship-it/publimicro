"use client";

import Link from "next/link";
import WorldRegionsSidebar from "@/components/WorldRegionsSidebar";

export default function Page() {
  return (
    <>
      {/* Global Location Search Sidebar */}
      <WorldRegionsSidebar />
      
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6 lg:mr-[420px]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={"text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0D7377] to-[#14FFEC] mb-6".replace("#0D7377","#0D7377").replace("#14FFEC","#14FFEC")}>
            🌍 AcheMeGlobal
          </h1>
          <p className="text-2xl text-[#d8c68e] mb-8">Comércio Internacional - Encontre Propriedades Mundialmente</p>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-12">
            <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">🌎 Busca Global por Regiões</h3>
            <p className="text-[#8B9B6E] text-lg mb-4">Use a barra lateral à direita para navegar por países, estados e cidades.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 bg-[#0a0a0a] border border-[#2a2a1a] rounded-xl">
                <h4 className="text-xl font-bold text-[#CD7F32] mb-3">🇧🇷 Brasil</h4>
                <p className="text-[#8B9B6E]">Explore todas as regiões do Brasil com busca por estado e cidade</p>
              </div>
              <div className="p-6 bg-[#0a0a0a] border border-[#2a2a1a] rounded-xl">
                <h4 className="text-xl font-bold text-[#CD7F32] mb-3">🌍 Internacional</h4>
                <p className="text-[#8B9B6E]">Em breve: Propriedades na América, Europa, Ásia e mais</p>
              </div>
            </div>
          </div>
          <Link href="/" className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-[#CD7F32] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#CD7F32] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-all shadow-lg">
            Voltar ao Início
          </Link>
        </div>
      </main>
    </>
  );
}
