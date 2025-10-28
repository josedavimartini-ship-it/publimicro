import "./globals.css";
import { Navbar } from "@publimicro/ui";

export const metadata = {
  title: "Publimotors — veículos e maquinários",
  description: "Classificados de veículos, caminhões, tratores e muito mais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-8">{children}</main>
        <footer className="bg-gray-100 py-6 text-center text-sm text-gray-500 border-t">
          © {new Date().getFullYear()} Publimicro — todos os direitos reservados.
        </footer>
      </body>
    </html>
  );
}
