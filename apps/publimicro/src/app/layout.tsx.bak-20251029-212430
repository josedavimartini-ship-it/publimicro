import { TopNav } from "@publimicro/ui";
import WhatsAppButton from "@/components/WhatsAppButton";
import WorldRegionsSidebar from "@/components/WorldRegionsSidebar";
import "./globals.css";

export const metadata = {
  title: "PubliMicro  O Ecossistema Completo de Negócios",
  description: "Do campo à cidade, do local ao global. Imóveis, veículos, máquinas, serviços e muito mais.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0a0a0a] text-[#e6c86b] antialiased">
        <TopNav brand="PubliMicro" brandHref="/" searchTarget="local" />
        <WorldRegionsSidebar />
        {/* Global wrapper: reserve space for RIGHT fixed sidebar (w-64 = 256px) */}
        <main className="relative mr-64">{children}</main>
        <WhatsAppButton />
      </body>
    </html>
  );
}
