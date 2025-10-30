﻿"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, Trees, MapPin, TrendingUp, Home, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function ProperPage() {
  const categories = [
    {
      name: "Imóveis Urbanos",
      href: "/proper/urban",
      icon: Building2,
      description: "Apartamentos, casas, salas comerciais",
      image: "/images/sections/publiProper-bg.jpg",
      stats: "120+ imóveis"
    },
    {
      name: "Imóveis Rurais",
      href: "/proper/rural",
      icon: Trees,
      description: "Sítios, fazendas, chácaras e terrenos",
      image: "/images/sections/publiProper-bg.jpg",
      stats: "45+ propriedades",
      featured: true
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-[#B7791F]/20 border-2 border-[#B7791F] rounded-full">
            <Home className="w-5 h-5 text-[#B7791F]" />
            <span className="text-[#B7791F] font-bold tracking-wider">PUBLIMICRO PROPER</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B7791F] via-[#CD7F32] to-[#B87333] mb-6">
            Seu Imóvel Ideal
          </h1>
          
          <p className="text-[#d8c68e] text-xl md:text-2xl mb-4 max-w-3xl mx-auto">
            Do apartamento na cidade ao sítio no campo. Encontre oportunidades exclusivas de investimento imobiliário.
          </p>
        </motion.div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] hover:border-[#B7791F] rounded-3xl overflow-hidden transition-all hover:scale-[1.02] shadow-xl hover:shadow-2xl"
              >
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-10" />
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                  {cat.featured && (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-[#FF6B35] text-[#0a0a0a] font-bold rounded-full text-sm z-20">
                      ⭐ Destaque
                    </div>
                  )}
                </div>

                <div className="relative p-8 z-20">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-[#B7791F]/20 rounded-xl">
                      <IconComponent className="w-8 h-8 text-[#B7791F]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#B7791F] group-hover:text-[#FF6B35] transition-colors mb-2">
                        {cat.name}
                      </h3>
                      <p className="text-[#676767] mb-3">{cat.description}</p>
                      <div className="flex items-center gap-2 text-sm text-[#d8c68e]">
                        <TrendingUp className="w-4 h-4" />
                        <span>{cat.stats}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Sítios Carcará Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-[#FF6B35]/20 to-[#B7791F]/20 border-2 border-[#FF6B35] rounded-3xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#FF6B35]/30 rounded-full">
                <span className="text-[#FF6B35] font-bold text-sm"> LANÇAMENTO EXCLUSIVO</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#B7791F] mb-4">
                Sítios Carcará
              </h2>
              <p className="text-[#d8c68e] text-lg mb-6">
                6 propriedades exclusivas às margens da Represa de Corumbaíba, GO. 
                Lances a partir de R$ 1.050.000.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/projetos/carcara"
                  className="px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] font-bold rounded-full transition-all hover:scale-105"
                >
                  Ver Propriedades
                </Link>
                <a
                  href="https://wa.me/5534992610004?text=Olá! Gostaria de saber mais sobre os Sítios Carcará"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 font-bold rounded-full transition-all flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-[#1a1a1a]/80 rounded-xl">
                  <div className="text-3xl font-bold text-[#FF6B35]">6</div>
                  <div className="text-sm text-[#676767]">Propriedades</div>
                </div>
                <div className="text-center p-4 bg-[#1a1a1a]/80 rounded-xl">
                  <div className="text-3xl font-bold text-[#0D7377]">15km²</div>
                  <div className="text-sm text-[#676767]">Área Total</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#676767] hover:text-[#B7791F] transition-colors"
          >
             Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
  );
}
