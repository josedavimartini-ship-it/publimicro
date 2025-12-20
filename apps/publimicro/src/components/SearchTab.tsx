"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import useCategories from "@/hooks/useCategories";
import { DEFAULT_SECTION, type Category } from "@/lib/categories";
// Re-export SearchFilters type from the existing SearchBar so callers can import from either module
export type { SearchFilters } from "@/components/SearchBar";
import type { SearchFilters as _SearchFilters } from "@/components/SearchBar";

interface Props {
  onFilterChange?: (filters: _SearchFilters) => void;
  initialSection?: string;
}

export default function SearchTab({ onFilterChange, initialSection = DEFAULT_SECTION }: Props) {
  const { data: categoriesManifest, loading: _catsLoading } = useCategories();
  const sections = useMemo(() => Object.keys(categoriesManifest || {}), [categoriesManifest]);
  const [section, setSection] = useState<string>(initialSection);
  const [query, setQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Accessibility / autosuggest state
  const [suggestions, setSuggestions] = useState<Array<{ id: string; label: string }>>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);

  function applyFilters(next?: Partial<_SearchFilters>) {
    const filters: _SearchFilters = {
      query,
      category: selectedCategory || undefined,
      subcategory: selectedSubcategory || undefined,
      searchType: section,
      ...next,
    };

    onFilterChange?.(filters);
  }

  function onSelectCategory(cat: Category) {
    const next = cat.id === selectedCategory ? { selectedCategory: null } : { selectedCategory: cat.id };
    setSelectedSubcategory(null);
    setSelectedCategory(next.selectedCategory ?? null);
    // notify parent
    applyFilters({ category: next.selectedCategory ?? undefined, subcategory: undefined });
  }

  function onSelectSub(subId?: string) {
    const next = subId === selectedSubcategory ? null : subId;
    setSelectedSubcategory(next);
    applyFilters({ subcategory: next ?? undefined });
  }

  const cats = (categoriesManifest && categoriesManifest[section]) || [];

  // Debounced autosuggest for query
  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const url = new URL("/api/search", location.origin);
        url.searchParams.set("q", query);
        url.searchParams.set("section", section);
        const res = await fetch(`${url.pathname}?q=${encodeURIComponent(query)}&section=${encodeURIComponent(section)}`);
        if (!res.ok) return;
        const json = await res.json();
        // suggestions expect id + label
        const items = (json.suggestions || json.data || []).slice(0, 8).map((it: Record<string, unknown>) => ({ id: String(it.id || it.slug || it.title), label: String(it.title || it.name || it.slug || it.id) }));
        setSuggestions(items);
        setActiveSuggestionIndex(-1);
      } catch {
        // ignore
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query, section]);

  // Keyboard handlers for input and suggestions
  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        const s = suggestions[activeSuggestionIndex];
        setQuery(s.label);
        setSuggestions([]);
        applyFilters({ query: s.label });
      } else {
        applyFilters();
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a] rounded-3xl shadow-2xl border-2 border-[#A8C97F]/30 p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] via-[#D4A574] to-[#A8C97F] mb-3">
            🔍 Encontre o que Procura
          </h2>
          <p className="text-lg text-[#8B9B6E]">Milhares de anúncios em categorias variadas. Comece sua busca agora!</p>
        </div>

        {/* Main Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <input
                ref={inputRef}
                aria-label="Pesquisar anúncios"
                aria-autocomplete="list"
                aria-controls="search-suggestions"
                aria-expanded={suggestions.length > 0}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="🔎 Digite o que você procura... (ex: apartamento, carro, emprego)"
                className="flex-1 px-6 py-5 text-lg rounded-2xl bg-[#0a0a0a] border-2 border-[#2a2a2a] text-[#E6C98B] placeholder-[#676767] focus:border-[#A8C97F] focus:outline-none focus:ring-2 focus:ring-[#A8C97F]/50 transition-all"
              />
              <button
                onClick={() => applyFilters()}
                className="px-8 py-5 rounded-2xl btn-secondary font-black text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                🚀 Buscar Agora
              </button>
            </div>

            {/* Autosuggest dropdown */}
            {suggestions.length > 0 && (
              <ul
                id="search-suggestions"
                role="listbox"
                ref={suggestionsRef}
                className="absolute z-50 mt-2 w-full bg-[#0a0a0a] border-2 border-[#A8C97F]/50 rounded-2xl overflow-hidden shadow-2xl max-h-80 overflow-auto"
              >
                {suggestions.map((s, idx) => (
                  <li
                    key={s.id}
                    role="option"
                    aria-selected={activeSuggestionIndex === idx}
                    className={`px-6 py-4 cursor-pointer border-b border-[#1a1a1a] last:border-0 transition-all ${
                      activeSuggestionIndex === idx 
                        ? "bg-[#A8C97F] text-[#0a0a0a] font-semibold" 
                        : "text-[#E6C98B] hover:bg-[#1a1a1a]"
                    }`}
                    onMouseDown={(ev) => { ev.preventDefault(); }}
                    onClick={() => { setQuery(s.label); setSuggestions([]); applyFilters({ query: s.label }); }}
                  >
                    🔍 {s.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-[#A8C97F] mb-3 uppercase tracking-wider">📂 Seções</h4>
          <div className="flex gap-3 flex-wrap">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => { setSection(s); setSelectedCategory(null); setSelectedSubcategory(null); }}
                className={`px-6 py-3 rounded-xl text-base font-bold transition-all transform hover:scale-105 ${
                  s === section 
                    ? "bg-gradient-to-r from-[#A8C97F] to-[#8B9B6E] text-[#0a0a0a] shadow-lg" 
                    : "bg-[#1a1a1a] text-[#A8C97F] hover:bg-[#2a2a2a] border border-[#2a2a2a]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <h4 className="text-sm font-semibold text-[#A8C97F] mb-4 uppercase tracking-wider">🏷️ Categorias</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" role="listbox" aria-label="Categorias">
            {cats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectCategory(cat);
                  }
                }}
                tabIndex={0}
                aria-selected={selectedCategory === cat.id}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl text-center transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#A8C97F] ${
                  selectedCategory === cat.id 
                    ? "bg-gradient-to-br from-[#A8C97F] to-[#6B7F5C] text-[#0a0a0a] shadow-2xl" 
                    : "bg-[#1a1a1a] text-[#E6C98B] hover:bg-[#2a2a2a] border border-[#2a2a2a]"
                }`}
              >
                {cat.icon ? <span className="text-4xl">{cat.icon}</span> : <span className="text-4xl">📦</span>}
                <div>
                  <div className="font-bold text-sm">{cat.label}</div>
                  {cat.subcategories && (
                    <div className={`text-xs mt-1 ${selectedCategory === cat.id ? 'text-[#0a0a0a]/70' : 'text-[#8B9B6E]'}`}>
                      {cat.subcategories.length} subcategorias
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Subcategories */}
          {selectedCategory && (
            <div className="mt-6 p-6 bg-[#0a0a0a] rounded-2xl border border-[#2a2a2a]">
              <h5 className="text-sm font-semibold text-[#A8C97F] mb-3 uppercase tracking-wider">🔖 Subcategorias</h5>
              <div className="flex gap-3 flex-wrap">
                {(categoriesManifest?.[section] ?? []).find((c) => c.id === selectedCategory)?.subcategories?.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectSub(s.id)}
                    className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 ${
                      selectedSubcategory === s.id 
                        ? "bg-gradient-to-r from-[#D4A574] to-[#B8904D] text-[#0a0a0a] shadow-lg" 
                        : "bg-[#1a1a1a] text-[#E6C98B] hover:bg-[#2a2a2a] border border-[#2a2a2a]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
