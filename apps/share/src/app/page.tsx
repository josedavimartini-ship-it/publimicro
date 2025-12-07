"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plane, Ship, Car, Users, Shield, TrendingUp, 
  Calendar, DollarSign, Globe, ChevronRight, 
  Sparkles, Award, Clock, CheckCircle2, ArrowRight,
  Sailboat, Crown
} from "lucide-react";

// Fractional ownership categories
const CATEGORIES = [
  {
    id: 'aircraft',
    icon: Plane,
    title: 'Aeronaves',
    titleEn: 'Aircraft',
    description: 'Jatos executivos, helicópteros e aviões particulares',
    items: ['Jatos Executivos', 'Helicópteros', 'Aviões Monomotor', 'Turboélices'],
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    startingPrice: 'A partir de R$ 50.000/cota',
    color: '#3B82F6',
  },
  {
    id: 'yachts',
    icon: Sailboat,
    title: 'Iates & Embarcações',
    titleEn: 'Yachts & Boats',
    description: 'Iates de luxo, veleiros e lanchas para uso compartilhado',
    items: ['Iates de Luxo', 'Veleiros', 'Lanchas', 'Catamarãs'],
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
    startingPrice: 'A partir de R$ 30.000/cota',
    color: '#06B6D4',
  },
  {
    id: 'supercars',
    icon: Car,
    title: 'Supercarros',
    titleEn: 'Supercars',
    description: 'Ferraris, Lamborghinis e carros exóticos em propriedade compartilhada',
    items: ['Ferrari', 'Lamborghini', 'Porsche', 'McLaren'],
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    startingPrice: 'A partir de R$ 80.000/cota',
    color: '#EF4444',
  },
  {
    id: 'properties',
    icon: Crown,
    title: 'Imóveis de Alto Padrão',
    titleEn: 'Luxury Properties',
    description: 'Casas de férias, chalets e propriedades exclusivas',
    items: ['Casas de Praia', 'Chalets na Serra', 'Ilhas Privativas', 'Penthouses'],
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    startingPrice: 'A partir de R$ 100.000/cota',
    color: '#F59E0B',
  },
];

// Benefits of fractional ownership
const BENEFITS = [
  {
    icon: DollarSign,
    title: 'Economia de até 90%',
    description: 'Pague apenas pela fração que você usa, sem os custos totais de propriedade',
  },
  {
    icon: Shield,
    title: 'Segurança Jurídica',
    description: 'Contratos blindados com estrutura societária transparente',
  },
  {
    icon: Calendar,
    title: 'Uso Garantido',
    description: 'Sistema de reservas inteligente que garante seu tempo de uso',
  },
  {
    icon: Users,
    title: 'Comunidade Seleta',
    description: 'Compartilhe com pessoas verificadas e do mesmo perfil',
  },
  {
    icon: TrendingUp,
    title: 'Valorização do Ativo',
    description: 'Participe da valorização proporcional à sua cota',
  },
  {
    icon: Globe,
    title: 'Rede Global',
    description: 'Acesse ativos em múltiplas localidades através de parcerias',
  },
];

// How it works steps
const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Escolha o Ativo',
    description: 'Navegue por nossa seleção curada de ativos de alto valor',
    icon: Sparkles,
  },
  {
    step: 2,
    title: 'Selecione sua Cota',
    description: 'Escolha a fração que melhor atende suas necessidades (1/4, 1/8, 1/12)',
    icon: Award,
  },
  {
    step: 3,
    title: 'Verificação & Contrato',
    description: 'Processo de verificação rápido e assinatura digital do contrato',
    icon: CheckCircle2,
  },
  {
    step: 4,
    title: 'Comece a Usar',
    description: 'Reserve seu tempo e aproveite seu novo ativo de luxo',
    icon: Clock,
  },
];

