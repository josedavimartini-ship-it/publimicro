import { TopNav, FloatingWhatsApp } from "@publimicro/ui";
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
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0a0a0a] text-[#e6c86b]">
        <TopNav brand="PubliJourney" brandHref="/" searchTarget="main" />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
