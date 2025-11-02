"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Heart, MessageCircle } from 'lucide-react';

export default function UserQuickPanel() {
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        supabase
          .from('favorites')
          .select('*')
          .eq('user_id', data.user.id)
          .then(({ data }) => setFavorites(data || []));
        supabase
          .from('proposals')
          .select('*')
          .eq('user_id', data.user.id)
          .then(({ data }) => setProposals(data || []));
      }
    });
  }, []);

  if (!user) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-[#1a1a1a]/95 border border-[#2a2a1a] rounded-2xl shadow-2xl p-4 w-80">
      <div className="mb-3 text-lg font-bold text-amber-400">Olá, {user.email}</div>
      <div className="mb-4 flex gap-4">
        <Link href="/favoritos" className="flex items-center gap-2 text-[#B7791F] hover:underline">
          <Heart className="w-5 h-5" /> Favoritos ({favorites.length})
        </Link>
        <Link href="/propostas" className="flex items-center gap-2 text-[#0D7377] hover:underline">
          <MessageCircle className="w-5 h-5" /> Propostas ({proposals.length})
        </Link>
      </div>
      <div>
        <div className="font-semibold text-[#e6c86b] mb-2">Histórico de Propostas</div>
        <ul className="max-h-32 overflow-y-auto text-sm text-[#bfa97a]">
          {proposals.length === 0 && <li>Nenhuma proposta enviada.</li>}
          {proposals.map((p) => (
            <li key={p.id} className="mb-1">
              <span className="font-bold">R$ {p.valor}</span> para <span>{p.prop_id}</span> <span className="text-xs">({p.status})</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <div className="font-semibold text-[#e6c86b] mb-2">Favoritos</div>
        <ul className="max-h-16 overflow-y-auto text-sm text-[#bfa97a]">
          {favorites.length === 0 && <li>Nenhum favorito.</li>}
          {favorites.map((f) => (
            <li key={f.property_id}>
              <Link href={`/imoveis/${f.property_id}`} className="hover:underline text-[#B7791F]">{f.property_id}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
