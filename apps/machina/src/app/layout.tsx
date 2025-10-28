import "./globals.css";

export const metadata = { title: "Publimicro — machina" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-900 text-gray-100">
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-bold text-emerald-400">Publimicro</a>
            <nav className="flex gap-4 text-sm">
              <a href="#" className="hover:text-amber-400">Anuncie</a>
              <a href="#" className="hover:text-amber-400">Favoritos</a>
              <a href="#" className="hover:text-amber-400">Conta</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-800 mt-8">
          © {new Date().getFullYear()} Publimicro — todos os direitos reservados.
        </footer>
      </body>
    </html>
  );
}
