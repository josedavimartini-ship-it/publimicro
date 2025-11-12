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
  const { data: categoriesManifest, loading: catsLoading } = useCategories();
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
        const items = (json.suggestions || json.data || []).slice(0, 8).map((it: any) => ({ id: it.id || it.slug || it.title, label: it.title || it.name || it.slug || it.id }));
        setSuggestions(items);
        setActiveSuggestionIndex(-1);
      } catch (err) {
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-[#0f0f0f] to-[#080808] rounded-3xl shadow-2xl border-4 border-[#A8C97F]/20 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] to-[#A8C97F]">Buscar</h3>
            <p className="text-sm text-[#8B9B6E]">Selecione uma seção e categoria para começar sua busca</p>

            <div className="mt-4 relative">
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  aria-label="Pesquisar anúncios"
                  aria-autocomplete="list"
                  aria-controls="search-suggestions"
                  aria-expanded={suggestions.length > 0}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Pesquisar por título, local ou referência..."
                  className="w-full px-4 py-3 rounded-xl bg-[#111] border border-[#222] text-[#E6C98B] placeholder-[#8B9B6E]"
                />
                <button
                  onClick={() => applyFilters()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-black font-bold"
                >
                  Buscar
                </button>
              </div>

              {suggestions.length > 0 && (
                <ul
                  id="search-suggestions"
                  role="listbox"
                  ref={suggestionsRef}
                  className="absolute z-50 mt-2 w-full bg-[#0b0b0b] border border-[#222] rounded-lg overflow-hidden shadow-xl max-h-60 overflow-auto"
                >
                  {suggestions.map((s, idx) => (
                    <li
                      key={s.id}
                      role="option"
                      aria-selected={activeSuggestionIndex === idx}
                      className={`px-4 py-3 cursor-pointer ${activeSuggestionIndex === idx ? "bg-[#A8C97F] text-black" : "text-[#E6C98B] hover:bg-[#1a1a1a]"}`}
                      onMouseDown={(ev) => { ev.preventDefault(); /* prevent blur */ }}
                      onClick={() => { setQuery(s.label); setSuggestions([]); applyFilters({ query: s.label }); }}
                    >
                      {s.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="flex gap-2 flex-wrap">
              {sections.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSection(s); setSelectedCategory(null); setSelectedSubcategory(null); }}
                  className={`px-3 py-2 rounded-full text-sm font-semibold ${s === section ? "bg-[#A8C97F] text-black" : "bg-[#1b1b1b] text-[#A8C97F]"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm text-[#8B9B6E] mb-2">Categorias</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="listbox" aria-label="Categorias">
            {cats.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                onKeyDown={(e) => {
                  // keyboard select
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectCategory(cat);
                  }
                }}
                tabIndex={0}
                aria-selected={selectedCategory === cat.id}
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#A8C97F] ${selectedCategory === cat.id ? "bg-[#A8C97F] text-black shadow-lg" : "bg-[#111] text-[#E6C98B] hover:bg-[#181818]"}`}
              >
                {cat.icon ? <span className="text-xl">{cat.icon}</span> : null}
                <div>
                  <div className="font-semibold">{cat.label}</div>
                  {cat.subcategories ? <div className="text-xs text-[#8B9B6E]">{cat.subcategories.length} sub</div> : null}
                </div>
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className="mt-4">
              <h5 className="text-sm text-[#8B9B6E] mb-2">Subcategorias</h5>
              <div className="flex gap-2 flex-wrap">
                {(categoriesManifest?.[section] ?? []).find((c) => c.id === selectedCategory)?.subcategories?.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectSub(s.id)}
                    className={`px-3 py-2 rounded-full text-sm ${selectedSubcategory === s.id ? "bg-[#A8C97F] text-black" : "bg-[#111] text-[#E6C98B] hover:bg-[#181818]"}`}
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
