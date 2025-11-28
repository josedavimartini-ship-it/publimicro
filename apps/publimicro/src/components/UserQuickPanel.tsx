"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Heart, MessageCircle } from 'lucide-react';

export default function UserQuickPanel() {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [favorites, setFavorites] = useState<Array<Record<string, unknown>>>([]);
  const [proposals, setProposals] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser((data.user as unknown) as Record<string, unknown>);
        const rawUser = data.user as unknown;
        const userId = ((): string => {
          if (rawUser && typeof rawUser === 'object' && 'id' in rawUser) {
            const maybeId = (rawUser as Record<string, unknown>)['id'];
            if (typeof maybeId === 'string') return maybeId;
            if (typeof maybeId === 'number') return String(maybeId);
          }
          return '';
        })();

        if (userId) {
          supabase
            .from('favorites')
            .select('*')
            .eq('user_id', userId)
            .then(({ data }) => setFavorites((data as Array<Record<string, unknown>>) || []));
          supabase
            .from('proposals')
            .select('*')
            .eq('user_id', userId)
            .then(({ data }) => setProposals((data as Array<Record<string, unknown>>) || []));
        }
      }
    });
  }, []);

  if (!user) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-[#1a1a1a]/95 border border-[#2a2a1a] rounded-2xl shadow-2xl p-4 w-80">
      <div className="mb-3 text-lg font-bold text-amber-400">Olá, {String(user.email ?? '')}</div>
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
            <li key={String((p as Record<string, unknown>).id ?? Math.random())} className="mb-1">
              <span className="font-bold">R$ {String((p as Record<string, unknown>).valor ?? '')}</span> para <span>{String((p as Record<string, unknown>).prop_id ?? '')}</span> <span className="text-xs">({String((p as Record<string, unknown>).status ?? '')})</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <div className="font-semibold text-[#e6c86b] mb-2">Favoritos</div>
        <ul className="max-h-16 overflow-y-auto text-sm text-[#bfa97a]">
          {favorites.length === 0 && <li>Nenhum favorito.</li>}
          {favorites.map((f) => (
            <li key={String((f as Record<string, unknown>).property_id ?? Math.random())}>
              <Link href={`/imoveis/${String((f as Record<string, unknown>).property_id ?? '')}`} className="hover:underline text-[#B7791F]">{String((f as Record<string, unknown>).property_id ?? '')}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

