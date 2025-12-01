"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, List, Plus } from 'lucide-react';
import Link from 'next/link';

export default function PublicadoPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/acheme-coisas');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex p-4 bg-green-500/20 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-[#E6C98B] mb-4">
            Anúncio Publicado!
          </h1>
          <p className="text-[#B8A890]">
            Seu anúncio foi publicado com sucesso e já está visível para outros usuários.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/acheme-coisas"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] text-[#D4C4A8] font-bold rounded-lg hover:from-[#7A8F6B] hover:to-[#3A6F7F] transition-all"
          >
            <List className="w-5 h-5" />
            Ver Todos os Anúncios
          </Link>

          <Link
            href="/acheme-coisas/postar"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-[#6B7F5C] text-[#6B7F5C] font-bold rounded-lg hover:bg-[#6B7F5C]/10 transition-all"
          >
            <Plus className="w-5 h-5" />
            Criar Novo Anúncio
          </Link>

          <Link
            href="/conta"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 text-[#8B9B6E] hover:text-[#A8C97F] transition-all"
          >
            Ir para Minha Conta
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="mt-8 text-[#676767] text-sm">
          Você será redirecionado automaticamente em 5 segundos...
        </p>
      </div>
    </main>
  );
}





















