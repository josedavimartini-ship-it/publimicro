import Link from "next/link";
import { Tent, Mountain, Compass } from "lucide-react";

export default function OutdoorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6 ml-64">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5F7161] via-[#6C8C5E] to-[#5F7161] mb-6">
           PubliOutdoor
        </h1>
        <p className="text-2xl text-[#d8c68e] mb-8">Aventura, Camping & Natureza</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
            <Tent className="w-16 h-16 text-[#5F7161] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#B7791F] mb-2">Equipamentos</h3>
            <p className="text-[#676767]">Camping e trilhas</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
            <Mountain className="w-16 h-16 text-[#5F7161] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#B7791F] mb-2">Aventura</h3>
            <p className="text-[#676767]">Escalada e montanhismo</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
            <Compass className="w-16 h-16 text-[#5F7161] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#B7791F] mb-2">Expedições</h3>
            <p className="text-[#676767]">Guias e roteiros</p>
          </div>
        </div>
        <p className="text-[#676767] mt-12 text-lg">Em breve: marketplace de equipamentos outdoor</p>
        <Link href="/" className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-[#5F7161] to-[#6C8C5E] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-all">
           Voltar ao Início
        </Link>
      </div>
    </main>
  );
}
