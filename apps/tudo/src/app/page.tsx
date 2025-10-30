"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function TudoPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center px-6">
        <ShoppingBag className="w-20 h-20 text-[#B7791F] mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-[#B7791F] mb-4">PubliTudo</h1>
        <p className="text-[#d8c68e] text-xl mb-8">Marketplace geral e serviços.</p>
        <p className="text-[#676767] mb-8">Em desenvolvimento</p>
        <Link href="/" className="text-[#B7791F] hover:text-[#FF6B35]"> Voltar ao início</Link>
      </div>
    </main>
  );
}
