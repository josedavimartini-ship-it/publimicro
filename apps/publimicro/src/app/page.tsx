import type { Metadata } from "next"
import Link from "next/link"
import { Heart, MessageCircle, User } from "lucide-react"
import { CarcaraScene } from "../components/CarcaraScene"
import PropertyHighlights from "../components/home/PropertyHighlights"
import WhatsAppButton from "../components/WhatsAppButton"

export const metadata: Metadata = {
  title: "PubliMicro — Classificados e Negócios",
  description: "Encontre imóveis, veículos, equipamentos e serviços. Do campo à cidade, do local ao global.",
  keywords: ["classificados", "imóveis", "veículos", "marketplace", "Brasil"],
}

const mainCategories = [
  { 
    href: "https://proper.publimicro.com.br", 
    icon: "🏘️", 
    title: "Proper", 
    subtitle: "Imóveis Urbanos e Rurais",
    description: "Casas, apartamentos, fazendas e terrenos"
  },
  { 
    href: "https://motors.publimicro.com.br", 
    icon: "🚗", 
    title: "Motors", 
    subtitle: "Veículos e Transporte",
    description: "Carros, motos, caminhões e peças"
  },
  { 
    href: "https://journey.publimicro.com.br", 
    icon: "✈️", 
    title: "Journey", 
    subtitle: "Viagens e Turismo",
    description: "Pacotes, hospedagem e experiências"
  },
  { 
    href: "https://share.publimicro.com.br", 
    icon: "🤝", 
    title: "Share", 
    subtitle: "Compartilhamento",
    description: "Aluguel e economia colaborativa"
  },
  { 
    href: "https://global.publimicro.com.br", 
    icon: "🌍", 
    title: "Global", 
    subtitle: "Negócios Internacionais",
    description: "Importação, exportação e comércio"
  },
  { 
    href: "https://machina.publimicro.com.br", 
    icon: "⚙️", 
    title: "Machina", 
    subtitle: "Máquinas e Equipamentos",
    description: "Industrial, agrícola e construção"
  },
  { 
    href: "https://outdoor.publimicro.com.br", 
    icon: "🏕️", 
    title: "Outdoor", 
    subtitle: "Aventura e Natureza",
    description: "Camping, trilhas e esportes"
  },
  { 
    href: "https://tudo.publimicro.com.br", 
    icon: "🛍️", 
    title: "Tudo", 
    subtitle: "Classificados Gerais",
    description: "Eletrônicos, móveis, serviços e mais"
  },
]

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
        {/* Top Navigation Panel */}
        <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-[#1f1f1f] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16 gap-4">
              
              {/* Logo with Crosshair */}
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="text-2xl font-bold">
                  <span className="text-amber-400">Publi</span>
                  <span className="text-amber-500">Micr</span>
                  <span className="relative inline-block">
                    <span className="text-amber-600">o</span>
                    <svg 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-amber-400"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="3"/>
                      <line x1="12" y1="2" x2="12" y2="7"/>
                      <line x1="12" y1="17" x2="12" y2="22"/>
                      <line x1="2" y1="12" x2="7" y2="12"/>
                      <line x1="17" y1="12" x2="22" y2="12"/>
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Main Search Bar */}
              <form 
                action="/search" 
                method="get"
                className="flex-1 max-w-2xl hidden md:flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="search"
                    name="q"
                    placeholder="Buscar imóveis, veículos, serviços..."
                    className="w-full h-10 pl-4 pr-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-[#e6c86b] placeholder-[#8a8a6a] focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                  <button 
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center transition-colors"
                    aria-label="Buscar"
                  >
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
                <Link 
                  href="/search/advanced"
                  className="text-sm text-[#bfa97a] hover:text-amber-400 whitespace-nowrap"
                >
                  Avançada
                </Link>
              </form>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <Link 
                  href="/favoritos"
                  className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors"
                  aria-label="Favoritos"
                >
                  <Heart className="w-5 h-5 text-[#bfa97a]" />
                </Link>
                
                <Link 
                  href="/mensagens"
                  className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors"
                  aria-label="Mensagens"
                >
                  <MessageCircle className="w-5 h-5 text-[#bfa97a]" />
                </Link>
                
                <Link 
                  href="/conta"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 border border-[#2a2a2a] rounded-full hover:border-amber-500/50 transition-colors"
                >
                  <User className="w-4 h-4 text-[#bfa97a]" />
                  <span className="text-sm text-[#bfa97a]">Conta</span>
                </Link>
                
                <Link
                  href="/anunciar"
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Anunciar</span>
                </Link>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden pb-3">
              <form action="/search" method="get" className="flex items-center gap-2">
                <input
                  type="search"
                  name="q"
                  placeholder="Buscar..."
                  className="flex-1 h-10 px-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-[#e6c86b] placeholder-[#8a8a6a] focus:outline-none focus:border-amber-500/50"
                />
                <button 
                  type="submit"
                  className="h-10 px-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full"
                >
                  Buscar
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Hero Section with Categories */}
        <section className="relative py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Category Grid Around Hero Text */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              
              {/* Left Categories (4) */}
              <div className="lg:col-span-3 space-y-3">
                {mainCategories.slice(0, 4).map((cat) => (
                  <a
                    key={cat.href}
                    href={cat.href}
                    className="group block p-4 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg hover:border-amber-500/50 hover:bg-[#111] transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-amber-400 group-hover:text-amber-300">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-[#8a8a6a] mt-0.5">{cat.subtitle}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Center Hero Text */}
              <div className="lg:col-span-6 text-center flex flex-col justify-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-4">
                  O Ecossistema PubliMicro
                </h1>
                <p className="text-lg text-[#bfa97a] max-w-2xl mx-auto leading-relaxed">
                  Um universo de negócios, tecnologia e oportunidades<br/>
                  <span className="text-amber-500">•</span> Do campo à cidade, do local ao global
                </p>
                
                {/* Quick Post CTA */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/anunciar"
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold rounded-full shadow-lg transition-all hover:scale-105"
                  >
                    📢 Publique seu anúncio grátis
                  </Link>
                  <Link
                    href="/blog"
                    className="px-6 py-3 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 rounded-full transition-colors"
                  >
                    📰 Visite nosso Blog
                  </Link>
                </div>
              </div>

              {/* Right Categories (4) */}
              <div className="lg:col-span-3 space-y-3">
                {mainCategories.slice(4, 8).map((cat) => (
                  <a
                    key={cat.href}
                    href={cat.href}
                    className="group block p-4 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg hover:border-amber-500/50 hover:bg-[#111] transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-amber-400 group-hover:text-amber-300">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-[#8a8a6a] mt-0.5">{cat.subtitle}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Animated Carcará Bird (Smaller) */}
            <div className="mb-8">
              <CarcaraScene />
            </div>
          </div>
        </section>

        {/* Sítios Carcará Super Highlight */}
        <section className="py-12 px-4 sm:px-6 bg-gradient-to-b from-[#0f0f0f] to-[#0d0d0d]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-amber-400 mb-2">
                🦅 Sítios Carcará
              </h2>
              <p className="text-[#bfa97a]">
                Projeto especial de imóveis rurais premium
              </p>
              <Link 
                href="https://proper.publimicro.com.br/rural"
                className="inline-block mt-3 text-amber-500 hover:text-amber-400 underline"
              >
                Ver todos os sítios disponíveis →
              </Link>
            </div>
            
            {/* Carcará properties will be loaded here */}
            <div className="bg-[#0a0a0a] border border-amber-500/20 rounded-xl p-8 text-center">
              <p className="text-[#8a8a6a]">
                Propriedades rurais exclusivas carregando...
              </p>
            </div>
          </div>
        </section>

        {/* Property Highlights */}
        <PropertyHighlights />

        {/* Bottom Info Section */}
        <section className="py-12 px-4 sm:px-6 bg-[#0a0a0a] border-t border-[#1f1f1f]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-semibold text-amber-400 mb-2">Segurança</h3>
                <p className="text-sm text-[#8a8a6a]">
                  Anúncios verificados e transações protegidas
                </p>
              </div>
              <div>
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-semibold text-amber-400 mb-2">Rapidez</h3>
                <p className="text-sm text-[#8a8a6a]">
                  Encontre o que procura em segundos
                </p>
              </div>
              <div>
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="font-semibold text-amber-400 mb-2">Qualidade</h3>
                <p className="text-sm text-[#8a8a6a]">
                  Curadoria premium e suporte dedicado
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#080808] border-t border-[#1f1f1f] py-8 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-amber-400 mb-3">Categorias</h3>
                <ul className="space-y-2 text-sm text-[#8a8a6a]">
                  <li><a href="https://proper.publimicro.com.br" className="hover:text-amber-400">Imóveis</a></li>
                  <li><a href="https://motors.publimicro.com.br" className="hover:text-amber-400">Veículos</a></li>
                  <li><a href="https://machina.publimicro.com.br" className="hover:text-amber-400">Máquinas</a></li>
                  <li><a href="https://tudo.publimicro.com.br" className="hover:text-amber-400">Ver todas</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-amber-400 mb-3">Suporte</h3>
                <ul className="space-y-2 text-sm text-[#8a8a6a]">
                  <li><Link href="/ajuda" className="hover:text-amber-400">Central de Ajuda</Link></li>
                  <li><Link href="/como-anunciar" className="hover:text-amber-400">Como Anunciar</Link></li>
                  <li><Link href="/seguranca" className="hover:text-amber-400">Segurança</Link></li>
                  <li><Link href="/faq" className="hover:text-amber-400">FAQ</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-amber-400 mb-3">Empresa</h3>
                <ul className="space-y-2 text-sm text-[#8a8a6a]">
                  <li><Link href="/sobre" className="hover:text-amber-400">Sobre Nós</Link></li>
                  <li><Link href="/blog" className="hover:text-amber-400">Blog</Link></li>
                  <li><Link href="/contato" className="hover:text-amber-400">Contato</Link></li>
                  <li><Link href="/trabalhe-conosco" className="hover:text-amber-400">Trabalhe Conosco</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-amber-400 mb-3">Legal</h3>
                <ul className="space-y-2 text-sm text-[#8a8a6a]">
                  <li><Link href="/termos" className="hover:text-amber-400">Termos de Uso</Link></li>
                  <li><Link href="/privacidade" className="hover:text-amber-400">Privacidade</Link></li>
                  <li><Link href="/cookies" className="hover:text-amber-400">Cookies</Link></li>
                  <li><Link href="/lgpd" className="hover:text-amber-400">LGPD</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-6 border-t border-[#1f1f1f] text-center text-sm text-[#6a6a6a]">
              <p>© {new Date().getFullYear()} PubliMicro. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </main>

      {/* WhatsApp Floating Button (appears on all pages) */}
      <WhatsAppButton />
    </>
  )
}
