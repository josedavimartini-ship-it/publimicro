"use client";

import React from "react";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  number?: string;
  message?: string;
};

const DEFAULT_NUMBER = "5534992610004";
const DEFAULT_MESSAGE = "Olá! Gostaria de saber mais sobre as propriedades disponíveis.";

export default function WhatsAppLink({
  number = DEFAULT_NUMBER,
  message = DEFAULT_MESSAGE,
  children,
  className,
  ...rest
}: Props) {
  const sanitizedNumber = number.replace(/[^0-9+]/g, "");
  const url = `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={rest["aria-label"] || "Fale conosco no WhatsApp"}
      className={className}
      {...rest}
    >
      {children ?? "WhatsApp"}
    </a>
  );
}
