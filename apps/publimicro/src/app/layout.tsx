import { FloatingWhatsApp } from "@publimicro/ui";
import FloatingWhatsAppWrapper from "@/components/FloatingWhatsAppWrapper";
// Navbar removed from top-level layout to avoid unused import
import UserQuickPanel from "@/components/UserQuickPanel";
import BackToTop from "@/components/BackToTop";
import MobileBottomNav from "@/components/MobileBottomNav";
// ToastProvider not used here (kept in providers) to avoid unused import
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import Providers from './providers';
import ErrorBoundaryWrapper from "@/components/ErrorBoundary";
import { AuthProvider } from "@/components/AuthProvider";
import { TopNavWithAuth } from "@/components/TopNavWithAuth";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "ACHEME – Find Properties, Vehicles & More Worldwide | International Marketplace",
  description: "Global marketplace connecting buyers and sellers worldwide. Find properties, vehicles, machinery, and more. Secure bidding system, verified listings. Your trusted international platform.",
  keywords: "international marketplace, properties worldwide, vehicles for sale, global auctions, real estate international, ACHEME, find for me, acheme.com",
  authors: [{ name: "ACHEME" }],
  creator: "ACHEME",
  publisher: "ACHEME",
  robots: "index, follow",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://acheme.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["pt_BR", "es_ES"],
    url: "https://acheme.com",
    title: "ACHEME – Find For Me | Global Marketplace",
    description: "International marketplace for properties, vehicles, and more. Connecting buyers and sellers worldwide with secure transactions.",
    siteName: "ACHEME",
    images: [
      {
        url: "/og-image-acheme.jpg",
        width: 1200,
        height: 630,
        alt: "ACHEME - Global Marketplace Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ACHEME – Find For Me",
    description: "Global marketplace for properties, vehicles, and more. Trusted worldwide.",
    images: ["/og-image-acheme.jpg"],
    creator: "@acheme"
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code"
  },
  alternates: {
    canonical: "https://acheme.com"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        
        {/* Performance: Resource Hints */}
        <link rel="preconnect" href="https://irrzpwzyqcubhhjeuakc.supabase.co" />
        <link rel="dns-prefetch" href="https://irrzpwzyqcubhhjeuakc.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        
        {/* PWA Theme Colors */}
        {/* Burnt gold/bronze - light and smooth for the eyes */}
        <meta name="theme-color" content="#D4A574" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#B8936D" media="(prefers-color-scheme: dark)" />
        <meta name="msapplication-TileColor" content="#D4A574" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script src="/register-sw.js" defer></script>
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-[#E6C98B] antialiased" aria-label="ACHEME Global Marketplace" role="document">
        <ErrorBoundaryWrapper>
          <AuthProvider>
              <Providers>
                {/* Skip to content link for keyboard navigation (WCAG 2.4.1) */}
                <a 
                  href="#main-content" 
                  className="skip-to-content sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 z-[100] bg-[#D4AF37] text-[#0a0a0a] font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0a0a0a] transition-all" 
                  tabIndex={0} 
                  aria-label="Pular para o conteúdo principal"
                >
                  Pular para o conteúdo
                </a>
                
                {/* Live region for screen reader announcements (WCAG 4.1.3) */}
                <div 
                  id="live-region" 
                  aria-live="polite" 
                  aria-atomic="true" 
                  className="sr-only"
                />
                
                <TopNavWithAuth brand="ACHEME" brandHref="/" searchTarget="local" />
                <div className="flex min-h-[calc(100vh-4rem)]">
                  <Sidebar side="left" />
                  <main id="main-content" role="main" tabIndex={-1} className="flex-1 min-w-0 focus:outline-none">
                    {children}
                  </main>
                  <Sidebar side="right" />
                </div>
                <UserQuickPanel />
                <FloatingWhatsAppWrapper />
                <BackToTop />
                <MobileBottomNav />
                <PWAInstallPrompt />
              </Providers>
          </AuthProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}







