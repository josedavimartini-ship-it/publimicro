"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-50 p-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] rounded-full shadow-2xl hover:scale-110 transition-all hover:from-[#FF8C42] hover:to-[#FF6B35] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/50"
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
    >
      <ArrowUp className="w-6 h-6" strokeWidth={3} />
    </button>
  );
}
