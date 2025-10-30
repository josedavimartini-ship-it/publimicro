"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Carcara3D } from "@publimicro/ui";
import Image from "next/image";
import Link from "next/link";
import { 
  Home, Car, Tractor, Ship, Globe, 
  Plane, Share2, ShoppingBag, Sparkles
} from "lucide-react";

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
        let { data, error } = await supabase
          .from("sitios")
          .select("*")
          .eq("destaque", true)
          .limit(6);

        if (!data || data.length === 0 || error) {
          const fallback = await supabase.from("sitios").select("*").limit(6);
          data = fallback.data;
        }

        setSitios(data || []);
      } catch (err) {
        console.error(err);
        setSitios([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSitios();
  }, []);

  // Split sections: 2 left, 2 right, 4 bottom
  const leftSections = [
    { name: "PubliProper", icon: Home, href: "/proper", bgImage: "/images/sections/publiProper-bg.jpg" },
    { name: "PubliMotors", icon: Car, href: "/motors", bgImage: "/images/sections/publiMotors-bg.jpg" },
  ];

  const rightSections = [
    { name: "PubliMachina", icon: Tractor, href: "/machina", bgImage: "/images/sections/publiHeavyAgro-bg.jpg" },
    { name: "PubliMarine", icon: Ship, href: "/marine", bgImage: "/images/sections/publiMarine-bg.jpg" },
  ];

  const bottomSections = [
    { name: "PubliGlobal", icon: Globe, href: "/global", bgImage: "/images/sections/publiGlobal-bg.jpg" },
    { name: "PubliJourney", icon: Plane, href: "/journey", bgImage: "/images/sections/publiJourney-bg.jpg" },
    { name: "PubliShare", icon: Share2, href: "/share", bgImage: "/images/sections/publiShare-bg.jpg" },
    { name: "PubliTudo", icon: ShoppingBag, href: "/tudo", bgImage: "/images/sections/publiTudo-bg.jpg" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HERO SECTION WITH PROPER LAYOUT */}
        <section className="py-16">
          <div className="grid grid-cols-12 gap-6 items-center">
            
            {/* LEFT 2 BUTTONS */}
            <div className="col-span-12 md:col-span-3 grid grid-cols-1 gap-4">
              {leftSections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <Link
                    key={section.name}
                    href={section.href}
                    className="group relative h-32 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#FF6B35]/30 transition-all duration-500 hover:scale-105"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${section.bgImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/70 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <IconComponent className="w-10 h-10 text-[#FF6B35] mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                      <h3 className="text-base font-bold text-[#B7791F] group-hover:text-[#FF6B35] transition-colors">
                        {section.name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* CENTER TITLE */}
            <div className="col-span-12 md:col-span-6 text-center py-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] via-[#CD7F32] to-[#B87333] leading-tight">
                O Ecossistema PubliMicro
              </h1>
              <p className="text-[#d8c68e] text-xl md:text-2xl mb-3 leading-relaxed">
                Um universo de negócios, tecnologia e oportunidades
              </p>
              <div className="flex items-center justify-center gap-3 text-[#676767] text-lg">
                <Sparkles className="w-5 h-5 text-[#FF6B35]" />
                <p>do campo à cidade, do local ao global</p>
                <Sparkles className="w-5 h-5 text-[#FF6B35]" />
              </div>
            </div>

            {/* RIGHT 2 BUTTONS */}
            <div className="col-span-12 md:col-span-3 grid grid-cols-1 gap-4">
              {rightSections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <Link
                    key={section.name}
                    href={section.href}
                    className="group relative h-32 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#FF6B35]/30 transition-all duration-500 hover:scale-105"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${section.bgImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/70 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <IconComponent className="w-10 h-10 text-[#FF6B35] mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                      <h3 className="text-base font-bold text-[#B7791F] group-hover:text-[#FF6B35] transition-colors">
                        {section.name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* BOTTOM 4 BUTTONS - FULL WIDTH */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {bottomSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Link
                  key={section.name}
                  href={section.href}
                  className="group relative h-40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#FF6B35]/30 transition-all duration-500 hover:scale-105"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${section.bgImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/70 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <IconComponent className="w-12 h-12 text-[#FF6B35] mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    <h3 className="text-lg font-bold text-[#B7791F] group-hover:text-[#FF6B35] transition-colors">
                      {section.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SUPER HIGHLIGHT - Sítios Carcará */}
        <section className="py-16">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FF6B35]/40 min-h-[600px] group">
            <Image
              src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg"
              alt="Sítios Carcará"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/80 to-transparent" />

            {/* Bird */}
            <div className="absolute top-8 left-8 w-[220px] h-[220px] z-30 hidden lg:block">
              <Carcara3D scale={1.1} />
            </div>

            <div className="relative p-12 lg:pl-64 z-20">
              <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-[#FF6B35]/30 border-2 border-[#FF6B35] rounded-full backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-[#FF6B35] animate-pulse" />
                <span className="text-[#FF6B35] font-bold text-lg tracking-widest uppercase">Super Destaque</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FF8C42] to-[#B7791F] mb-6 drop-shadow-2xl leading-tight">
                Sítios Carcará
              </h2>
              
              <p className="text-[#d8c68e] text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed">
                6 propriedades exclusivas às margens da represa de Corumbaíba, GO. 
                Natureza preservada, infraestrutura completa. 
                Lances a partir de <span className="text-[#FF6B35] font-bold">R$ 1.050.000</span>
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

        {/* Featured Properties */}
        {!loading && sitios.length > 0 && (
          <section className="py-16">
            <h2 className="text-4xl font-bold text-[#B7791F] mb-12 text-center">
              Propriedades em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sitios.slice(0, 6).map((sitio) => (
                <Link
                  key={sitio.id}
                  href={`/projetos/carcara#${sitio.id}`}
                  className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#FF6B35] transition-all hover:scale-105 shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    {sitio.fotos?.[0] ? (
                      <Image
                        src={sitio.fotos[0]}
                        alt={sitio.nome}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a1a] to-[#1a1a1a] flex items-center justify-center">
                        <Home className="w-16 h-16 text-[#676767]" />
                      </div>
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
                    {typeof sitio.lance_inicial === "number" && (
                      <div className="text-[#FF6B35] font-bold text-xl">
                        Lance: R$ {sitio.lance_inicial.toLocaleString("pt-BR")}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-12 mt-20 border-t-2 border-[#2a2a1a]">
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
