import { TopNav } from "@publimicro/ui";
import WhatsAppButton from "@/components/WhatsAppButton";
import Navbar from "@/components/Navbar";
import UserQuickPanel from "@/components/UserQuickPanel";
import "./globals.css";

export const metadata = {
  title: "PubliMicro – O Ecossistema Completo de Negócios",
  description: "Do campo à cidade, do local ao global. Imóveis, veículos, máquinas, serviços e muito mais.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Hide 'Anunciar' button on Sítios Carcará landing page
  const isCarcaraLanding = typeof window !== 'undefined' && window.location.pathname.startsWith('/projetos/carcara');
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0a0a0a] text-[#e6c86b] antialiased" aria-label="PubliMicro Ecossistema" role="document">
        <a href="#main-content" className="skip-to-content absolute left-2 top-2 z-50 bg-[#FF6B35] text-black font-bold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#B7791F]" tabIndex={0} aria-label="Pular para o conteúdo principal">Pular para o conteúdo</a>
        <nav aria-label="Navegação principal" role="navigation">
          <div className="flex items-center justify-between w-full">
            <TopNav brand="PubliMicro" brandHref="/" searchTarget="local" />
            {!isCarcaraLanding && (
              <a
                href="/anunciar"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-black font-bold rounded-full shadow-lg hover:scale-105 transition-all mr-6 mt-4 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]"
                aria-label="Anunciar propriedade"
                style={{ position: 'absolute', right: 0, top: 0, zIndex: 100 }}
                tabIndex={0}
                role="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                Anunciar
              </a>
            )}
          </div>
          <Navbar />
        </nav>
        {/* Sidebar removed - will implement as dropdown menu later */}
        <main id="main-content" role="main">
          {children}
        </main>
        <UserQuickPanel />
        <WhatsAppButton />
      </body>
    </html>
  );
}
