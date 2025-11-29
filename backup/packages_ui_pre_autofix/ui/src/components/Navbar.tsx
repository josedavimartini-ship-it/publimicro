"use client";
import React from "react";
import Link from "next/link";
import { Heart, Upload, User } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full bg-black text-yellow-500 shadow-md sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-yellow-500">Publi</span>
          <span className="text-yellow-600">Micro</span>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/favoritos" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <Heart size={18} />
            <span>Favoritos</span>
          </Link>
          <Link href="/postar" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <Upload size={18} />
            <span>Anunciar</span>
          </Link>
          <Link href="/conta" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <User size={18} />
            <span>Conta</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}