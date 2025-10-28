import SharedHeader from './components/SharedHeader';
import "./globals.css"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PubliMicro — Classificados e Negócios",
  description: "Encontre imóveis, veículos, equipamentos e serviços em todo o Brasil",
}

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen bg-[#0f1110] text-[#e6c86b]">
        <SharedHeader />

        {/* Top header / global navigation */}
        <header className="sticky top-0 z-50 bg-[#162017]/80 backdrop-blur-sm border-b border-[#2a2a2a]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <Link href="/" className="font-extrabold text-emerald-300 text-lg">
                Publimicro
              </Link>

              {/* Primary nav - shows on md+ */}
              <nav aria-label="Main navigation" className="hidden md:flex items-center gap-4 text-sm">
                <a href="https://proper.publimicro.com.br" className="hover:text-amber-500">Publiproper</a>
                <a href="https://motors.publimicro.com.br" className="hover:text-amber-500">PubliMotors</a>
                <a href="https://machina.publimicro.com.br" className="hover:text-amber-500">PubliMachina</a>
                <Link href="/business" className="hover:text-amber-500">For Businesses</Link>
                <Link href="/catalogs" className="hover:text-amber-500">Catalogs</Link>
                <Link href="/blog" className="hover:text-amber-500">Blog</Link>
              </nav>
            </div>

            {/* Search (centralized on wide screens) */}
            <form
              action="/search"
              method="get"
              role="search"
              className="flex-1 max-w-2xl mx-6 hidden md:flex items-center bg-[#0b0c0b]/50 border border-[#242424] rounded-full px-3 py-1"
            >
              <label htmlFor="q" className="sr-only">Pesquisar anúncios</label>
              <input
                id="q"
                name="q"
                placeholder="Buscar imóveis, veículos, serviços, locais..."
                className="bg-transparent placeholder-[#bfa97a] text-sm text-[#e6c86b] flex-1 px-3 py-2 outline-none"
              />
              <Link href="/search/advanced" className="text-sm text-[#bfa97a] hover:text-amber-500 px-3">
                Avançada
              </Link>
              <button
                type="submit"
                aria-label="Pesquisar"
                className="ml-2 rounded-full bg-amber-500/80 hover:bg-amber-500 px-3 py-1 text-black font-semibold text-sm"
              >
                Buscar
              </button>
            </form>

            {/* User actions */}
            <div className="flex items-center gap-3">
              <Link href="/favorites" className="text-sm hover:text-amber-500">Favoritos</Link>
              <Link href="/cart" className="text-sm hover:text-amber-500">Carrinho</Link>
              <Link href="/messages" className="text-sm hover:text-amber-500">Mensagens</Link>
              <Link href="/notifications" className="text-sm hover:text-amber-500">Notificações</Link>

              <Link
                href="/account/login"
                className="hidden sm:inline-block text-sm px-3 py-1 border border-[#2a2a2a] rounded hover:text-amber-500"
              >
                Entrar
              </Link>

              {/* Prominent Post CTA */}
              <Link
                href="/post"
                className="ml-2 inline-flex items-center gap-2 rounded-full bg-amber-500 text-black px-3 py-1 text-sm font-semibold shadow-sm"
                aria-label="Publicar anúncio"
              >
                POST
              </Link>

              {/* Mobile menu (simple, no JS) */}
              <details className="md:hidden">
                <summary className="p-2 rounded-md hover:bg-[#111]">☰</summary>
                <div className="mt-2 p-3 bg-[#0b0b0b] rounded-md flex flex-col gap-2">
                  <a href="https://proper.publimicro.com.br" className="hover:text-amber-500">Publiproper</a>
                  <a href="https://motors.publimicro.com.br" className="hover:text-amber-500">PubliMotors</a>
                  <a href="https://machina.publimicro.com.br" className="hover:text-amber-500">PubliMachina</a>
                  <Link href="/catalogs" className="hover:text-amber-500">Catalogs</Link>
                  <Link href="/blog" className="hover:text-amber-500">Blog</Link>
                  <Link href="/account/login" className="hover:text-amber-500">Entrar</Link>
                </div>
              </details>
            </div>
          </div>

          {/* Small / mobile search bar */}
          <div className="md:hidden px-4 pb-3">
            <form action="/search" method="get" role="search" className="flex items-center gap-2">
              <label htmlFor="q-mobile" className="sr-only">Pesquisar</label>
              <input
                id="q-mobile"
                name="q"
                placeholder="Buscar anúncios..."
                className="flex-1 bg-[#0b0b0b]/60 border border-[#242424] rounded-full px-3 py-2 text-sm text-[#e6c86b]"
              />
              <Link href="/search/advanced" className="text-sm text-[#bfa97a]">Avançada</Link>
            </form>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>

        {/* Footer with helpful links, blog, contact, languages */}
        <footer className="bg-[#0b0b0b] border-t border-[#222] mt-8 text-sm text-[#cfc08a]">
          <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-amber-400 mb-2">Sobre</h3>
              <p className="text-[#bfa97a]">
                Publimicro — marketplace e classificados para imóveis, veículos, máquinas, serviços e oportunidades.
              </p>
              <p className="mt-3">
                <Link href="/contact" className="hover:text-amber-500">Contato</Link> · <Link href="/terms" className="hover:text-amber-500">Termos</Link>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-amber-400 mb-2">Suporte</h3>
              <ul className="space-y-1 text-[#bfa97a]">
                <li><Link href="/help" className="hover:text-amber-500">Central de Ajuda</Link></li>
                <li><Link href="/posting-guide" className="hover:text-amber-500">Como anunciar</Link></li>
                <li><Link href="/safety" className="hover:text-amber-500">Segurança</Link></li>
                <li><Link href="/faq" className="hover:text-amber-500">Perguntas frequentes</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-amber-400 mb-2">Explore</h3>
              <ul className="space-y-1 text-[#bfa97a]">
                <li><Link href="/blog" className="hover:text-amber-500">Blog</Link></li>
                <li><Link href="/destaques" className="hover:text-amber-500">Destaques Premium</Link></li>
                <li><Link href="/map" className="hover:text-amber-500">Mapa Interativo</Link></li>
                <li><Link href="/languages" className="hover:text-amber-500">Idiomas</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#161616]">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
              <p className="text-xs">© {new Date().getFullYear()} Publimicro — todos os direitos reservados.</p>
              <div className="flex items-center gap-4 mt-3 sm:mt-0">
                <Link href="/privacy" className="text-xs hover:text-amber-500">Privacidade</Link>
                <Link href="/sitemap" className="text-xs hover:text-amber-500">Sitemap</Link>
                <form action="/set-language" method="post" className="inline-flex items-center gap-2">
                  <label htmlFor="lang" className="sr-only">Idioma</label>
                  <select name="lang" id="lang" className="bg-transparent text-xs text-[#bfa97a] border border-[#222] rounded px-2 py-1">
                    <option value="pt">PT</option>
                    <option value="en">EN</option>
                    <option value="es">ES</option>
                  </select>
                </form>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Post CTA for quick advertising */}
        <Link
          href="/post"
          aria-label="Publicar anúncio"
          className="fixed right-4 bottom-6 z-50 inline-flex items-center gap-2 rounded-full bg-amber-500 text-black px-4 py-3 font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          POSTAR
        </Link>
      </body>
    </html>
  )
}
