"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, Heart, User } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      icon: Home,
      label: "Início",
      href: "/",
      active: pathname === "/"
    },
    {
      icon: Search,
      label: "Buscar",
      href: "/buscar",
      active: pathname === "/buscar" || pathname === "/imoveis"
    },
    {
      icon: Heart,
      label: "Favoritos",
      href: "/favoritos",
      active: pathname === "/favoritos"
    },
    {
      icon: User,
      label: "Conta",
      href: "/conta",
      active: pathname === "/conta" || pathname === "/entrar"
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-[#0a0a0a]/95 border-t-2 border-[#2a2a1a] backdrop-blur-md">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[60px] py-2 px-3 rounded-lg transition-all ${
                item.active
                  ? "text-[#FF6B35] bg-[#FF6B35]/10"
                  : "text-[#676767] hover:text-[#D4A574] active:scale-95"
              }`}
            >
              <Icon 
                className={`w-6 h-6 ${item.active ? "scale-110" : ""}`} 
                strokeWidth={item.active ? 2.5 : 2}
              />
              <span className={`text-xs font-semibold ${item.active ? "font-bold" : ""}`}>
                {item.label}
              </span>
              {item.active && (
                <div className="absolute bottom-0 w-1 h-1 bg-[#FF6B35] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
