"use client";

import { Phone, Lock } from "lucide-react";
import { useState, useEffect } from "react";

interface FloatingWhatsAppProps {
  /** If true, show for all users. If false, only show for verified users */
  showForAll?: boolean;
  /** User verification status - if provided, controls visibility */
  userVerified?: boolean;
  /** Custom phone number (optional) */
  phoneNumber?: string;
  /** Custom message (optional) */
  message?: string;
}

export default function FloatingWhatsApp({
  showForAll = false,
  userVerified,
  phoneNumber = "5534992610004",
  message = "Olá! Gostaria de saber mais sobre as propriedades disponíveis."
}: FloatingWhatsAppProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // If showForAll is true, always show
    if (showForAll) {
      setVisible(true);
      return;
    }
    
    // If userVerified is explicitly passed, use that
    if (userVerified !== undefined) {
      setVisible(userVerified);
      return;
    }
    
    // Default: hide until we know user status
    // The parent layout should pass the verification status
    setVisible(false);
  }, [showForAll, userVerified]);

  // Don't render if not visible
  if (!visible) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-2xl transition-all duration-200 group"
      aria-label="Fale conosco no WhatsApp"
      title="Fale conosco no WhatsApp"
    >
      {/* Icon container */}
      <div className="relative flex items-center justify-center p-3 md:p-4">
        <Phone className="w-5 h-5 md:w-6 md:h-6" />
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping -z-10"></span>
      </div>

      {/* Text - hidden on mobile */}
      <span className="hidden md:inline-block pr-4 pl-1 font-bold whitespace-nowrap">
        Fale Conosco
      </span>

      {/* Notification badge */}
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
    </a>
  );
}

/**
 * Component to show when user is not verified - explains why they can't use WhatsApp
 */
export function WhatsAppLockedMessage() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#2a2a2a] text-[#8B9B6E] rounded-full shadow-lg px-4 py-3 border border-[#3a3a3a]">
      <Lock className="w-4 h-4" />
      <span className="text-sm">Complete seu cadastro para contato</span>
    </div>
  );
}
