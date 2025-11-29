"use client";

import React, { useState, useRef } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

export default function SearchBar({ onFilterChange }: { onFilterChange?: React.Dispatch<React.SetStateAction<SearchFilters>> }) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={searchRef} className="relative w-full max-w-4xl mx-auto">
      <div className="relative shadow-2xl">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
          <Search className="w-7 h-7 text-[#A8C97F]" strokeWidth={2.5} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            // Notify parent filters if provided
            onFilterChange?.((prev) => ({ ...prev, query: v } as SearchFilters));
          }}
          placeholder="Buscar propriedades por nome ou localização..."
          className="w-full pl-16 pr-40 py-6 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] border-4 border-[#A8C97F]/30 rounded-2xl text-[#E6C98B] text-xl placeholder-[#8B9B6E] font-semibold focus:border-[#A8C97F] focus:outline-none"
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button onClick={() => setQuery("")} className="p-3 hover:bg-[#2a2a1a] rounded-full">
              <X className="w-6 h-6 text-[#8B9B6E]" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full ${showFilters ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-[#0a0a0a]" : "bg-[#2a2a1a] text-[#A8C97F]"}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-extrabold">Filtros</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Lightweight named export kept for compatibility with older imports
export function SearchFilters({ onFilterChange }: { onFilterChange?: React.Dispatch<React.SetStateAction<SearchFilters>> }) {
  // Minimal UI placeholder: callers may render their own filters or pass a handler
  return (
    <div className="w-full p-4 bg-transparent text-sm text-[#E6C98B]">
      {/* Consumers expect a component named SearchFilters; keep API surface stable */}
      <div className="flex gap-2 items-center">
        <label className="text-xs text-[#8B9B6E]">Filtro rápido</label>
        <select
          onChange={(e) => onFilterChange?.((prev) => ({ ...prev, quickFilter: e.target.value } as SearchFilters))}
          className="bg-[#111] border border-[#2a2a1a] rounded px-2 py-1 text-xs"
        >
          <option value="">Qualquer</option>
          <option value="preco-baixo">Preço: baixo</option>
          <option value="preco-alto">Preço: alto</option>
        </select>
      </div>
    </div>
  );
}

// Also export a type with the same name so callers that use the identifier as a type compile
// Type describing the shape of search filter state used across the app
export interface SearchFilters {
  query?: string;
  priceMin?: number | string | undefined;
  priceMax?: number | string | undefined;
  areaMin?: number | string | undefined;
  areaMax?: number | string | undefined;
  location?: string;
  sortBy?: string;
  searchType?: string;
  [key: string]: any;
}
