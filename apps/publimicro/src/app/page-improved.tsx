"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Carcara3D } from "@publimicro/ui";
import Image from "next/image";
import Link from "next/link";
import { 
  Home, Car, Tractor, Ship, Globe, 
  Plane, Share2, ShoppingBag, Sparkles, Calendar
} from "lucide-react";

// Only one button per section
const sections = [
  { name: "PubliProper", icon: Home, href: "/proper", bgImage: "/images/sections/publiProper-bg.jpg" },
  { name: "PubliMotors", icon: Car, href: "/motors", bgImage: "/images/sections/publiMotors-bg.jpg" },
  { name: "PubliMachina", icon: Tractor, href: "/machina", bgImage: "/images/sections/publiMachina-bg.jpg" },
  { name: "PubliMarine", icon: Ship, href: "/marine", bgImage: "/images/sections/publiMarine-bg.jpg" },
  { name: "PubliGlobal", icon: Globe, href: "/global", bgImage: "/images/sections/publiGlobal-bg.jpg" },
  { name: "PubliJourney", icon: Plane, href: "/journey", bgImage: "/images/sections/publiJourney-bg.jpg" },
  { name: "PubliShare", icon: Share2, href: "/share", bgImage: "/images/sections/publiShare-bg.jpg" },
  { name: "PubliTudo", icon: ShoppingBag, href: "/tudo", bgImage: "/images/sections/publiTudo-bg.jpg" },
];

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
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    async function fetchSitios() {
      try {
        let { data, error } = await supabase
          .from("sitios")
          .select("*")
          .eq("destaque", true)
          .limit(6);

        if (error) {
          console.error("Supabase error:", error);
          setErrorMsg("Erro ao buscar propriedades em destaque.");
        }
        if (!data || data.length === 0) {
          const fallback = await supabase.from("sitios").select("*").limit(6);
          data = fallback.data;
        }
        console.log("Sitios loaded:", data);
        console.log("First sitio photos:", data?.[0]?.fotos);
        setSitios(data || []);
      } catch (err) {
        console.error("Error fetching sitios:", err);
        setErrorMsg("Erro inesperado ao buscar propriedades.");
        setSitios([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSitios();
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" role="main">
      <div className="max-w-7xl mx-auto px-6">
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
                  className="px-10 py-5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-black text-lg font-bold rounded-full transition-all hover:scale-105 shadow-2xl"
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

        {/* 8 Sectors Menu */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#B7791F]">Explore Nosso Ecossistema</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sections.map((section) => {
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
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <IconComponent className="w-12 h-12 text-[#FF6B35] mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    <h3 className="text-lg font-bold text-[#B7791F] group-hover:text-[#FF6B35] transition-colors">
                      {section.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Properties with Bidding Schema */}
        {!loading && sitios.length > 0 && (
          <section className="py-16">
            <h2 className="text-4xl font-bold text-[#B7791F] mb-12 text-center">
              Sítios Disponíveis - Lances Abertos
            </h2>
            {errorMsg && (
              <div className="text-center text-red-500 font-semibold mb-8">
                {errorMsg}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sitios.map((sitio) => {
                const fotoUrl = sitio.fotos && sitio.fotos.length > 0 ? sitio.fotos[0] : "/images/fallback-rancho.jpg";
                return (
                  <div key={sitio.id} className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#FF6B35] transition-all hover:scale-105 shadow-xl">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={fotoUrl}
                        alt={sitio.nome || "Sítio"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/fallback-rancho.jpg";
                        }}
                      />
                      {sitio.zona && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-[#FF6B35] text-black font-bold rounded-full text-sm">
                          {sitio.zona}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col gap-3">
                      <h3 className="text-2xl font-bold text-[#B7791F]">{sitio.nome}</h3>
                      {sitio.localizacao && <p className="text-[#676767] text-sm">{sitio.localizacao}</p>}
                      
                      {/* Bidding Schema Box */}
                      {typeof sitio.lance_inicial === "number" && (
                        <div className="bg-[#0a0a0a] rounded-lg p-4 border-2 border-[#FF6B35]/40">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[#d8c68e] text-sm font-semibold">Lance Inicial</span>
                            <Calendar className="w-4 h-4 text-[#FF6B35]" />
                          </div>
                          <div className="text-[#FF6B35] font-bold text-2xl mb-1">
                            R$ {sitio.lance_inicial.toLocaleString("pt-BR")}
                          </div>
                          {typeof sitio.preco === "number" && (
                            <div className="text-[#676767] text-xs">
                              Valor de referência: R$ {sitio.preco.toLocaleString("pt-BR")}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 mt-2">
                        <Link
                          href={`/projetos/carcara#${sitio.id}`}
                          className="w-full px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-black font-bold rounded-full shadow hover:from-[#FF8C42] hover:to-[#FF6B35] transition-all text-center"
                        >
                          Ver Detalhes & Fazer Lance
                        </Link>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`https://wa.me/5534992610004?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20${encodeURIComponent(sitio.nome)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#25D366] text-white font-bold rounded-full shadow hover:bg-[#20BD5A] transition-all flex items-center justify-center gap-1 text-sm"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            WhatsApp
                          </a>
                          <Link
                            href="/anunciar"
                            className="px-4 py-2 border-2 border-[#FF6B35] text-[#FF6B35] font-bold rounded-full shadow hover:bg-[#FF6B35]/10 transition-all text-center text-sm"
                          >
                            Anuncie
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                <li><Link href="/postar" className="hover:text-[#FF6B35]">Postar</Link></li>
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
