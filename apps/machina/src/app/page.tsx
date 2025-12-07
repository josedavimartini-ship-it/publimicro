"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Mock featured listings
const featuredListings = [
  {
    id: 1,
    title: "Escavadeira CAT 320",
    price: 450000,
    year: 2021,
    hours: 3200,
    location: "São Paulo, SP",
    image: "https://images.unsplash.com/photo-1580402427914-a6cc60d7d44f?w=800",
    badge: "Destaque"
  },
  {
    id: 2,
    title: "Trator John Deere 8R",
    price: 890000,
    year: 2022,
    hours: 1800,
    location: "Goiânia, GO",
    image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800",
    badge: "Novo"
  },
  {
    id: 3,
    title: "Retroescavadeira JCB 3CX",
    price: 280000,
    year: 2020,
    hours: 4500,
    location: "Ribeirão Preto, SP",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
    badge: null
  },
  {
    id: 4,
    title: "Colheitadeira New Holland",
    price: 1250000,
    year: 2023,
    hours: 800,
    location: "Cascavel, PR",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
    badge: "Premium"
  },
  {
    id: 5,
    title: "Rolo Compactador Bomag",
    price: 180000,
    year: 2019,
    hours: 5200,
    location: "Campinas, SP",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
    badge: null
  },
  {
    id: 6,
    title: "Motoniveladora CAT 140",
    price: 520000,
    year: 2020,
    hours: 3800,
    location: "Belo Horizonte, MG",
    image: "https://images.unsplash.com/photo-1589792923962-537704632910?w=800",
    badge: "Verificado"
  },
];

const categories = [
  {
    name: "Escavadeiras",
    icon: "🔩",
    count: "1.234",
    description: "Hidráulicas, anfíbias e mini",
    color: "from-amber-500 to-orange-600"
  },
  {
    name: "Tratores",
    icon: "🚜",
    count: "2.567",
    description: "Agrícolas e de esteira",
    color: "from-green-500 to-emerald-600"
  },
  {
    name: "Caminhões",
    icon: "🚛",
    count: "3.890",
    description: "Basculantes, betoneiras e munck",
    color: "from-blue-500 to-cyan-600"
  },
  {
    name: "Colheitadeiras",
    icon: "🌾",
    count: "456",
    description: "Grãos, cana e café",
    color: "from-yellow-500 to-amber-600"
  },
  {
    name: "Guindastes",
    icon: "🏗️",
    count: "234",
    description: "Móveis, fixos e sobre esteiras",
    color: "from-red-500 to-rose-600"
  },
  {
    name: "Compactadores",
    icon: "⚙️",
    count: "567",
    description: "Rolos, placas e sapatas",
    color: "from-purple-500 to-violet-600"
  },
  {
    name: "Carregadeiras",
    icon: "🪨",
    count: "890",
    description: "Frontais e sobre esteiras",
    color: "from-stone-500 to-slate-600"
  },
  {
    name: "Geradores",
    icon: "⚡",
    count: "1.123",
    description: "Diesel, gás e solar",
    color: "from-sky-500 to-blue-600"
  },
];

const brands = [
  { name: "Caterpillar", logo: "CAT" },
  { name: "Komatsu", logo: "KOM" },
  { name: "Volvo", logo: "VOLVO" },
  { name: "John Deere", logo: "JD" },
  { name: "Case", logo: "CASE" },
  { name: "New Holland", logo: "NH" },
  { name: "JCB", logo: "JCB" },
  { name: "Liebherr", logo: "LH" },
];

const stats = [
  { value: "15.000+", label: "Máquinas Anunciadas" },
  { value: "4.500+", label: "Vendedores Ativos" },
  { value: "R$ 2B+", label: "Em Negociações" },
  { value: "98%", label: "Satisfação" },
];

