"use client";

import { useState, useEffect } from "react";
import { translations, Language } from "./translations";

export function useTranslation() {
  const [language, setLanguage] = useState<Language>("pt-BR");

  useEffect(() => {
    // Get language from localStorage or browser
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language;
      if (browserLang.startsWith("pt")) setLanguage("pt-BR");
      else if (browserLang.startsWith("es")) setLanguage("es");
      else if (browserLang.startsWith("en")) setLanguage("en-GB");
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = translations[language];
    
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { language, changeLanguage, t };
}
