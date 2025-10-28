// packages/ui/src/components/Navbar.tsx
"use client";
import React from "react";
import Link from "next/link";
import { Heart, Upload, User } from "lucide-react";
import theme from "../theme";

export function Navbar() {
  return (
    <nav className={`w-full ${theme.classes.cardBg} text-[#cfa847] shadow-md sticky top-0 z-50`}>
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-[#cfa847]">Publi</span>
          <span className="text-[#bfa97a]">Micro</span>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/favoritos" className="flex items-center gap-1 hover:text-[#b89236] transition-colors">
            <Heart size={18} />
            <span>Favoritos</span>
          </Link>
          <Link href="/postar" className="flex items-center gap-1 hover:text-[#b89236] transition-colors">
            <Upload size={18} />
            <span>Anunciar</span>
          </Link>
          <Link href="/conta" className="flex items-center gap-1 hover:text-[#b89236] transition-colors">
            <User size={18} />
            <span>Conta</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