// Testimonials
const TESTIMONIALS = [
  {
    name: 'Ricardo Mendes',
    role: 'Empresário',
    text: 'Com a Sharangas, realizei o sonho de ter um jato executivo pagando uma fração do valor. A experiência é impecável.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    name: 'Carolina Alves',
    role: 'Investidora',
    text: 'A propriedade compartilhada de um iate foi a melhor decisão. Uso garantido, zero preocupação com manutenção.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
  },
  {
    name: 'Fernando Costa',
    role: 'Médico',
    text: 'Sempre quis uma Ferrari mas não fazia sentido financeiro. Com a Sharangas, tenho acesso quando quero.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  },
];

export default function SharePage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % CATEGORIES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image
                src={CATEGORIES[activeCategory].image}
                alt={CATEGORIES[activeCategory].title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
          >
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#D4AF37]/20 to-[#B87333]/20 border border-[#D4AF37]/30 mb-8">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-medium">Pioneiros no Brasil</span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37]">
                SHARANGAS
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-[#C9A87C] mb-4 font-light">
              Propriedade Fracionada de Luxo
            </p>
            
            <p className="text-lg text-[#8B9B6E] max-w-3xl mx-auto mb-12">
              O conceito que revolucionou os Estados Unidos agora no Brasil. 
              Seja proprietário de jatos, iates, supercarros e imóveis de alto padrão 
              pagando apenas uma fração do valor total.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/share/propositions"
                className="group px-8 py-4 bg-linear-to-r from-[#D4AF37] to-[#B87333] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
              >
                Explorar Oportunidades
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/share/overview"
                className="px-8 py-4 border-2 border-[#D4AF37]/50 text-[#D4AF37] font-bold rounded-full hover:bg-[#D4AF37]/10 transition-all flex items-center justify-center gap-2"
              >
                Como Funciona
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((cat, index) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    activeCategory === index
                      ? 'bg-[#D4AF37] text-[#0a0a0a]'
                      : 'bg-[#1a1a1a] text-[#8B9B6E] hover:text-[#D4AF37] border border-[#2a2a1a]'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{cat.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[#D4AF37]/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-[#D4AF37] rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#E6C98B] mb-4">
              Categorias de Ativos
            </h2>
            <p className="text-[#8B9B6E] text-lg max-w-2xl mx-auto">
              Explore nossa seleção exclusiva de ativos de alto valor disponíveis para propriedade fracionada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl border border-[#2a2a1a] hover:border-[#D4AF37]/50 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] to-transparent" />
                  <div 
                    className="absolute top-4 left-4 p-2 rounded-full"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <category.icon className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-linear-to-b from-[#0a0a0a] to-[#0f0f0f]">
                  <h3 className="text-xl font-bold text-[#E6C98B] mb-2">{category.title}</h3>
                  <p className="text-[#8B9B6E] text-sm mb-4">{category.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.items.slice(0, 3).map((item) => (
                      <span key={item} className="text-xs px-2 py-1 bg-[#1a1a1a] text-[#A8C97F] rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[#D4AF37] text-sm font-medium">{category.startingPrice}</span>
                    <ChevronRight className="w-5 h-5 text-[#8B9B6E] group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#E6C98B] mb-4">
              Como Funciona
            </h2>
            <p className="text-[#8B9B6E] text-lg max-w-2xl mx-auto">
              Um processo simples e seguro para você se tornar proprietário fracionado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Connector Line */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-linear-to-r from-[#D4AF37] to-[#D4AF37]/0" />
                )}
                
                {/* Step Number */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-[#D4AF37]/20 to-[#B87333]/20 border-2 border-[#D4AF37]/30 mb-6">
                  <item.icon className="w-10 h-10 text-[#D4AF37]" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-[#D4AF37] text-[#0a0a0a] rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-[#E6C98B] mb-2">{item.title}</h3>
                <p className="text-[#8B9B6E] text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#E6C98B] mb-4">
              Por que Propriedade Fracionada?
            </h2>
            <p className="text-[#8B9B6E] text-lg max-w-2xl mx-auto">
              Descubra as vantagens de compartilhar ativos de alto valor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a1a] hover:border-[#D4AF37]/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold text-[#E6C98B] mb-2">{benefit.title}</h3>
                <p className="text-[#8B9B6E] text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#E6C98B] mb-4">
              O que Dizem Nossos Membros
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-linear-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#2a2a1a]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-bold text-[#E6C98B]">{testimonial.name}</h4>
                    <p className="text-[#8B9B6E] text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-[#A8C97F] italic">&ldquo;{testimonial.text}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#E6C98B] mb-6">
            Pronto para Elevar seu Estilo de Vida?
          </h2>
          <p className="text-[#8B9B6E] text-lg mb-8">
            Junte-se aos pioneiros da propriedade fracionada no Brasil. 
            Cadastre-se para acesso antecipado às melhores oportunidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/entrar?redirect=/share/propositions"
              className="px-8 py-4 bg-linear-to-r from-[#D4AF37] to-[#B87333] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-[#D4AF37]/20"
            >
              Criar Conta Exclusiva
            </Link>
            <Link
              href="/"
              className="px-8 py-4 border-2 border-[#2a2a1a] text-[#8B9B6E] font-bold rounded-full hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
            >
              ← Voltar ao Início
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="py-8 px-6 border-t border-[#1a1a1a] text-center">
        <p className="text-[#676767] text-sm">
          Sharangas é uma marca do grupo PubliMicro • Pioneiros em propriedade fracionada no Brasil
        </p>
      </div>
    </main>
  );
}
