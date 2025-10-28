import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || '/';
export const metadata: Metadata = {
  title: "Publimicro — Journey",
  description: "Explore experiências e jornadas únicas no ecossistema Publimicro",
  keywords: ["publimicro", "journey", "experiências", "explorar", "inovação"],
  authors: [{ name: "Publimicro" }],
  openGraph: {
    title: "Publimicro — Journey",
    description: "Explore experiências e jornadas únicas no ecossistema Publimicro",
    type: "website",
    locale: "pt_BR",
    siteName: "Publimicro Journey",
  },
  twitter: {
    card: "summary_large_image",
    title: "Publimicro — Journey",
    description: "Explore experiências e jornadas únicas no ecossistema Publimicro",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = [
    { href: "/explorar", label: "Explorar" },
    { href: "/experiencias", label: "Experiências" },
    { href: "/sobre", label: "Sobre" },
  ];

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--muted)] antialiased flex flex-col">
        {/* Sticky header with improved accessibility */}
                <div className="bg-[#0b0b0b] border-b border-[#2a2a2a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-sm">
            <a href={HOME_URL} className="text-amber-500 hover:text-amber-400">← Home Publimicro</a>
          </div>
        </div><header 
          className="sticky top-0 z-50 bg-[#162017]/90 backdrop-blur-md border-b border-[#2a2a2a] shadow-lg"
          role="banner"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <Link 
              href="/" 
              className="text-lg sm:text-xl font-bold text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[#162017] rounded-sm"
              aria-label="Voltar para página inicial do Publimicro Journey"
            >
              <span className="flex items-center gap-2">
                <svg 
                  className="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                Publimicro Journey
              </span>
            </Link>
            
            <nav aria-label="Navegação principal">
              <ul className="flex items-center gap-4 sm:gap-6">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm sm:text-base text-[var(--accent-dark)] hover:text-[var(--accent-light)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[#162017] rounded-sm px-2 py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1" role="main">
          {children}
        </main>

        {/* Enhanced footer */}
        <footer 
          className="border-t border-[#2a2a2a] bg-[#0b0b0b] py-8 mt-auto"
          role="contentinfo"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-[var(--accent-dark)]">
                  © {new Date().getFullYear()} Publimicro. Todos os direitos reservados.
                </p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Construindo o futuro, uma jornada por vez.
                </p>
              </div>
              
              <nav aria-label="Links do rodapé" className="flex gap-6 text-sm">
                <Link 
                  href="/privacidade"
                  className="text-[var(--accent-dark)] hover:text-[var(--accent-light)] transition-colors"
                >
                  Privacidade
                </Link>
                <Link 
                  href="/termos"
                  className="text-[var(--accent-dark)] hover:text-[var(--accent-light)] transition-colors"
                >
                  Termos
                </Link>
                <Link 
                  href="/contato"
                  className="text-[var(--accent-dark)] hover:text-[var(--accent-light)] transition-colors"
                >
                  Contato
                </Link>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
