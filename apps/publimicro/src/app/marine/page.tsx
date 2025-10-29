import Link from "next/link";
import { Anchor, Ship, Fish } from "lucide-react";

export default function MarinePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6 ml-64">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0D7377] via-[#14FFEC] to-[#0D7377] mb-6">
           PubliMarine
        </h1>
        <p className="text-2xl text-[#d8c68e] mb-8">Náutica, Pesca & Aventura</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
            <Ship className="w-16 h-16 text-[#0D7377] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#B7791F] mb-2">Embarcações</h3>
            <p className="text-[#676767]">Lanchas, veleiros e iates</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
            <Fish className="w-16 h-16 text-[#0D7377] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#B7791F] mb-2">Equipamentos</h3>
            <p className="text-[#676767]">Pesca esportiva e mergulho</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
            <Anchor className="w-16 h-16 text-[#0D7377] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#B7791F] mb-2">Serviços</h3>
            <p className="text-[#676767]">Marinas e manutenção</p>
          </div>
        </div>
        <p className="text-[#676767] mt-12 text-lg">Em breve: anúncios de embarcações e equipamentos náuticos</p>
        <Link href="/" className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-[#0D7377] to-[#14FFEC] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-all">
           Voltar ao Início
        </Link>
      </div>
    </main>
  );
}
