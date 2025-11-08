"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PropertyCard } from "@publimicro/ui";

// Get from env - this will be replaced at build time
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://irrzpwzyqcubhhjeuakc.supabase.co";

interface Item {
  id: number | string;
  titulo?: string;
  descricao?: string;
  preco?: number;
  imagem?: string | null;
  destaque?: boolean;
  status?: string;
}

function isValidUrl(s?: string | null): boolean {
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function ensureAbsolute(path?: string | null): string | null {
  if (!path) return null;
  const s = path.trim();
  if (!s) return null;
  if (isValidUrl(s)) return s;
  if (!SUPABASE_URL) return null;

  const clean = s.replace(/^\/+/, "");
  if (clean.startsWith("storage/v1/object/public/")) {
    return `${SUPABASE_URL}/${clean}`;
  }
  if (clean.startsWith("storage/")) {
    return `${SUPABASE_URL}/${clean}`;
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${clean}`;
}

export default function CarcaraHighlights() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    async function fetchItems(): Promise<void> {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("status", "aprovado")
        .eq("destaque", true)
        .limit(6);

      if (!error && data) setItems(data);
      else console.error("Erro ao buscar destaques:", error);
    }
    fetchItems();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-0 py-16">
      {/* Super highlight banner */}
      <Link
        href="/projetos/carcara"
        className="relative block h-[480px] w-full mb-20 group overflow-hidden rounded-none"
      >
        <Image
          src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg"
          alt="Sítios Carcará"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-all"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-5xl font-extrabold mb-4 tracking-tight text-amber-300">
            Sítios Carcará
          </h2>
          <p className="max-w-3xl text-lg md:text-xl leading-relaxed text-[#f7e7b0]">
            Um empreendimento rural singular  natureza, conforto e sustentabilidade
            em um conjunto de sítios exclusivos.
          </p>
          <span className="inline-block mt-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-semibold px-6 py-3 rounded-lg transition">
            Conheça o projeto
          </span>
        </div>
      </Link>

      {/* Listagem dos 6 sítios */}
      <div className="text-center mb-10">
        <p className="font-medium text-lg text-[#e7d7a8]">
          Confira as unidades disponíveis abaixo:
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {items.map((it) => (
            <PropertyCard
              key={it.id}
              id={it.id.toString()}
              title={it.titulo || "Sítio Carcará"}
              description={it.descricao}
              price={it.preco || 0}
              featured={it.destaque}
              location={{
                city: "Corumbaíba",
                state: "GO",
                neighborhood: "Sítios Carcará"
              }}
              area={{
                total: 0 // Add if available in items data
              }}
              photos={ensureAbsolute(it.imagem) ? [ensureAbsolute(it.imagem)!] : []}
              link={`/imoveis/${it.id}`}
              type="sitio"
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-[#e7d7a8]">Nenhum imóvel em destaque no momento.</p>
      )}
    </section>
  );
}
