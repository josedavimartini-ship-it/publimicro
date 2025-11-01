"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Maximize, Home, ArrowLeft } from "lucide-react";

interface Sitio {
  id: string;
  nome: string;
  localizacao?: string;
  preco?: number;
  fotos: string[];
  destaque?: boolean;
  zona?: string;
  lance_inicial?: number;
  descricao?: string;
  area_total?: number;
  area_construida?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
}

export default function PropertyPage() {
  const params = useParams();
  const id = params?.id as string;
  const [sitio, setSitio] = useState<Sitio | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchSitio() {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("sitios")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching sitio:", error);
        } else {
          console.log("Sitio loaded:", data);
          setSitio(data);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSitio();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl">Carregando...</div>
      </main>
    );
  }

  if (!sitio) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#D4A574] mb-4">Propriedade não encontrada</h1>
          <Link href="/" className="text-[#FF6B35] hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </main>
    );
  }

  const currentImage = sitio.fotos && sitio.fotos.length > 0 ? sitio.fotos[currentImageIndex] : "/images/fallback-rancho.jpg";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#D4A574] hover:text-[#FF6B35] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Listagem
        </Link>

        {/* Property Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-5xl font-bold text-[#D4A574]">{sitio.nome}</h1>
            {sitio.zona && (
              <span className="px-4 py-2 bg-[#FF6B35] text-[#0a0a0a] font-bold rounded-full">
                {sitio.zona}
              </span>
            )}
          </div>
          {sitio.localizacao && (
            <div className="flex items-center gap-2 text-[#8B9B6E] text-lg">
              <MapPin className="w-5 h-5" />
              {sitio.localizacao}
            </div>
          )}
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <Image
                src={currentImage}
                alt={sitio.nome}
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/fallback-rancho.jpg";
                }}
              />
            </div>
            {sitio.fotos && sitio.fotos.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {sitio.fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? "border-[#FF6B35]" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={foto}
                      alt={`${sitio.nome} - Foto ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bidding Box */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border-2 border-[#FF6B35]/40 h-fit sticky top-24">
            <h2 className="text-2xl font-bold text-[#D4A574] mb-6">Informações de Lance</h2>
            
            {typeof sitio.lance_inicial === "number" && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#8B9B6E] text-sm">Lance Inicial</span>
                  <Calendar className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <div className="text-[#FF6B35] font-bold text-4xl mb-2">
                  R$ {sitio.lance_inicial.toLocaleString("pt-BR")}
                </div>
              </div>
            )}

            {typeof sitio.preco === "number" && (
              <div className="mb-6 pb-6 border-b border-[#2a2a1a]">
                <span className="text-[#8B9B6E] text-sm">Valor de Referência</span>
                <div className="text-[#D4A574] font-bold text-2xl">
                  R$ {sitio.preco.toLocaleString("pt-BR")}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link
                href="#fazer-lance"
                className="block w-full px-6 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold rounded-full text-center hover:from-[#FF8C42] hover:to-[#FF6B35] transition-all shadow-lg"
              >
                Fazer Lance Agora
              </Link>
              <a
                href="https://wa.me/5534992610004?text=Olá!%20Gostaria%20de%20informações%20sobre%20a%20propriedade"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-4 border-2 border-[#D4A574] text-[#D4A574] font-bold rounded-full text-center hover:bg-[#D4A574]/10 transition-all"
              >
                Contato via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Description */}
            {sitio.descricao && (
              <section className="mb-8">
                <h2 className="text-3xl font-bold text-[#D4A574] mb-4">Descrição</h2>
                <p className="text-[#8B9B6E] text-lg leading-relaxed">{sitio.descricao}</p>
              </section>
            )}

            {/* Features */}
            <section className="mb-8">
              <h2 className="text-3xl font-bold text-[#D4A574] mb-4">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sitio.area_total && (
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a1a]">
                    <Maximize className="w-6 h-6 text-[#FF6B35] mb-2" />
                    <div className="text-[#8B9B6E] text-sm">Área Total</div>
                    <div className="text-[#D4A574] font-bold">{sitio.area_total} ha</div>
                  </div>
                )}
                {sitio.area_construida && (
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a1a]">
                    <Home className="w-6 h-6 text-[#FF6B35] mb-2" />
                    <div className="text-[#8B9B6E] text-sm">Área Construída</div>
                    <div className="text-[#D4A574] font-bold">{sitio.area_construida} m²</div>
                  </div>
                )}
                {sitio.quartos && (
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a1a]">
                    <div className="text-[#8B9B6E] text-sm">Quartos</div>
                    <div className="text-[#D4A574] font-bold text-2xl">{sitio.quartos}</div>
                  </div>
                )}
                {sitio.banheiros && (
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a1a]">
                    <div className="text-[#8B9B6E] text-sm">Banheiros</div>
                    <div className="text-[#D4A574] font-bold text-2xl">{sitio.banheiros}</div>
                  </div>
                )}
                {sitio.vagas && (
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a1a]">
                    <div className="text-[#8B9B6E] text-sm">Vagas</div>
                    <div className="text-[#D4A574] font-bold text-2xl">{sitio.vagas}</div>
                  </div>
                )}
              </div>
            </section>

            {/* Bidding Form */}
            <section id="fazer-lance" className="bg-[#1a1a1a] rounded-2xl p-8 border-2 border-[#FF6B35]/40">
              <h2 className="text-3xl font-bold text-[#D4A574] mb-6">Fazer Lance</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-[#D4A574] mb-2">Nome Completo</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#D4A574] mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#D4A574] mb-2">Telefone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#D4A574] mb-2">Valor do Lance (R$)</label>
                  <input
                    type="number"
                    min={sitio.lance_inicial || 0}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    placeholder={`Mínimo: R$ ${sitio.lance_inicial?.toLocaleString("pt-BR") || 0}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#D4A574] mb-2">Mensagem (Opcional)</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold rounded-full hover:from-[#FF8C42] hover:to-[#FF6B35] transition-all shadow-lg"
                >
                  Enviar Lance
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
