import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Navbar from "@/components/Navbar";
import UserQuickPanel from "@/components/UserQuickPanel";
import BackToTop from "@/components/BackToTop";
import MobileBottomNav from "@/components/MobileBottomNav";
import { ToastProvider } from "@/components/ToastNotification";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ErrorBoundaryWrapper from "@/components/ErrorBoundary";
import { AuthProvider } from "@/components/AuthProvider";
import { TopNavWithAuth } from "@/components/TopNavWithAuth";
import "./globals.css";

export const metadata = {
  title: "PubliMicro – Leilões de Propriedades Rurais e Urbanas | Sítios Carcará",
  description: "Plataforma oficial de leilões online de propriedades rurais e urbanas. Encontre sítios, fazendas, chácaras e terrenos em Goiás. Lance agora e realize seu sonho!",
  keywords: "leilão de propriedades, sítios à venda, fazendas Goiás, terrenos rurais, leilão online, Sítios Carcará, propriedades rurais",
  authors: [{ name: "PubliMicro" }],
  creator: "PubliMicro",
  publisher: "PubliMicro",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://publimicro.com.br",
    title: "PubliMicro – Leilões de Propriedades Rurais e Urbanas",
    description: "Plataforma de leilões online de propriedades. Encontre sítios, fazendas e terrenos em Goiás. Sistema seguro de lances em tempo real.",
    siteName: "PubliMicro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PubliMicro - Leilões de Propriedades"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "PubliMicro – Leilões de Propriedades",
    description: "Encontre propriedades rurais e urbanas em leilão. Sistema seguro e transparente.",
    images: ["/og-image.jpg"],
    creator: "@publimicro"
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code"
  },
  alternates: {
    canonical: "https://publimicro.com.br"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Moss green with emerald stone details */}
        <meta name="theme-color" content="#6B8E23" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#50C878" media="(prefers-color-scheme: dark)" />
        <meta name="msapplication-TileColor" content="#6B8E23" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script src="/register-sw.js" defer></script>
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-[#E6C98B] antialiased" aria-label="PubliMicro Ecossistema" role="document">
        <ErrorBoundaryWrapper>
          <AuthProvider>
            <ToastProvider>
              <a href="#main-content" className="skip-to-content sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 z-50 bg-[#A8C97F] text-black font-bold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#B7791F]" tabIndex={0} aria-label="Pular para o conteúdo principal">Pular para o conteúdo</a>
              <TopNavWithAuth brand="PubliMicro" brandHref="/" searchTarget="local" />
              {/* Sidebar removed - will implement as dropdown menu later */}
              <main id="main-content" role="main">
                {children}
              </main>
              <UserQuickPanel />
              <FloatingWhatsApp />
              <BackToTop />
              <MobileBottomNav />
              <PWAInstallPrompt />
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
