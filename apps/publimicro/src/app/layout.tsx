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
            <ToastProvider>
              <a href="#main-content" className="skip-to-content sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 z-50 bg-[#A8C97F] text-black font-bold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#B7791F]" tabIndex={0} aria-label="Pular para o conteúdo principal">Pular para o conteúdo</a>
              <TopNavWithAuth brand="ACHEME" brandHref="/" searchTarget="local" />
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
