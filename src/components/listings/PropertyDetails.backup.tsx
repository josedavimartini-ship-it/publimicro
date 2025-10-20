"use client";

import Image from "next/image";
import { useState } from "react";

export default function PropertyDetails({ item }: { item: any }) {
  const images = item?.imagens ? item.imagens.split(",") : [item.imagem].filter(Boolean);
  const [selected, setSelected] = useState(images[0]);

  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h1 className="text-3xl font-semibold text-gray-800">{item.titulo}</h1>
      <p className="mt-2 text-gray-600">{item.descricao}</p>

      <div className="mt-6">
        {selected && (
          <Image
            src={selected}
            alt={item.titulo}
            width={800}
            height={500}
            className="w-full h-96 object-cover rounded-lg mb-4"
          />
        )}

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto">
            {images.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setSelected(img)}
                className={`border-2 rounded-lg overflow-hidden ${
                  selected === img ? "border-primary" : "border-transparent"
                }`}
              >
                <Image
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  width={120}
                  height={80}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 gap-6 text-gray-700">
        <div>
          <h2 className="font-medium text-gray-800">Localização</h2>
          <p>{item.localizacao || "Não informada"}</p>
        </div>
        <div>
          <h2 className="font-medium text-gray-800">Preço</h2>
          <p>R$ {item.preco?.toLocaleString("pt-BR") || "Sob consulta"}</p>
        </div>
        <div>
          <h2 className="font-medium text-gray-800">Área</h2>
          <p>{item.area ? `${item.area} m²` : "Não informada"}</p>
        </div>
        <div>
          <h2 className="font-medium text-gray-800">Status</h2>
          <p>{item.status || "Pendente"}</p>
        </div>
      </div>
    </section>
  );
}
