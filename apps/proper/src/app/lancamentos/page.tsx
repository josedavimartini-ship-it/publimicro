import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LancamentosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#A8C97F] via-[#B7791F] to-[#0D7377] mb-6">
          🏗️ Lançamentos Imobiliários
        </h1>
        <p className="text-2xl text-[#d8c68e] mb-8">Novos Empreendimentos e Pré-Lançamentos</p>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-12">
          <Sparkles className="w-24 h-24 text-[#B7791F] mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-[#B7791F] mb-4">Under Construction</h3>
          <p className="text-[#676767] text-lg">New real estate developments coming soon</p>
        </div>
        <Link href="/proper" className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white font-bold rounded-full hover:scale-105 transition-all">
          ← Back to AcheMePropers
        </Link>
      </div>
    </main>
  );
}
