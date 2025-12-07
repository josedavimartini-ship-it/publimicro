"use client";

import { motion } from 'framer-motion';
import { 
  ShoppingBag, Package, Smartphone, Laptop, Home, Car,
  Shirt, Baby, Wrench, Book, Music, Dumbbell,
  ArrowRight, Star, TrendingUp, Shield, Zap, Users,
  Heart, Gift, Sparkles, Search, Tag, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function TudoPage() {
  const mainCategories = [
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Eletrônicos",
      count: "12.450 anúncios",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80",
      color: "from-blue-600 to-cyan-500",
      subcategories: ["Celulares", "Notebooks", "TVs", "Áudio"]
    },
    {
      icon: <Home className="w-12 h-12" />,
      title: "Casa & Decoração",
      count: "8.920 produtos",
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80",
      color: "from-orange-600 to-red-500",
      subcategories: ["Móveis", "Decoração", "Jardim", "Cozinha"]
    },
    {
      icon: <Shirt className="w-12 h-12" />,
      title: "Moda & Beleza",
      count: "15.780 itens",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
      color: "from-pink-600 to-purple-500",
      subcategories: ["Roupas", "Calçados", "Acessórios", "Cosméticos"]
    },
    {
      icon: <Car className="w-12 h-12" />,
      title: "Veículos",
      count: "4.320 anúncios",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80",
      color: "from-red-600 to-orange-500",
      subcategories: ["Carros", "Motos", "Peças", "Acessórios"]
    },
    {
      icon: <Dumbbell className="w-12 h-12" />,
      title: "Esportes",
      count: "6.540 produtos",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
      color: "from-green-600 to-emerald-500",
      subcategories: ["Fitness", "Ciclismo", "Futebol", "Natação"]
    },
    {
      icon: <Baby className="w-12 h-12" />,
      title: "Infantil",
      count: "7.210 itens",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80",
      color: "from-yellow-600 to-orange-500",
      subcategories: ["Brinquedos", "Roupas", "Móveis", "Livros"]
    }
  ];

  const trendingProducts = [
    {
      name: "iPhone 15 Pro Max 256GB",
      category: "Eletrônicos",
      image: "https://images.unsplash.com/photo-1592286927505-e33292ae8c2f?w=600&q=80",
      price: "R$ 6.499",
      originalPrice: "R$ 7.999",
      discount: "19% OFF",
      rating: 4.9,
      sold: 127
    },
    {
      name: "Smart TV 65'' 4K Samsung",
      category: "Eletrônicos",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80",
      price: "R$ 3.299",
      originalPrice: "R$ 4.499",
      discount: "27% OFF",
      rating: 4.8,
      sold: 89
    },
    {
      name: "Sofá 3 Lugares Retrátil",
      category: "Casa & Decoração",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
      price: "R$ 1.899",
      originalPrice: "R$ 2.999",
      discount: "37% OFF",
      rating: 4.7,
      sold: 63
    },
    {
      name: "Tênis Nike Air Max 270",
      category: "Moda",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      price: "R$ 599",
      originalPrice: "R$ 899",
      discount: "33% OFF",
      rating: 4.9,
      sold: 241
    }
  ];

  const features = [
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Compra Segura",
      description: "Proteção em todas as transações com sistema antifraude"
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Entrega Rápida",
      description: "Parceria com principais transportadoras do Brasil"
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Vendedores Verificados",
      description: "Todos passam por processo de validação rigoroso"
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Favoritos",
      description: "Salve produtos e receba alertas de preço"
    },
    {
      icon: <Gift className="w-10 h-10" />,
      title: "Programa de Pontos",
      description: "Ganhe recompensas a cada compra realizada"
    },
    {
      icon: <CheckCircle className="w-10 h-10" />,
      title: "Garantia Estendida",
      description: "Proteção adicional para seus produtos"
    }
  ];

  const stats = [
    { value: "2.5M+", label: "Produtos Ativos" },
    { value: "850K+", label: "Usuários" },
    { value: "15K+", label: "Vendas/Dia" },
    { value: "4.8", label: "Avaliação Média" }
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-900/40 via-blue-900/30 to-pink-900/40 z-10" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 z-10 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating product images */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl hidden lg:block"
        >
          <Image src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80" alt="Product" fill className="object-cover" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-20 right-10 w-40 h-40 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl hidden lg:block"
        >
          <Image src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" alt="Product" fill className="object-cover" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-32 w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl hidden lg:block"
        >
          <Image src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80" alt="Product" fill className="object-cover" />
        </motion.div>
        
        <div className="relative z-20 text-center px-4 max-w-6xl py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm rounded-full border border-purple-400/50 mb-6">
              <Sparkles className="w-5 h-5 text-purple-300" />
              <span className="text-purple-200 font-semibold">Tudo em Um Só Lugar</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl">
              Publi<span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-blue-400">Tudo</span>
            </h1>
            
            <p className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-300 to-pink-300">
                Marketplace Geral & Serviços
              </span>
            </p>
            
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10">
              De eletrônicos a móveis, de moda a veículos. Milhões de produtos com os melhores preços, 
              entrega rápida e compra 100% segura.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="O que você está procurando?"
                  className="w-full py-5 pl-16 pr-6 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-full text-white placeholder-gray-300 text-lg focus:outline-none focus:border-purple-400 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-full transition-all">
                  Buscar
                </button>
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tudo/explorar"
                className="group px-10 py-5 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-6 h-6" />
                Explorar Produtos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/tudo/vender"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold rounded-full text-lg transform hover:scale-105 transition-all"
              >
                Vender Agora
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-linear-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#E6C98B] to-[#D4A574] mb-2">
                  {stat.value}
                </div>
                <div className="text-[#8B9B6E] font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#E6C98B] to-[#D4A574] mb-4">
              Categorias Principais
            </h2>
            <p className="text-xl text-[#8B9B6E]">
              Navegue pelas categorias mais populares
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {mainCategories.map((category, index) => (
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
                
                <div className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-70 group-hover:opacity-80 transition-opacity`} />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 inline-block mb-3 w-fit border border-white/20">
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-2">
                    {category.title}
                  </h3>
                  
                  <p className="text-white/90 font-semibold mb-3">
                    {category.count}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.subcategories.map(sub => (
                      <span key={sub} className="text-xs px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90">
                        {sub}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-white font-bold">
                    Explorar
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 px-4 bg-linear-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-16"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-8 h-8 text-pink-400" />
                <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#E6C98B] to-[#D4A574]">
                  Produtos em Alta
                </h2>
              </div>
              <p className="text-xl text-[#8B9B6E]">
                Os mais vendidos da semana com descontos especiais
              </p>
            </div>
            
            <Link 
              href="/tudo/ofertas"
              className="hidden md:flex items-center gap-2 text-pink-400 hover:text-pink-300 font-semibold transition-colors"
            >
              Ver Todas Ofertas
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {trendingProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-[#1a1a1a] border border-[#2a2a2a] hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="relative h-56">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {product.discount}
                  </div>
                  <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Heart className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                
                <div className="p-5">
                  <div className="text-[#8B9B6E] text-sm mb-2 flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {product.category}
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#E6C98B] mb-3 line-clamp-2 h-14">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-white font-semibold text-sm">{product.rating}</span>
                    </div>
                    <span className="text-[#676767] text-sm">({product.sold} vendidos)</span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-[#676767] text-sm line-through mb-1">
                      {product.originalPrice}
                    </div>
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#E6C98B] to-[#D4A574]">
                      {product.price}
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all transform hover:scale-105">
                    Comprar Agora
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#E6C98B] to-[#D4A574] mb-4">
              Por Que Escolher PubliTudo?
            </h2>
            <p className="text-xl text-[#8B9B6E]">
              Benefícios exclusivos para comprar e vender com segurança
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-purple-500/50 rounded-2xl p-8 transition-all hover:scale-105 cursor-pointer text-center"
              >
                <div className="inline-flex p-5 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-4 border border-purple-500/30">
                  <div className="text-purple-400">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-[#E6C98B] mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-[#8B9B6E]">
                  {feature.description}
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
            className="bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/30" />
            
            <div className="relative z-10">
              <Sparkles className="w-20 h-20 text-white mx-auto mb-6" />
              
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Comece a Vender Hoje Mesmo
              </h2>
              
              <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Cadastre-se gratuitamente e alcance milhões de compradores em todo o Brasil
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/tudo/vender"
                  className="inline-flex items-center gap-2 px-10 py-5 bg-white text-purple-600 font-black rounded-full text-lg shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all"
                >
                  <Package className="w-6 h-6" />
                  Anunciar Produto
                  <ArrowRight className="w-6 h-6" />
                </Link>
                
                <Link
                  href="/tudo/cadastro"
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
            🛍️ <strong>Em Desenvolvimento:</strong> PubliTudo está sendo desenvolvido para ser o maior marketplace do Brasil. 
            Cadastre-se para receber atualizações sobre ofertas exclusivas e o lançamento oficial!
          </p>
        </div>
      </section>
    </main>
  );
}
