import Image from "next/image";
import Link from "next/link";

export default function CarcaraPage(): JSX.Element {
  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg"
          alt="Sítios Carcará"
          fill
          className="object-cover brightness-75"
          priority
        />
      </div>

      {/* Conteúdo sobreposto */}
      <section className="flex flex-col justify-center items-center text-center text-white py-32 px-6">
        <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
          Sítios Carcará
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed drop-shadow-md">
          Um projeto ecológico e exclusivo às margens do rio, com 6 sítios à venda,
          cada um com vocação natural para descanso, agrofloresta e turismo sustentável.
        </p>
        <Link
          href="#galeria"
          className="mt-8 inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
        >
          Confira as unidades disponíveis
        </Link>
      </section>

      {/* Galeria */}
      <section id="galeria" className="bg-white py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Galeria – Sítios Carcará
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            "acerola.jpg",
            "canario.jpg",
            "lindosoljaposto.jpg",
            "mutum.jpg",
            "pordosol1.jpg",
            "pordosolOrange.jpg",
          ].map((file) => (
            <div key={file} className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src={`https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/${file}`}
                alt={`Imagem ${file.replace(".jpg", "")}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