export default function MachinaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Badge */}
            <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-6">
              🏗️ Marketplace de Máquinas Pesadas
            </span>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-linear-to-r from-amber-400 via-orange-500 to-red-500">
                PubliMachina
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              O maior marketplace de máquinas e equipamentos pesados do Brasil.
              <br />
              <span className="text-amber-400">Construção, agricultura e mineração.</span>
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar máquinas, equipamentos, peças..."
                    className="w-full bg-white text-slate-900 rounded-xl px-6 py-4 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                    🔍
                  </span>
                </div>
                <button className="bg-linear-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg">
                  Buscar
                </button>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {["Novos", "Usados", "Aluguel", "Leilão", "Com Financiamento"].map((filter) => (
                  <button
                    key={filter}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors border border-white/20"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-amber-400">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#1e293b"/>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Encontre por <span className="text-amber-400">Categoria</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Navegue por milhares de máquinas e equipamentos em diversas categorias
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`cursor-pointer p-6 rounded-2xl bg-linear-to-br ${category.color} shadow-xl group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="relative">
                  <div className="text-5xl mb-3">{category.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                  <p className="text-white/80 text-sm mb-2">{category.description}</p>
                  <div className="text-white/90 font-semibold">{category.count} anúncios</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Máquinas em <span className="text-amber-400">Destaque</span>
              </h2>
              <p className="text-slate-400">As melhores oportunidades selecionadas para você</p>
            </div>
            <Link
              href="/maquinas"
              className="mt-4 md:mt-0 px-6 py-3 bg-amber-500/20 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-colors"
            >
              Ver todas →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -8 }}
                className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  {listing.badge && (
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
                      listing.badge === "Destaque" ? "bg-amber-500 text-white" :
                      listing.badge === "Novo" ? "bg-green-500 text-white" :
                      listing.badge === "Premium" ? "bg-purple-500 text-white" :
                      "bg-blue-500 text-white"
                    }`}>
                      {listing.badge}
                    </span>
                  )}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <span className="text-xl">🤍</span>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-amber-400 transition-colors">
                    {listing.title}
                  </h3>
                  <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
                    <span>📅 {listing.year}</span>
                    <span>⏱️ {listing.hours.toLocaleString()}h</span>
                  </div>
                  <div className="flex items-center text-slate-400 text-sm mb-4">
                    <span>📍 {listing.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-amber-400">
                      {formatPrice(listing.price)}
                    </div>
                    <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg font-medium transition-colors">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-300">
            Marcas mais procuradas
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {brands.map((brand) => (
              <motion.div
                key={brand.name}
                whileHover={{ scale: 1.1 }}
                className="px-8 py-4 bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors"
              >
                <span className="font-bold text-xl text-slate-300">{brand.logo}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing Section */}
      <section className="py-20 bg-linear-to-r from-amber-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Financiamento<br />para Máquinas
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Condições especiais para compra de máquinas e equipamentos.
                Parceiras com os principais bancos e financeiras do Brasil.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Taxa a partir de 0,99% a.m.",
                  "Entrada a partir de 20%",
                  "Prazo até 60 meses",
                  "Análise em até 24 horas"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      ✓
                    </span>
                    <span className="text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <button className="bg-white text-amber-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors">
                Simular Financiamento
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Simulador Rápido</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm">Valor da máquina</label>
                  <input
                    type="text"
                    placeholder="R$ 500.000"
                    className="w-full bg-white/20 text-white placeholder-white/50 rounded-lg px-4 py-3 mt-1"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm">Entrada</label>
                  <input
                    type="text"
                    placeholder="R$ 100.000"
                    className="w-full bg-white/20 text-white placeholder-white/50 rounded-lg px-4 py-3 mt-1"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm">Prazo</label>
                  <select className="w-full bg-white/20 text-white rounded-lg px-4 py-3 mt-1">
                    <option value="24">24 meses</option>
                    <option value="36">36 meses</option>
                    <option value="48">48 meses</option>
                    <option value="60">60 meses</option>
                  </select>
                </div>
                <button className="w-full bg-white text-amber-600 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                  Calcular Parcelas
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Serviços <span className="text-amber-400">Especializados</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Muito mais que um marketplace: oferecemos suporte completo para sua operação
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "🔧", title: "Manutenção", desc: "Rede de oficinas parceiras" },
              { icon: "📦", title: "Logística", desc: "Transporte especializado" },
              { icon: "📋", title: "Inspeção", desc: "Laudo técnico completo" },
              { icon: "🛡️", title: "Garantia", desc: "Proteção por até 12 meses" },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="bg-slate-800 p-6 rounded-2xl text-center hover:bg-slate-700 transition-colors"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                <p className="text-slate-400 text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Quer anunciar sua máquina?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Alcance milhares de compradores interessados em todo o Brasil.
              Anúncio grátis para pessoas físicas!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-linear-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg">
                Anunciar Grátis
              </button>
              <button className="bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-600 transition-colors border border-slate-600">
                Planos para Empresas
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Badge */}
      <div className="fixed bottom-6 left-6 z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
        >
          🚀 Lançamento em breve
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏗️</span>
              <span className="text-xl font-bold text-amber-400">PubliMachina</span>
            </div>
            <div className="flex gap-6 text-slate-400">
              <Link href="/sobre" className="hover:text-white">Sobre</Link>
              <Link href="/contato" className="hover:text-white">Contato</Link>
              <Link href="/termos" className="hover:text-white">Termos</Link>
              <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
            </div>
            <div className="text-slate-500 text-sm">
              © 2025 PubliMicro. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
