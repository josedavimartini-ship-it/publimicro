import { TopNav } from "@publimicro/ui";
import "./globals.css";

export const metadata = { 
  title: "AcheMeRuralPropers — Rural Real Estate Marketplace",
  description: "Find Chácaras, Sítios, Fazendas, and Ranchos worldwide"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] text-[#e6c86b]">
        <TopNav brand="AcheMeRuralPropers" brandHref="/" searchTarget="main" />
        {children}
      </body>
    </html>
  );
}
