"use client";

import { useState, useEffect } from "react";
import { Phone } from "lucide-react";

export default function FloatingWhatsApp() {
  // Always visible by default (user requested persistent presence).
  // Keep this component client-side for window/interaction behavior.

  const whatsappNumber = "5534992610004";
  const defaultMessage = "Olá! Gostaria de saber mais sobre as propriedades disponíveis.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-2xl transition-all duration-200 group"
      }
      aria-label="Fale conosco no WhatsApp"
      title="Fale conosco no WhatsApp"
    >
      {/* Icon container - compact on small screens */}
      <div className="relative flex items-center justify-center p-3 md:p-4">
        <Phone className="w-5 h-5 md:w-6 md:h-6" />
        {/* Pulse animation (behind icon) */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping -z-10"></span>
      </div>

      {/* Text - hidden on small screens, visible on md+ */}
      <span className="hidden md:inline-block pr-4 pl-1 font-bold whitespace-nowrap">
        Fale Conosco
      </span>

      {/* Notification badge */}
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
    </a>
  );
}
