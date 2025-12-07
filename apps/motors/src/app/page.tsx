"use client";

import { motion } from 'framer-motion';
import { 
  Car, Bike, Truck, Bus, Fuel, Gauge, Calendar,
  ArrowRight, Star, Shield, Zap, Users, Search,
  MapPin, DollarSign, CheckCircle, Settings, Key,
  CircleDollarSign, Sparkles, TrendingUp, Award
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MotorsPage() {
  const vehicleCategories = [
    {
      icon: <Car className="w-14 h-14" />,
      title: "Carros",
      count: "8.450 anúncios",
      image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80",
      color: "from-red-600 to-orange-500",
      subcategories: ["Sedan", "SUV", "Hatch", "Pick-up", "Esportivos"]
    },
    {
      icon: <Bike className="w-14 h-14" />,
      title: "Motos",
      count: "4.230 anúncios",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80",
      color: "from-orange-600 to-yellow-500",
      subcategories: ["Street", "Trail", "Custom", "Scooter", "Esportiva"]
    },
    {
      icon: <Truck className="w-14 h-14" />,
      title: "Caminhões",
      count: "1.890 anúncios",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
      color: "from-blue-600 to-indigo-500",
      subcategories: ["Leve", "Médio", "Pesado", "Cavalo Mecânico"]
    },
    {
      icon: <Bus className="w-14 h-14" />,
      title: "Ônibus & Vans",
      count: "920 anúncios",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80",
      color: "from-green-600 to-teal-500",
      subcategories: ["Micro-ônibus", "Ônibus", "Vans", "Fretamento"]
    },
  ];

  const featuredVehicles = [
    {
      title: "BMW X5 2024",
      price: "R$ 589.000",
      year: "2024",
      km: "0 km",
      fuel: "Gasolina",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
      location: "São Paulo, SP",
      featured: true
    },
    {
      title: "Honda Civic Touring",
      price: "R$ 189.900",
      year: "2023",
      km: "12.000 km",
      fuel: "Flex",
      image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600&q=80",
      location: "Rio de Janeiro, RJ",
      featured: true
    },
    {
      title: "Toyota Hilux SRX",
      price: "R$ 298.000",
      year: "2023",
      km: "25.000 km",
      fuel: "Diesel",
      image: "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=600&q=80",
      location: "Goiânia, GO",
      featured: false
    },
    {
      title: "Harley Davidson Iron 883",
      price: "R$ 68.900",
      year: "2022",
      km: "8.500 km",
      fuel: "Gasolina",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      location: "Curitiba, PR",
      featured: false
    },
  ];

  const benefits = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Veículos Verificados",
      description: "Histórico completo, vistoria e documentação conferida"
    },
    {
      icon: <CircleDollarSign className="w-8 h-8" />,
      title: "Financiamento Facilitado",
      description: "Parceiros com as melhores taxas do mercado"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Garantia Mecânica",
      description: "Opção de garantia estendida para maior tranquilidade"
    },
    {
      icon: <Key className="w-8 h-8" />,
      title: "Troca Segura",
      description: "Sistema de troca com avaliação justa e transparente"
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80"
            alt="Luxury car"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo/Icon */}
            <motion.div
              className="inline-block mb-8"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-2xl shadow-red-500/30">
                <Car className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-orange-400 to-yellow-500">
                PubliMotors
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
              O caminho para o seu próximo veículo
            </p>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
              Milhares de carros, motos, caminhões e utilitários esperando por você.
              Compra, venda e troca com segurança e praticidade.
            </p>

            {/* Search Bar */}
            <motion.div
              className="max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
                <div className="flex-1 flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por marca, modelo ou palavra-chave..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                  />
                </div>
                <div className="flex gap-4">
                  <select className="bg-white/10 text-white rounded-xl px-4 py-3 outline-none border border-white/10">
                    <option value="">Tipo</option>
                    <option value="car">Carros</option>
                    <option value="moto">Motos</option>
                    <option value="truck">Caminhões</option>
                  </select>
                  <button className="px-8 py-3 bg-linear-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all">
                    Buscar
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              {[
                { value: "15.490+", label: "Veículos" },
                { value: "8.200+", label: "Vendedores" },
                { value: "R$ 2B+", label: "Negociados" },
                { value: "4.8★", label: "Avaliação" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-red-400 to-orange-400">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Encontre por <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-400">Categoria</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Navegue pelas categorias e encontre o veículo ideal para você
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicleCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl cursor-pointer"
              >
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-linear-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                </div>
                
                <div className="relative p-8 h-80 flex flex-col justify-between">
                  <div className="text-white/80 group-hover:text-white transition-colors">
                    {category.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                    <p className="text-white/70 text-sm mb-4">{category.count}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.slice(0, 3).map((sub) => (
                        <span key={sub} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-24 px-4 bg-linear-to-b from-transparent via-red-950/10 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Veículos em <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-400">Destaque</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Selecionados especialmente para você
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-linear-to-b from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {vehicle.featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-linear-to-r from-red-600 to-orange-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Destaque
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                    {vehicle.title}
                  </h3>
                  
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-400 to-orange-400 mb-4">
                    {vehicle.price}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {vehicle.year}
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3 h-3" />
                      {vehicle.km}
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="w-3 h-3" />
                      {vehicle.fuel}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {vehicle.location.split(',')[0]}
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-white/10 hover:bg-red-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                    Ver Detalhes
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/buscar"
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-red-600 to-orange-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-red-500/30 transition-all"
            >
              Ver Todos os Veículos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Por que escolher a <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-400">PubliMotors</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-linear-to-b from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-red-500/30 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-red-600/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6 text-red-400">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-linear-to-r from-red-600 to-orange-500 p-12 md:p-20"
          >
            <div className="relative text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Pronto para Anunciar seu Veículo?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Alcance milhares de compradores interessados. Anunciar é rápido, fácil e os primeiros 30 dias são por nossa conta!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/postar"
                  className="px-10 py-4 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-all text-lg"
                >
                  Anunciar Agora
                </Link>
                <Link
                  href="/como-funciona"
                  className="px-10 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/30 transition-all text-lg border border-white/30"
                >
                  Como Funciona
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="text-center py-12">
        <Link 
          href="/" 
          className="text-gray-400 hover:text-red-400 transition-colors inline-flex items-center gap-2"
        >
          ← Voltar ao PubliMicro
        </Link>
      </div>
    </main>
  );
}
