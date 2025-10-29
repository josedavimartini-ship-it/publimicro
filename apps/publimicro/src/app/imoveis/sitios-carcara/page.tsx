import Image from "next/image";
import Link from "next/link";
import MapKmlViewer from "@/components/map/MapKmlViewer";

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

export default async function Page(): Promise<JSX.Element> {
  // If you still need Supabase data for hero, keep your existing query above.
  const imagensArray: string[] = [
    "https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/surucua.jpg",
    "https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/solposto.jpg",
    "https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol7.jpg",
  ];

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-[#e6c86b]">
      {/* Hero */}
      <div className="relative w-full h-72">
        <Image
          src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg"
          alt="Sítios Carcará"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-[#0f0f0f]/40" />
        <div className="absolute bottom-4 left-6">
          <h1 className="text-3xl font-bold text-amber-400 drop-shadow">
            Sítios Carcará
          </h1>
          <p className="text-[#bfa97a]">
            Projeto ecológico às margens da represa
          </p>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-10">
        {/* KML Map */}
        <h2 className="text-2xl font-bold text-amber-400 mb-3">
          Mapa — Divisão dos Sítios
        </h2>
        <p className="text-sm text-[#bfa97a] mb-4">
          Visualize os polígonos das unidades diretamente no mapa.
        </p>
        <MapKmlViewer kmlUrl="/maps/carcara.kml" />

        {/* Gallery */}
        <h3 className="text-xl font-semibold text-amber-400 mt-10 mb-4">
          Galeria
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {imagensArray.map((img, i) => (
            <div key={i} className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src={img}
                alt={`Foto ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Unidades (links to details or anchor on project page) */}
        <h3 className="text-xl font-semibold text-amber-400 mt-10 mb-2">
          Unidades disponíveis
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            ["abare", "Abaré — margem do rio"],
            ["bigua", "Biguá — margem do rio"],
            ["mergulhao", "Mergulhão — margem do rio"],
            ["seriema", "Seriema — margem de floresta"],
            ["juriti", "Juriti — margem de floresta"],
            ["surucua", "Surucuá — margem de floresta"],
          ].map(([slug, nome]) => (
            <Link
              key={slug}
              href={`/projetos/carcara#${slug}`}
              className="block p-4 rounded-lg bg-[#0b0b0b] border border-[#242424] hover:border-amber-500/40 transition"
            >
              {nome}
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/projetos/carcara"
            className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full"
          >
            Ver Projeto Completo →
          </Link>
        </div>
      </section>
    </main>
  );
}
