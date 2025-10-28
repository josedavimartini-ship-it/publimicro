"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

export default function LanguageSelector(): JSX.Element {
  const { language, changeLanguage } = useTranslation();

  return (
    <div className="relative group">
      <button className="px-3 py-2 bg-[#0f0f0f] border border-[#242424] hover:border-amber-500/30 rounded-lg text-sm text-[#bfa97a] hover:text-amber-500 transition-all flex items-center gap-2">
        <span>🌐</span>
        <span className="uppercase">{language.split("-")[0]}</span>
      </button>

      <div className="absolute right-0 mt-2 bg-[#0b0b0b] border border-[#242424] rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[160px]">
        <button
          onClick={() => changeLanguage("pt-BR")}
          className={`w-full px-4 py-3 text-left text-sm hover:bg-amber-500/10 transition-all flex items-center gap-3 ${
            language === "pt-BR" ? "text-amber-500 bg-amber-500/5" : "text-[#bfa97a]"
          }`}
        >
          <span>🇧🇷</span>
          <span>Português (BR)</span>
        </button>
        <button
          onClick={() => changeLanguage("es")}
          className={`w-full px-4 py-3 text-left text-sm hover:bg-amber-500/10 transition-all flex items-center gap-3 ${
            language === "es" ? "text-amber-500 bg-amber-500/5" : "text-[#bfa97a]"
          }`}
        >
          <span>🇪🇸</span>
          <span>Español</span>
        </button>
        <button
          onClick={() => changeLanguage("en-GB")}
          className={`w-full px-4 py-3 text-left text-sm hover:bg-amber-500/10 transition-all flex items-center gap-3 ${
            language === "en-GB" ? "text-amber-500 bg-amber-500/5" : "text-[#bfa97a]"
          }`}
        >
          <span>🇬🇧</span>
          <span>English (UK)</span>
        </button>
      </div>
    </div>
  );
}
