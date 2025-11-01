"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { MessageCircle, Send, User, ArrowLeft } from "lucide-react";

export default function ChatPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        window.location.href = "/entrar";
      } else {
        setUserId(data.user.id);
        // TODO: Load user chats from database
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#D4A574] hover:text-[#FF6B35] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <MessageCircle className="w-10 h-10 text-[#FF6B35]" strokeWidth={2.5} />
            <h1 className="text-4xl font-bold text-[#D4A574]">Chat</h1>
          </div>

          {chats.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle className="w-24 h-24 text-[#8B9B6E]/30 mx-auto mb-6" />
              <p className="text-2xl text-[#8B9B6E] mb-4">
                Você não tem conversas ativas no momento.
              </p>
              <p className="text-[#8B9B6E]/70 mb-8">
                Suas conversas com vendedores e compradores aparecerão aqui.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold rounded-full hover:from-[#FF8C42] hover:to-[#FF6B35] transition-all"
              >
                Explorar Propriedades
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Chat list will go here */}
              <p className="text-[#8B9B6E]">Sistema de chat em desenvolvimento...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}