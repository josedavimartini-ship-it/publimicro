"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar(): JSX.Element {
  const router = useRouter();

  function handlePostar(): void {
    const logged = false; // 🔸 Futuro: integrar com Supabase Auth
    if (!logged) {
      router.push("/login");
    } else {
      router.push("/anunciar");
    }
  }

  return (
    <nav className="flex items-center gap-4">
      <Link
        href="/buscar"
        className="flex flex-col items-center text-xs text-gray-700 hover:text-emerald-800"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-1">
          <path
            d="M21 21l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>Buscar</span>
      </Link>

      <Link
        href="/favoritos"
        className="flex flex-col items-center text-xs text-gray-700 hover:text-amber-600"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-1">
          <path
            d="M12 17l-5.5 3 1.5-6-4.5-3.5 6-0.5L12 4l2.5 5 6 0.5-4.5 3.5 1.5 6z"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
        <span>Favoritos</span>
      </Link>

      <button
        onClick={handlePostar}
        type="button"
        className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-1">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>Postar</span>
      </button>

      <Link
        href="/conta"
        className="flex flex-col items-center text-xs text-gray-700 hover:text-gray-900"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-1">
          <path
            d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span>Conta</span>
      </Link>
    </nav>
  );
}
