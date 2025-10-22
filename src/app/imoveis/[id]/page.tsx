import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import PropertyDetails from "@/components/listings/PropertyDetails";
import ContactForm from "@/components/listings/ContactForm";

// Define os parâmetros da rota
type PageParams = {
  id: string;
};

// Define o tipo de item vindo do Supabase
interface Item {
  id: string;
  titulo: string;
  descricao?: string;
  preco?: number;
  imagem?: string;
  imagens?: string;
  localizacao?: string;
  status?: string;
  created_at?: string;
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<JSX.Element> {
  const { id } = await params;

  // Busca o item no Supabase
  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single<Item>();

  // Caso o item não exista ou haja erro
  if (error || !item) {
    console.error("Erro ao carregar o imóvel:", error);
    return (
      <main className="py-16 text-center text-gray-500">
        <h1 className="text-2xl font-semibold mb-2">Anúncio não encontrado</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Voltar para a página inicial
        </Link>
      </main>
    );
  }

  // Página com os detalhes do imóvel
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Componente de detalhes do imóvel */}
        <PropertyDetails item={item} />

        {/* Ações principais */}
        <div className="flex gap-4 flex-wrap">
          <Link href={`/contato?propId=${item.id}`}>
            <button
              type="button"
              className="bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800 transition"
            >
              Contato / Agendar Visita
            </button>
          </Link>

          <Link href={`/proposta?propId=${item.id}`}>
            <button
              type="button"
              className="bg-emerald-950 text-yellow-400 px-5 py-3 rounded-lg hover:bg-emerald-900 transition"
            >
              Fazer Proposta (sob autorização)
            </button>
          </Link>
        </div>

        {/* Formulário de contato */}
        <div className="mt-12">
          <ContactForm itemTitle={item.titulo} />
        </div>
      </div>
    </main>
  );
}
