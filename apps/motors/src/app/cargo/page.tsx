import Link from "next/link";
import { Truck } from "lucide-react";

export default function CargoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FF8C42] to-[#FF6B35] mb-6">
           PubliCargo
        </h1>
        <p className="text-2xl text-[#d8c68e] mb-8">Caminhões, Vans e Veículos Comerciais</p>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-12">
          <Truck className="w-24 h-24 text-[#FF6B35] mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-[#B7791F] mb-4">Em Construção</h3>
          <p className="text-[#676767] text-lg">Marketplace de veículos comerciais em breve</p>
        </div>
        <Link href="/motors" className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-all">
           Voltar para PubliMotors
        </Link>
      </div>
    </main>
  );
}
