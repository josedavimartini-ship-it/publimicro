import { TopNav } from "@publimicro/ui";
import "./globals.css";

export const metadata = { 
  title: "AcheMeUrbanPropers — Urban Real Estate Marketplace",
  description: "Find apartments, houses, and commercial properties worldwide"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] text-[#e6c86b]">
        <TopNav brand="AcheMeUrbanPropers" brandHref="/" searchTarget="main" />
        {children}
      </body>
    </html>
  );
}
