"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Carcara3D } from "@publimicro/ui";
import Image from "next/image";
import Link from "next/link";

interface Sitio {
  id: string;
  nome: string;
  localizacao?: string;
  preco?: number;
  fotos: string[];
  destaque?: boolean;
  zona?: string;
  lance_inicial?: number;
}

export default function HomePage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSitios() {
      try {
        const { data, error } = await supabase
          .from("sitios")
          .select("*")
          .eq("destaque", true);

        if (error) {
          console.error("Error fetching sítios:", error);
          setSitios([]);
        } else {
          setSitios(data || []);
        }
      } catch (err) {
        console.error("Exception fetching sítios:", err);
        setSitios([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSitios();
  }, []);

  const sections = [
    { name: "PubliProper", icon: "", href: "/proper", bgImage: "/images/sections/publiProper-bg.jpg", description: "Imóveis Urbanos & Rurais" },
    { name: "PubliMotors", icon: "", href: "/motors", bgImage: "/images/sections/publiMotors-bg.jpg", description: "Veículos e Transporte" },
    { name: "PubliHeavyAgro", icon: "", href: "/machina", bgImage: "/images/sections/publiHeavyAgro-bg.jpg", description: "Máquinas & Agroindústria" },
    { name: "PubliMarine", icon: "", href: "/marine", bgImage: "/images/sections/publiMarine-bg.jpg", description: "Náutica, Pesca & Aventura" },
    { name: "PubliGlobal", icon: "", href: "/global", bgImage: "/images/sections/publiGlobal-bg.jpg", description: "Comércio Internacional" },
    { name: "PubliJourney", icon: "", href: "/journey", bgImage: "/images/sections/publiJourney-bg.jpg", description: "Turismo & Viagens" },
    { name: "PubliShare", icon: "", href: "/share", bgImage: "/images/sections/publiShare-bg.jpg", description: "Economia Colaborativa" },
    { name: "PubliTudo", icon: "", href: "/tudo", bgImage: "/images/sections/publiTudo-bg.jpg", description: "Marketplace & Serviços" },
  ];

  const displaySitios = Array.isArray(sitios) ? sitios.slice(0, 6) : [];

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Reserve space on the RIGHT for the fixed sidebar */}
      <div className="relative mr-64">
        {/* Hero Section */}
        <section className="text-center pt-12 pb-8 px-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] via-[#CD7F32] to-[#B87333] leading-tight">
            O Ecossistema PubliMicro
          </h1>
          <p className="text-[#d8c68e] text-xl md:text-2xl mb-2 leading-relaxed">
            Um universo de negócios, tecnologia e oportunidades
          </p>
          <p className="text-[#676767] text-lg">
            <span className="text-[#FF6B35] text-3xl font-bold"></span> do campo à cidade, do local ao global{" "}
            <span className="text-[#FF6B35] text-3xl font-bold"></span>
          </p>
        </section>

        {/* Sections Grid */}
        <section className="px-6 py-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sections.map((section) => (
              <Link
                key={section.name}
                href={section.href}
                className="group relative h-48 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#FF6B35]/30 transition-all duration-500 hover:scale-105"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: [url(${section.bgImage})](http://_vscodecontentref_/2) }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-6xl mb-3 transform group-hover:scale-110 transition-transform">
                    {section.icon}
                  </span>
                  <h3 className="text-xl font-bold text-[#B7791F] group-hover:text-[#FF6B35] transition-colors mb-1">
                    {section.name}
                  </h3>
                  <p className="text-sm text-[#676767]">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SUPER HIGHLIGHT - Sítios Carcará with BIRD */}
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FF6B35]/40 min-h-[500px]">
            <Image
              src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg"
              alt="Sítios Carcará Background"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/70 to-transparent" />

            {/* Bird on LEFT so it doesn't overlap the RIGHT sidebar */}
            <div className="absolute top-8 left-8 w-[200px] h-[200px] z-30">
              <Carcara3D scale={1} />
            </div>

            <div className="relative p-12 pl-56 z-20">
              <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 bg-[#FF6B35]/30 border-2 border-[#FF6B35] rounded-full backdrop-blur-md">
                <span className="text-[#FF6B35] font-bold text-base tracking-widest uppercase"> Super Destaque</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FF8C42] to-[#B7791F] mb-6 drop-shadow-2xl max-w-3xl">
                Sítios Carcará Project
              </h2>
              <p className="text-[#d8c68e] text-2xl mb-8 max-w-2xl leading-relaxed">
                6 propriedades exclusivas às margens da represa. Natureza preservada, infraestrutura completa e lances a partir de R$ 1.050.000.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/projetos/carcara"
                  className="px-10 py-5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] text-lg font-bold rounded-full transition-all hover:scale-105 shadow-2xl"
                >
                   Explorar Projeto Completo
                </Link>
                <Link
                  href="/proper/rural"
                  className="px-10 py-5 border-3 border-[#0D7377] text-[#0D7377] hover:bg-[#0D7377]/10 text-lg font-bold rounded-full transition-all"
                >
                   Ver Mais Imóveis Rurais
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured properties from DB */}
        {!loading && displaySitios.length > 0 && (
          <section className="px-6 py-12 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-[#B7791F] mb-8 text-center">Propriedades em Destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displaySitios.map((sitio) => (
                <Link
                  key={sitio.id}
                  href={`/projetos/carcara#${sitio.id}`}
                  className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#FF6B35] transition-all hover:scale-105 shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    {sitio.fotos?.[0] && (
                      <Image
                        src={sitio.fotos[0]}
                        alt={sitio.nome}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    )}
                    {sitio.zona && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-[#FF6B35] text-[#0a0a0a] font-bold rounded-full text-sm">
                        {sitio.zona}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#B7791F] mb-2">{sitio.nome}</h3>
                    {sitio.localizacao && <p className="text-[#676767] mb-4">{sitio.localizacao}</p>}
                    {typeof sitio.preco === "number" && (
                      <div className="mb-2">
                        <span className="text-[#d8c68e]">Preço: </span>
                        <span className="text-[#FF6B35] font-bold text-xl">R$ {sitio.preco.toLocaleString("pt-BR")}</span>
                      </div>
                    )}
                    {typeof sitio.lance_inicial === "number" && (
                      <div>
                        <span className="text-[#676767]">Lance inicial: </span>
                        <span className="text-[#0D7377] font-semibold">R$ {sitio.lance_inicial.toLocaleString("pt-BR")}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="px-6 py-12 mt-20 border-t-2 border-[#2a2a1a] max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-[#B7791F] mb-4">Imóveis</h4>
              <ul className="space-y-2 text-[#676767]">
                <li><Link href="/proper/urban" className="hover:text-[#FF6B35]">Urbanos</Link></li>
                <li><Link href="/proper/rural" className="hover:text-[#FF6B35]">Rurais</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#B7791F] mb-4">Veículos</h4>
              <ul className="space-y-2 text-[#676767]">
                <li><Link href="/motors" className="hover:text-[#FF6B35]">Carros</Link></li>
                <li><Link href="/motors" className="hover:text-[#FF6B35]">Motos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#B7791F] mb-4">Serviços</h4>
              <ul className="space-y-2 text-[#676767]">
                <li><Link href="/tudo" className="hover:text-[#FF6B35]">Marketplace</Link></li>
                <li><Link href="/share" className="hover:text-[#FF6B35]">Compartilhado</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#B7791F] mb-4">Conta</h4>
              <ul className="space-y-2 text-[#676767]">
                <li><Link href="/entrar" className="hover:text-[#FF6B35]">Entrar</Link></li>
                <li><Link href="/anunciar" className="hover:text-[#FF6B35]">Anunciar</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-[#676767] text-sm pt-8 border-t border-[#2a2a1a]">
             2025 PubliMicro Ecosystem. Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </main>
  );
}
