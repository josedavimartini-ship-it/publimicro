import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { getPhotoUrl } from '@/lib/photoUtils';

interface Item {
  id: string | number;
  titulo?: string;
  descricao?: string;
  preco?: number;
  imagem?: string | null;
  categoria?: string;
}

export default async function FeaturedProperties(): Promise<JSX.Element> {
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .ilike("categoria", "%sítio%")
    .limit(6);

  if (error) {
    console.error("Erro ao buscar itens:", error);
  }

  return (
    <section id="imoveis" className="py-16 px-6 md:px-12 bg-[#0a0a0a]">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#A8C97F]">
        Destaques – Sítios Carcará
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items?.map((item: Item) => (
          <div
            key={item.id}
            className="bg-[#1a2a1a] shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition border-2 border-[#3a4a3a] hover:border-[#6B7F5C]"
          >
            {item.imagem && (
              <Image
                src={getPhotoUrl(item.imagem)}
                alt={item.titulo || "Imagem do imóvel"}
                width={600}
                height={400}
                className="object-cover w-full h-56"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#A8C97F]">{item.titulo}</h3>
              <p className="text-sm text-[#8B9B6E] line-clamp-2">
                {item.descricao}
              </p>
              <p className="text-lg font-bold text-[#D4AF37] mt-2">
                R$ {Number(item.preco || 0).toLocaleString("pt-BR")}
              </p>
              <a
                href={`/imoveis/${item.id}`}
                className="block mt-3 text-[#B87333] hover:text-[#D4AF37] font-semibold hover:underline"
              >
                Ver detalhes →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
