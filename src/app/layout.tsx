import "@/styles/globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Publimicro",
  description: "Classificados com curadoria — Publimicro",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="font-bold text-xl">Publimicro</div>

            {/* Menu principal (links importantes) */}
            <nav className="hidden md:flex gap-6 items-center">
              <Link href="/" className="hover:underline">Início</Link>
              <Link href="/imoveis" className="hover:underline">Imóveis</Link>
              <Link href="/classificados" className="hover:underline">Classificados</Link>
              <Link href="/contato" className="hover:underline">Contato</Link>
            </nav>

            {/* Navbar com ícones (busca, favoritos, postar, conta) */}
            <div className="ml-4">
              <Navbar />
            </div>
          </div>
        </header>

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
