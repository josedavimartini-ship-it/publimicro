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
  onClick,
  ...rest
}: Props) {
  const sanitizedNumber = number.replace(/[^0-9+]/g, "");
  const url = `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(
    message
  )}`;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    try {
      const dl = (window as any).dataLayer;
      if (dl && typeof dl.push === "function") {
        dl.push({ event: "whatsapp_click", number: sanitizedNumber, url });
      }
    } catch (err) {
      // swallow errors to avoid breaking the page
      // eslint-disable-next-line no-console
      console.warn('WhatsApp analytics push failed', err);
    }
    if (typeof onClick === 'function') {
      onClick(e);
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={rest["aria-label"] || "Fale conosco no WhatsApp"}
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children ?? "WhatsApp"}
    </a>
  );
}
