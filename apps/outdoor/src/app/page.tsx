"use client";

import { motion } from 'framer-motion';
import { 
  Ship, Fish, Compass, Waves, Anchor, Sailboat,
  Mountain, Tent, Binoculars, Wind, Sun, TreePine,
  ArrowRight, MapPin, Star, Users, Trophy, Target
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OutdoorPage() {
  const categories = [
    {
      icon: <Ship className="w-12 h-12" />,
      title: "Náutica",
      description: "Barcos, lanchas, jet skis e equipamentos náuticos novos e usados",
      image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&q=80",
      color: "from-blue-600 to-cyan-500",
      items: "850+ anúncios"
    },
    {
      icon: <Fish className="w-12 h-12" />,
      title: "Pesca Esportiva",
      description: "Equipamentos, varas, iscas e acessórios para pescadores profissionais",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
      color: "from-green-600 to-emerald-500",
      items: "620+ produtos"
    },
    {
      icon: <Tent className="w-12 h-12" />,
      title: "Camping & Trilhas",
      description: "Barracas, mochilas, equipamentos de camping e trekking",
      image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80",
      color: "from-orange-600 to-yellow-500",
      items: "940+ itens"
    },
    {
      icon: <Mountain className="w-12 h-12" />,
      title: "Aventura Radical",
      description: "Escalada, rapel, mountain bike, caiaque e esportes radicais",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&q=80",
      color: "from-red-600 to-pink-500",
      items: "730+ equipamentos"
    }
  ];

  const featuredBoats = [
    {
      name: "Lancha Phantom 303",
      type: "Lancha de Pesca",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
      price: "R$ 185.000",
      year: "2022",
      location: "Angra dos Reis - RJ"
    },
    {
      name: "Veleiro Jeanneau 349",
      type: "Veleiro",
      image: "https://images.unsplash.com/photo-1544551763-92f66d5c0d5e?w=600&q=80",
      price: "R$ 420.000",
      year: "2021",
      location: "Florianópolis - SC"
    },
    {
      name: "Jet Ski Sea-Doo GTX",
      type: "Jet Ski",
      image: "https://images.unsplash.com/photo-1624647506399-ffa1b1c55807?w=600&q=80",
      price: "R$ 45.000",
      year: "2023",
      location: "Salvador - BA"
    },
    {
      name: "Bote Inflável Zodiac",
      type: "Bote",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
      price: "R$ 12.500",
      year: "2023",
      location: "Rio de Janeiro - RJ"
    }
  ];

  const activities = [
    {
      icon: <Fish className="w-10 h-10" />,
      title: "Pesca Oceânica",
      description: "Equipamentos profissionais para pesca em alto mar"
    },
    {
      icon: <Waves className="w-10 h-10" />,
      title: "Surf & Kitesurf",
      description: "Pranchas, pipas e acessórios para esportes aquáticos"
    },
    {
      icon: <Mountain className="w-10 h-10" />,
      title: "Montanhismo",
      description: "Cordas, mosquetões e equipamentos de escalada"
    },
    {
      icon: <Binoculars className="w-10 h-10" />,
      title: "Observação",
      description: "Binóculos, lunetas e câmeras para natureza"
    },
    {
      icon: <TreePine className="w-10 h-10" />,
      title: "Caça & Tiro",
      description: "Equipamentos legalizados para caça esportiva"
    },
    {
      icon: <Target className="w-10 h-10" />,
      title: "Arco & Flecha",
      description: "Arcos, flechas e alvos para arqueiros"
    }
  ];

  const benefits = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Vendedores Verificados",
      description: "Todos os anunciantes passam por validação"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Avaliações Reais",
      description: "Sistema de reviews de compradores"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Comunidade Ativa",
      description: "+50 mil entusiastas outdoor"
    }
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/70 via-cyan-900/50 to-green-900/70 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80"
          alt="Outdoor Background"
          fill
          className="object-cover"
          priority
        />
        
        {/* Animated waves effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-20">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <motion.path
              animate={{
                d: [
                  "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,213.3C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,144C960,117,1056,107,1152,122.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ]
              }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              fill="rgba(6, 182, 212, 0.3)"
            />
          </svg>
        </div>
        
        <div className="relative z-30 text-center px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/30 backdrop-blur-sm rounded-full border border-cyan-400/50 mb-6">
              <Waves className="w-5 h-5 text-cyan-300" />
              <span className="text-cyan-200 font-semibold">Aventuras Sem Limites</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl">
              Publi<span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">Outdoor</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-cyan-200 font-bold mb-4">
              Náutica, Pesca e Aventuras ao Ar Livre
            </p>
            
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10">
              Marketplace especializado em equipamentos náuticos, pesca esportiva, camping, trilhas e aventura radical. 
              Compre, venda e alugue com segurança.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/outdoor/explorar"
                className="group px-10 py-5 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
              >
                <Compass className="w-6 h-6" />
                Explorar Produtos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/outdoor/anunciar"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold rounded-full text-lg transform hover:scale-105 transition-all"
              >
                Anunciar Grátis
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#E6C98B] to-[#D4A574] mb-4">
              Categorias em Destaque
            </h2>
            <p className="text-xl text-[#8B9B6E]">
              Encontre o equipamento perfeito para sua próxima aventura
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl h-96 cursor-pointer"
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                <div className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-70 group-hover:opacity-80 transition-opacity`} />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 inline-block mb-4 w-fit border border-white/20">
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
                    {category.title}
                  </h3>
                  
                  <p className="text-white/95 text-lg mb-3 max-w-md">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/90 font-semibold text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      {category.items}
                    </span>
                    
                    <div className="flex items-center text-white font-bold">
                      Ver Tudo
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Boats */}
      <section className="py-20 px-4 bg-linear-to-b from-[#0f1419] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-16"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#E6C98B] to-[#D4A574] mb-4">
                Embarcações em Destaque
              </h2>
              <p className="text-xl text-[#8B9B6E]">
                Barcos e jet skis selecionados para você
              </p>
            </div>
            
            <Link 
              href="/outdoor/nautica"
              className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Ver Todas
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {featuredBoats.map((boat, index) => (
              <motion.div
                key={boat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-[#1a1a1a] border border-[#2a2a2a] hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                <div className="relative h-52">
                  <Image
                    src={boat.image}
                    alt={boat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Anchor className="w-3 h-3" />
                    {boat.year}
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="text-[#8B9B6E] text-sm mb-2 flex items-center gap-1">
                    <Ship className="w-4 h-4" />
                    {boat.type}
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#E6C98B] mb-3 line-clamp-1">
                    {boat.name}
                  </h3>
                  
                  <p className="text-[#676767] text-sm mb-3 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {boat.location}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#E6C98B] to-[#D4A574]">
                      {boat.price}
                    </span>
                    <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#E6C98B] to-[#D4A574] mb-4">
              Atividades & Equipamentos
            </h2>
            <p className="text-xl text-[#8B9B6E]">
              Para todos os tipos de aventureiros
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-green-500/50 rounded-2xl p-8 transition-all hover:scale-105 cursor-pointer"
              >
                <div className="inline-flex p-4 bg-linear-to-br from-green-500/20 to-emerald-500/20 rounded-2xl mb-4">
                  <div className="text-green-400">
                    {activity.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-[#E6C98B] mb-3">
                  {activity.title}
                </h3>
                
                <p className="text-[#8B9B6E]">
                  {activity.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-linear-to-b from-[#0a0a0a] to-[#0f1419]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-5 bg-linear-to-br from-cyan-500/20 to-blue-500/20 rounded-full mb-4 border border-cyan-500/30">
                  <div className="text-cyan-400">
                    {benefit.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#E6C98B] mb-2">
                  {benefit.title}
                </h3>
                
                <p className="text-[#8B9B6E]">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-linear-to-r from-cyan-600 via-blue-600 to-green-600 rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/30" />
            
            <div className="relative z-10">
              <Sailboat className="w-20 h-20 text-white mx-auto mb-6" />
              
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Pronto para a Aventura?
              </h2>
              
              <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Anuncie seus equipamentos ou encontre o que precisa para explorar a natureza
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/outdoor/anunciar"
                  className="inline-flex items-center gap-2 px-10 py-5 bg-white text-cyan-600 font-black rounded-full text-lg shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all"
                >
                  Anunciar Agora
                  <ArrowRight className="w-6 h-6" />
                </Link>
                
                <Link
                  href="/outdoor/cadastro"
                  className="inline-flex items-center gap-2 px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white font-bold rounded-full text-lg transform hover:scale-105 transition-all"
                >
                  Criar Conta Grátis
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 px-4 border-t border-[#2a2a2a]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#676767] text-sm">
            ⚓ <strong>Em Desenvolvimento:</strong> PubliOutdoor está sendo desenvolvido para conectar aventureiros e entusiastas do outdoor. 
            Cadastre-se para receber atualizações sobre o lançamento oficial!
          </p>
        </div>
      </section>
    </main>
  );
}
