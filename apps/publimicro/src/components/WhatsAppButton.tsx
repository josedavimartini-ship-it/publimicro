"use client";

import { Phone } from "lucide-react";
import { WhatsAppLink } from "@publimicro/ui";

export default function WhatsAppButton({ message }: { message?: string }) {
  const whatsappNumber = "5534992610004";
  const defaultMessage = message || "Olá! Tenho interesse no seu anúncio.";

  return (
    <WhatsAppLink
      number={whatsappNumber}
      message={defaultMessage}
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#25D366] text-white shadow-md hover:scale-[1.02] transition-transform duration-150"
    >
      <Phone className="w-4 h-4" />
      <span className="text-sm">WhatsApp</span>
    </WhatsAppLink>
  );
}