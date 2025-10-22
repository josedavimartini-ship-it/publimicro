"use client";

import Image from "next/image";
import { useState } from "react";

interface PropertyDetailsProps {
  item: {
    id: string | number;
    titulo: string;
    descricao?: string;
    preco?: number;
    imagem?: string | null;
  };
}

/** Verifica se uma URL é válida */
function isValidUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function PropertyDetails({ item }: PropertyDetailsProps): JSX.Element {
  const [selected] = useState(item.imagem?.trim() || ""); // 🔹 removido o setSelected não usado
  const valid = isValidUrl(selected);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{item.titulo}</h1>

      <div className="mt-6">
        {valid ? (
          <Image
            src={selected}
            alt={item.titulo}
            width={800}
            height={500}
            className="w-full h-96 object-cover rounded-lg mb-4"
            priority
          />
        ) : (
          <div className="w-full h-96 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
      </div>

      <p className="text-gray-700 leading-relaxed mb-4">
        {item.descricao || "Descrição não disponível."}
      </p>

      {item.preco && (
        <p className="text-emerald-700 font-bold text-xl">
          R$ {Number(item.preco).toLocaleString("pt-BR")}
        </p>
      )}

      {/* Espaço para futuras galerias, vídeos, etc */}
      <div className="mt-12 border-t pt-6 text-gray-500 text-sm">
        <p>Mais fotos, vídeos e recursos interativos em breve.</p>
      </div>
    </section>
  );
}
