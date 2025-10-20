"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Item {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  imagem: string;
  destaque: boolean;
  status: string;
}

export default function CarcaraHighlights() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    async function fetchItems() {
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
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* BLOCO DE APRESENTAÇÃO DO CONJUNTO */}
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-bold mb-4 text-amber-700">
          Sítios Carcará
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Um empreendimento rural singular, localizado em meio à natureza,
          reunindo conforto, sustentabilidade e conexão com o campo.
          O <strong>Sítios Carcará</strong> é composto por 6 unidades exclusivas,
          cada uma projetada para oferecer liberdade, ar puro e o melhor da
          vida no interior.
        </p>

        <div className="mt-6">
          <p className="font-medium text-lg text-gray-800">
            Confira as unidades disponíveis abaixo:
          </p>
        </div>
      </div>

      {/* BLOCO DOS DESTAQUES */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((it) => {
            const first = it.imagem?.trim();
            return (
              <div
                key={it.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative h-56 w-full">
                  {first ? (
                    <Image
                      src={first}
                      alt={it.titulo}
                      fill
                      className="object-cover"
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
                  <p className="text-emerald-700 font-bold mt-3">
                    R$ {it.preco?.toLocaleString("pt-BR")}
                  </p>
                  <a
                    href={`/imoveis/${it.id}`}
                    className="inline-block mt-4 text-sm bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg transition"
                  >
                    Ver detalhes
                  </a>
                </div>
              </div>
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
