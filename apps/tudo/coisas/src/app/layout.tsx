import "./globals.css"
export const metadata = {{ title: "Publimicro — coisas / coisas" }}
export default function RootLayout({{ children }}: {{ children: React.ReactNode }}) {{
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0f1110] text-[#e6c86b]">
        <header className="sticky top-0 z-50 bg-[#162017]/80 backdrop-blur-sm border-b border-[#2a2a2a]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-extrabold text-emerald-300">Publimicro</a>
            <nav className="flex gap-4 text-sm">
              <a href="#" className="hover:text-amber-500">Anuncie</a>
              <a href="#" className="hover:text-amber-500">Favoritos</a>
              <a href="#" className="hover:text-amber-500">Conta</a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="py-6 text-center text-sm text-[#cfc08a] border-t border-[#222] mt-8">
          © {{new Date().getFullYear()}} Publimicro — todos os direitos reservados.
        </footer>
      </body>
    </html>
  )
}}
