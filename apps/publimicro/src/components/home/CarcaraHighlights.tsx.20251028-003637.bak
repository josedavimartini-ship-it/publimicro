"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Item {
  id: number | string;
  titulo?: string;
  descricao?: string;
  preco?: number;
  imagem?: string | null;
  destaque?: boolean;
  status?: string;
}

/** Valida se é URL absoluta */
function isValidUrl(s?: string): boolean {
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function CarcaraHighlights(): JSX.Element {
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
      {/* ===== BLOCO PRINCIPAL DO PROJETO ===== */}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <h2 className="text-5xl font-extrabold mb-4 tracking-tight">
            Sítios Carcará
          </h2>
          <p className="max-w-3xl text-lg md:text-xl opacity-90 leading-relaxed">
            Um empreendimento rural singular — natureza, conforto e
            sustentabilidade em um conjunto de sítios exclusivos.
          </p>
          <span className="inline-block mt-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition">
            Conheça o projeto
          </span>
        </div>
      </Link>

      {/* ===== LISTAGEM DOS SÍTIOS DISPONÍVEIS ===== */}
      <div className="text-center mb-10">
        <p className="font-medium text-lg text-gray-800">
          Confira as unidades disponíveis abaixo:
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {items.map((it) => {
            const img = (it.imagem || "").trim();
            const imgValid = isValidUrl(img);

            return (
              <Link
                key={it.id}
                href={`/imoveis/${it.id}`}
                className="block group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl rounded-xl overflow-hidden bg-white"
                aria-label={`Abrir detalhe ${it.titulo || "Sítio"}`}
              >
                <div className="relative h-56 w-full">
                  {/* Badge */}
                  <div className="absolute z-20 top-3 left-3 bg-amber-700/95 text-white text-xs px-2 py-1 rounded-md font-semibold shadow">
                    Projeto: Sítios Carcará
                  </div>

                  {imgValid ? (
                    <Image
                      src={img}
                      alt={it.titulo || "Imagem do sítio"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Sem imagem
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {it.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {it.descricao}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-emerald-700 font-bold">
                      R$ {Number(it.preco || 0).toLocaleString("pt-BR")}
                    </p>
                    <span className="inline-block text-sm bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded-lg transition">
                      Ver detalhes
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Nenhum imóvel em destaque no momento.
        </p>
      )}
    </section>
  );
}
