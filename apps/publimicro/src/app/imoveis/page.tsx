import { supabase } from "@/lib/supabaseClient";

interface Imovel {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  status: string;
  imagem?: string;
  created_at?: string;
}

export default async function Page(): Promise<JSX.Element> {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Erro ao carregar imóveis:", error);
    return (
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Imóveis (Publiproper)</h1>
        <p className="text-red-600">Erro ao carregar imóveis.</p>
      </main>
    );
  }

  const imoveis: Imovel[] = data || [];

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Imóveis (Publiproper)</h1>
      <p className="mb-6">
        Listagem completa de imóveis. Em desenvolvimento: filtros avançados,
        mapas e favoritos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {imoveis.length === 0 ? (
          <p className="text-gray-500 col-span-full">
            Nenhum imóvel aprovado no momento.
          </p>
        ) : (
          imoveis.map((it) => (
            <a
              key={it.id}
              href={`/imoveis/${it.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-lg overflow-hidden"
            >
              <div className="h-44 bg-gray-100 w-full flex items-center justify-center text-sm text-gray-400">
                {it.imagem ? (
                  <img
                    src={it.imagem}
                    alt={it.titulo}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  "Imagem (placeholder)"
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold">{it.titulo}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {it.descricao}
                </p>
                <p className="mt-2 font-bold text-emerald-800">
                  R${" "}
                  {it.preco
                    ? it.preco.toLocaleString("pt-BR")
                    : "Valor não informado"}
                </p>
              </div>
            </a>
          ))
        )}
      </div>
    </main>
  );
}
