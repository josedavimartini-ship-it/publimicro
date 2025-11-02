import { TopNav, FloatingWhatsApp } from "@publimicro/ui";
import "./globals.css";

export const metadata = { title: "PubliProper — Imóveis" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0a0a0a] text-[#e6c86b]">
        <TopNav brand="PubliProper" brandHref="/" searchTarget="main" />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
