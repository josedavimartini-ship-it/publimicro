import Link from "next/link";
import { Building2 } from "lucide-react";

export default function ProperComercialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] to-[#CD7F32] mb-6">
          Imóveis Comerciais
        </h1>
        <p className="text-xl text-[#d8c68e] mb-8">Salas, galpões e pontos comerciais</p>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-12">
          <div className="w-20 h-20 bg-gradient-to-r from-[#B7791F] to-[#CD7F32] rounded-full mx-auto mb-6 flex items-center justify-center text-[#0a0a0a]">
            <Building2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-[#B7791F] mb-4">Em breve!</h2>
          <p className="text-[#676767] mb-8">Estamos preparando a seção de imóveis comerciais.</p>
          <Link href="/proper" className="inline-block px-8 py-3 border-2 border-[#B7791F] text-[#B7791F] hover:bg-[#B7791F]/10 font-bold rounded-full transition-all">
            Voltar para PubliProper
          </Link>
        </div>
      </div>
    </div>
  );
}
