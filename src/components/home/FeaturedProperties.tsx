import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

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
    <section id="imoveis" className="py-16 px-6 md:px-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-emerald-900">
        Destaques – Sítios Carcará
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items?.map((item: Item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition"
          >
            {item.imagem && (
              <Image
                src={item.imagem}
                alt={item.titulo || "Imagem do imóvel"}
                width={600}
                height={400}
                className="object-cover w-full h-56"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold">{item.titulo}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.descricao}
              </p>
              <p className="text-lg font-bold text-emerald-800 mt-2">
                R$ {Number(item.preco || 0).toLocaleString("pt-BR")}
              </p>
              <a
                href={`/imoveis/${item.id}`}
                className="block mt-3 text-blue-700 font-semibold hover:underline"
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
