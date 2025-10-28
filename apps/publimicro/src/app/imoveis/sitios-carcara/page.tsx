import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// Define os parâmetros esperados da rota
type PageParams = {
  slug?: string;
};

// Define o tipo de dados do projeto vindo do Supabase
interface Projeto {
  id: string;
  titulo: string;
  descricao?: string;
  imagem?: string;
  imagens?: string;
  status?: string;
  slug?: string;
  created_at?: string;
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<JSX.Element> {
  const { slug } = await params;
  const id = slug ?? null;

  let project: Projeto | null = null;

  if (id) {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("slug", id)
        .single<Projeto>();

      if (error) {
        console.error("Erro ao buscar projeto:", error);
      } else {
        project = data || null;
      }
    } catch (err) {
      console.error("Erro inesperado ao buscar projeto:", err);
    }
  }

  // Divide as imagens se existirem
  const imagensArray: string[] =
    project?.imagens?.split(",").map((s) => s.trim()) ??
    (project?.imagem ? [project.imagem] : []);

  return (
    <main className="min-h-screen bg-white">
      {/* Cabeçalho com imagem ou placeholder */}
      <div className="relative w-full h-72">
        {project?.imagem ? (
          <Image
            src={project.imagem}
            alt={project.titulo || "Sítios Carcará"}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <h1 className="text-3xl font-bold">Sítios Carcará</h1>
          </div>
        )}
      </div>

      {/* Conteúdo principal */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-4">
          {project?.titulo || "Sítios Carcará — Projeto"}
        </h2>

        <p className="text-gray-700 mb-6">
          {project?.descricao ||
            "Um empreendimento rural singular, com práticas de conservação, reflorestamento e uso sustentável. Confira abaixo as unidades disponíveis."}
        </p>

        <div className="mb-8">
          <Link href="/imoveis" className="text-amber-700 hover:underline">
            Ver listagem completa de imóveis
          </Link>
        </div>

        {/* Galeria de imagens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {imagensArray.length > 0 ? (
            imagensArray.map((img, i) => (
              <div
                key={i}
                className="h-48 w-full relative rounded overflow-hidden bg-gray-100"
              >
                <Image
                  src={img}
                  alt={`Foto ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              Nenhuma imagem disponível.
            </p>
          )}
        </div>

        {/* Seção de unidades */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Unidades disponíveis</h3>
          <p className="text-sm text-gray-600 mb-4">
            Clique em cada unidade para ver detalhes, agendar visita ou enviar
            proposta (mediante autorização).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["abaré", "Abaré — margem do rio"],
              ["bigua", "Biguá — margem do rio"],
              ["mergulhao", "Mergulhão — margem do rio"],
              ["seriema", "Seriema — margem de floresta"],
              ["juriti", "Juriti — margem de floresta"],
              ["surucua", "Surucuá — margem de floresta"],
            ].map(([slug, nome]) => (
              <Link
                key={slug}
                href={`/imoveis/${slug}`}
                className="block p-4 border rounded hover:shadow transition"
              >
                {nome}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
