"use client";

import { useEffect, useState } from "react";
import CATEGORIES_BY_SECTION from "@/lib/categories";

type CategoryShape = typeof CATEGORIES_BY_SECTION;

export function useCategories() {
  const [data, setData] = useState<CategoryShape | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const json = await res.json();
        if (mounted && json?.data) {
          setData(json.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        // fallback to local manifest
      }

      if (mounted) {
        setData(CATEGORIES_BY_SECTION as CategoryShape);
        setLoading(false);
      }
    }

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading } as const;
}

export default useCategories;
