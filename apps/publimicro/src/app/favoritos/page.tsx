"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FavoritesFolders from "@/components/FavoritesFolders";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function FavoritosPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        window.location.href = "/entrar";
      } else {
        setUserId(data.user.id);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#E6C98B] text-xl">Carregando favoritos...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Breadcrumbs />
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#E6C98B] hover:text-[#A8C97F] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>

        <FavoritesFolders />
      </div>
    </main>
  );
}