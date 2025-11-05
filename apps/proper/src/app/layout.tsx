import { TopNav, FloatingWhatsApp } from "@publimicro/ui";
import "./globals.css";

export const metadata = { 
  title: "AcheMePropers — Global Real Estate Marketplace",
  description: "Find properties worldwide - apartments, houses, farms, ranches, and more"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] text-[#e6c86b]">
        <TopNav brand="AcheMePropers" brandHref="/" searchTarget="main" />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
