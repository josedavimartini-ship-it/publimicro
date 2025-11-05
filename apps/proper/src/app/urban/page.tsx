"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";

export default function UrbanPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <Building2 className="w-16 h-16 text-[#B7791F] mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-[#B7791F] mb-4">Imóveis Urbanos</h1>
        <p className="text-[#d8c68e] text-xl mb-8 max-w-2xl mx-auto">
          Apartamentos, casas, salas comerciais e loteamentos urbanos.
        </p>
        
        <div className="py-16 bg-[#1a1a1a] rounded-2xl border-2 border-[#2a2a1a]">
          <Building2 className="w-12 h-12 text-[#676767] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[#676767] mb-2">Coming Soon</h3>
          <p className="text-[#676767] mb-6">We're preparing exclusive urban opportunities.</p>
          <Link href="/proper" className="text-[#B7791F] hover:text-[#A8C97F] transition-colors">
            ← Back to AcheMePropers
          </Link>
        </div>
      </div>
    </main>
  );
}
