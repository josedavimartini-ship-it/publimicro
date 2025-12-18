"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Language } from "@/lib/i18n/translations";

const languages = [
  { code: "pt-BR", flag: "🇧🇷", name: "Português (BR)" },
  { code: "en-GB", flag: "🇬🇧", name: "English" },
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "zh-CN", flag: "🇨🇳", name: "中文 (简体)" },
  { code: "hi", flag: "🇮🇳", name: "हिन्दी" },
  { code: "ar", flag: "🇸🇦", name: "العربية" },
] as const;

export default function LanguageSelector(): JSX.Element {
  const { language, changeLanguage } = useTranslation();

  return (
    <div className="relative group">
      <button className="px-3 py-2 bg-[#0f0f0f] border border-[#242424] hover:border-amber-500/30 rounded-lg text-sm text-[#bfa97a] hover:text-amber-500 transition-all flex items-center gap-2">
        <span>🌐</span>
        <span className="uppercase">{language.split("-")[0]}</span>
      </button>

      <div className="absolute right-0 mt-2 bg-[#0b0b0b] border border-[#242424] rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[180px] max-h-[320px] overflow-y-auto">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code as Language)}
            className={`w-full px-4 py-3 text-left text-sm hover:bg-amber-500/10 transition-all flex items-center gap-3 ${
              language === lang.code ? "text-amber-500 bg-amber-500/5" : "text-[#bfa97a]"
            }`}
            dir={lang.code === "ar" ? "rtl" : "ltr"}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
