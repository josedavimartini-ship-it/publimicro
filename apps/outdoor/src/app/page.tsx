"use client";
import Link from "next/link";
import { Ship } from "lucide-react";

export default function OutdoorPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center px-6">
        <Ship className="w-20 h-20 text-[#B7791F] mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-[#B7791F] mb-4">PubliOutdoor</h1>
        <p className="text-[#d8c68e] text-xl mb-8">Náutica, pesca e aventuras ao ar livre.</p>
        <p className="text-[#676767] mb-8">Em desenvolvimento</p>
        <Link href="/" className="text-[#B7791F] hover:text-[#FF6B35]"> Voltar ao início</Link>
      </div>
    </main>
  );
}
