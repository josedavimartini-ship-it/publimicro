"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || "/";

export default function SharedHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname?.startsWith(href);

  const Item = ({ href, label, icon }: { href: string; label: string; icon: string }) => (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm"
      style={{
        color: "var(--text-primary)",
        background: isActive(href) ? "var(--bg-elevated)" : "transparent",
        border: "1px solid var(--border)",
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="hidden sm:block">{label}</span>
    </Link>
  );

  return (
    <div
      className="w-full"
      style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={HOME_URL}
            className="font-semibold"
            style={{ color: "var(--accent-light)" }}
            aria-label="Ir para Início"
          >
            • publimicro
          </Link>
          <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
            ecossistema
          </span>
        </div>

        <nav className="flex items-center gap-2">
          <Item href="/search" label="Buscar" icon="🔎" />
          <Item href="/proposta" label="Propostas" icon="💬" />
          <Item href="/favoritos" label="Favoritos" icon="⭐" />
          <Item href="/orçamentos" label="Orçamentos" icon="🧾" />
          <Link
            href="/anunciar"
            className="px-3 py-2 rounded-md text-sm font-medium"
            style={{
              color: "#0d0f0c",
              background: "var(--accent)",
              border: "1px solid var(--border)",
            }}
          >
            Anunciar
          </Link>
        </nav>
      </div>
    </div>
  );
}
