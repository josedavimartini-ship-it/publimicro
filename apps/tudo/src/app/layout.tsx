export const metadata = {
  title: "Publimicro Tudo",
  description: "Tudo — o bazar de coisas e oportunidades",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
