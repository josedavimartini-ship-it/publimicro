import "./globals.css";

export const metadata = { title: "Publimicro — global" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-black text-gray-100">
        {children}
      </body>
    </html>
  );
}