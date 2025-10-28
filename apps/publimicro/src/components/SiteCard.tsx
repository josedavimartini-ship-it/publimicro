"use client";

import Link from "next/link";
import Image from "next/image";

interface Site {
  id?: string;
  titulo?: string;
  categoria?: string;
  preco?: number | string;
  imagem?: string | null;
}

interface SiteCardProps {
  site: Site;
}

export default function SiteCard({ site }: SiteCardProps): JSX.Element {
  const imgSrc = site.imagem || "/images/carcara-1.png";

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition">
      <div className="relative w-full h-48">
        <Image
          src={imgSrc}
          alt={site.titulo || "Imagem do imóvel"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {site.titulo || "Título não informado"}
        </h3>
        <p className="text-sm text-gray-500">
          {site.categoria || "Categoria não informada"}
        </p>

        {site.preco && (
          <p className="text-amber-700 font-bold mt-2">
            R$ {Number(site.preco).toLocaleString("pt-BR")}
          </p>
        )}

        {site.id && (
          <Link
            href={`/imoveis/${site.id}`}
            className="text-amber-700 text-sm hover:underline mt-3 inline-block"
          >
            Ver detalhes →
          </Link>
        )}
      </div>
    </div>
  );
}
