"use client";
import React from "react";
import { theme } from "../theme";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-8 border-t border-gray-800 bg-black text-gray-400">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between gap-4 text-sm">
        <p>© {new Date().getFullYear()} Publimicro — todos os direitos reservados.</p>
        <nav className="flex gap-4">
          <a href="/termos" className="hover:text-gray-300 transition-colors">Termos</a>
          <a href="/privacidade" className="hover:text-gray-300 transition-colors">Privacidade</a>
          <a href="/contato" className="hover:text-gray-300 transition-colors">Contato</a>
        </nav>
      </div>
    </footer>
  );
};