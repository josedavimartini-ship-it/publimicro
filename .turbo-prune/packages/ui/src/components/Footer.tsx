// packages/ui/src/components/Footer.tsx
"use client";
import React from "react";
import theme from "../theme";

export const Footer: React.FC = () => {
  return (
    <footer className={`mt-12 py-8 border-t border-[#2e3b32] ${theme.classes.bg} text-[#bfa97a]`}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between gap-4 text-sm">
        <p>© {new Date().getFullYear()} Publimicro — todos os direitos reservados.</p>
        <nav className="flex gap-4">
          <a href="/termos" className="hover:text-[#cfa847] transition-colors">Termos</a>
          <a href="/privacidade" className="hover:text-[#cfa847] transition-colors">Privacidade</a>
          <a href="/contato" className="hover:text-[#cfa847] transition-colors">Contato</a>
        </nav>
      </div>
    </footer>
  );
};
