"use client";

import { motion } from 'framer-motion';
import { 
  Plane, MapPin, Camera, Compass, Mountain, Palmtree, 
  Globe, Hotel, Utensils, Ticket, Backpack, Ship,
  ArrowRight, Star, Users, Heart
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function JourneyPage() {
  const travelCategories = [
    {
      icon: <Plane className="w-12 h-12" />,
      title: "Pacotes de Viagem",
      description: "Roteiros completos nacionais e internacionais com tudo incluso",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Mountain className="w-12 h-12" />,
      title: "Ecoturismo",
      description: "Aventuras em contato com a natureza: trilhas, cachoeiras e montanhas",
      image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&q=80",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Palmtree className="w-12 h-12" />,
      title: "Praias & Resorts",
      description: "Os melhores destinos de praia do Brasil e do mundo",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
      color: "from-orange-500 to-yellow-500"
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Turismo Cultural",
      description: "Explore a história, cultura e gastronomia de destinos incríveis",
      image: "https://images.unsplash.com/photo-1513415756499-a2a0d1a2dfdb?w=600&q=80",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const popularDestinations = [
    {
      name: "Fernando de Noronha",
      country: "Brasil",
      image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80",
      price: "A partir de R$ 2.500"
    },
    {
      name: "Machu Picchu",
      country: "Peru",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80",
      price: "A partir de R$ 4.800"
    },
    {
      name: "Chapada dos Veadeiros",
      country: "Brasil",
      image: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=600&q=80",
      price: "A partir de R$ 1.200"
    },
    {
      name: "Patagônia",
      country: "Argentina/Chile",
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80",
      price: "A partir de R$ 5.500"
    }
  ];

  const services = [
    { icon: <Hotel className="w-8 h-8" />, label: "Hospedagem" },
    { icon: <Ticket className="w-8 h-8" />, label: "Passeios" },
    { icon: <Utensils className="w-8 h-8" />, label: "Gastronomia" },
    { icon: <Ship className="w-8 h-8" />, label: "Cruzeiros" },
    { icon: <Backpack className="w-8 h-8" />, label: "Mochilão" },
    { icon: <Camera className="w-8 h-8" />, label: "Fotografia" }
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/50 to-purple-900/50 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
          alt="Travel Background"
          fill
          className="object-cover"
          priority
        />
        
        <div className="relative z-20 text-center px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/30 backdrop-blur-sm rounded-full border border-blue-400/50 mb-6">
              <Compass className="w-5 h-5 text-blue-300" />
              <span className="text-blue-200 font-semibold">Descubra o Mundo</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              PubliJourney
            </h1>
            
            <p className="text-2xl md:text-3xl text-blue-200 font-bold mb-4">
              Sua Próxima Aventura Começa Aqui
            </p>
            
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10">
              Explore destinos incríveis, reserve experiências únicas e conecte-se com viajantes. 
              Turismo, aventura e cultura em um só lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/journey/explorar"
                className="group px-8 py-4 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
              >
                Explorar Destinos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/journey/pacotes"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold rounded-full text-lg transform hover:scale-105 transition-all"
              >
                Ver Pacotes
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Travel Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#E6C98B] to-[#D4A574] mb-4">
              Tipos de Viagem
            </h2>
            <p className="text-xl text-[#8B9B6E]">
              Encontre a experiência perfeita para você
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {travelCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl h-80 cursor-pointer"
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                <div className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 inline-block mb-4 w-fit">
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {category.title}
                  </h3>
                  
                  <p className="text-white/90 text-lg mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center text-white font-semibold">
                    Explorar
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-4 bg-linear-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#E6C98B] to-[#D4A574] mb-4">
              Destinos Populares
            </h2>
            <p className="text-xl text-[#8B9B6E]">
              Os lugares mais procurados pelos viajantes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {popularDestinations.map((dest, index) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-[#1a1a1a] border border-[#2a2a2a] hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all cursor-pointer"
              >
                <div className="relative h-48">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    4.8
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-bold text-[#E6C98B] mb-1">
                    {dest.name}
                  </h3>
                  
                  <p className="text-[#8B9B6E] text-sm mb-3 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {dest.country}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                    <span className="text-[#D4A574] font-bold">
                      {dest.price}
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#E6C98B] to-[#D4A574] mb-4">
              Serviços Inclusos
            </h2>
            <p className="text-xl text-[#8B9B6E]">
              Tudo que você precisa em um só lugar
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-blue-500/50 rounded-2xl p-6 text-center transition-all hover:scale-105 cursor-pointer"
              >
                <div className="inline-flex p-3 bg-linear-to-br from-blue-500/20 to-cyan-500/20 rounded-full mb-3">
                  <div className="text-blue-400">
                    {service.icon}
                  </div>
                </div>
                <div className="text-[#E6C98B] font-semibold text-sm">
                  {service.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/20" />
            
            <div className="relative z-10">
              <Heart className="w-16 h-16 text-white mx-auto mb-6" />
              
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Cadastre-se e Receba Ofertas Exclusivas
              </h2>
              
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Seja o primeiro a saber sobre promoções, pacotes especiais e destinos incríveis
              </p>
              
              <Link
                href="/journey/cadastro"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 font-black rounded-full text-lg shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all"
              >
                Quero Receber Ofertas
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 px-4 border-t border-[#2a2a2a]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#676767] text-sm">
            🚀 <strong>Em Desenvolvimento:</strong> PubliJourney está sendo construído para oferecer as melhores experiências de viagem. 
            Cadastre-se para ser notificado quando lançarmos oficialmente!
          </p>
        </div>
      </section>
    </main>
  );
}
