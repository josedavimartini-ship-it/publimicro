"use client";

import { Heart, Upload, User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-proper-darkgray border-b border-proper-moss flex justify-between items-center px-8 py-4 shadow-md">
      <Link href="/" className="text-proper-gold text-2xl font-semibold tracking-wide">
        AcheMePropers
      </Link>

      <div className="flex items-center space-x-8">
        <Link href="/favoritos" className="flex items-center space-x-2 hover:text-proper-gold transition">
          <Heart className="w-5 h-5" />
          <span>Favoritos</span>
        </Link>

        <Link href="/postar" className="flex items-center space-x-2 hover:text-proper-orange transition">
          <Upload className="w-5 h-5" />
          <span>Postar</span>
        </Link>

        <Link href="/conta" className="flex items-center space-x-2 hover:text-proper-teal transition">
          <User className="w-5 h-5" />
          <span>Conta</span>
        </Link>
      </div>
    </nav>
  );
}
