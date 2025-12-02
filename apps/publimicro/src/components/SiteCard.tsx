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
    <div className="border-2 border-[#3a4a3a] rounded-xl overflow-hidden shadow-lg bg-[#1a2a1a] hover:shadow-2xl hover:border-[#6B7F5C] transition">
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
        <h3 className="text-lg font-semibold text-[#A8C97F]">
          {site.titulo || "Título não informado"}
        </h3>
        <p className="text-sm text-[#8B9B6E]">
          {site.categoria || "Categoria não informada"}
        </p>

        {site.preco && (
          <p className="text-[#D4AF37] font-bold mt-2">
            R$ {Number(site.preco).toLocaleString("pt-BR")}
          </p>
        )}

        {site.id && (
          <Link
            href={`/imoveis/${site.id}`}
            className="text-[#B87333] hover:text-[#D4AF37] text-sm hover:underline mt-3 inline-block font-medium"
          >
            Ver detalhes →
          </Link>
        )}
      </div>
    </div>
  );
}
