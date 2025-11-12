"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on homepage
  if (pathname === "/") return null;

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Início", href: "/" }
    ];

    // Map paths to friendly names
    const pathNames: Record<string, string> = {
      proper: "PubliProper",
      motors: "PubliMotors",
      machina: "PubliMachina",
      outdoor: "PubliMarine",
      global: "PubliGlobal",
      journey: "PubliJourney",
      share: "PubliShare",
      tudo: "PubliTudo",
      imoveis: "Propriedades",
      projetos: "Projetos",
      carcara: "Sítios Carcará",
      contato: "Contato",
      favoritos: "Favoritos",
  chat: "Chat",
      anunciar: "Publicar Anúncio",
      entrar: "Entrar",
      conta: "Minha Conta",
      admin: "Administração",
      buscar: "Buscar",
      comparar: "Comparar",
      lances: "Meus Lances",
      recentes: "Vistos Recentemente"
    };

    let currentPath = "";
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Skip dynamic segments (IDs)
      if (path.length === 36 || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(path)) {
        breadcrumbs.push({
          label: "Detalhes",
          href: currentPath
        });
      } else {
        breadcrumbs.push({
          label: pathNames[path] || path.charAt(0).toUpperCase() + path.slice(1),
          href: currentPath
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {index === 0 && <Home className="w-4 h-4 text-[#A8C97F]" />}
              
              {!isLast ? (
                <>
                  <Link
                    href={crumb.href}
                    className="text-[#A8C97F] hover:text-[#E6C98B] transition-colors font-medium"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-[#676767]" />
                </>
              ) : (
                <span className="text-[#E6C98B] font-semibold">
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
