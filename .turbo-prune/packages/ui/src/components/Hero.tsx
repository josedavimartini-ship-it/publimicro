// packages/ui/src/components/Hero.tsx
"use client";
import React from "react";
import theme from "../theme";

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  children?: React.ReactNode;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, ctaText, ctaLink, children }) => {
  return (
    <section className={`py-20 text-center ${theme.classes.cardBg}`}>
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#cfa847] mb-4">{title}</h1>
        {subtitle && <p className="text-lg text-[#bfa97a] mb-6">{subtitle}</p>}
        {ctaText && ctaLink && (
          <a href={ctaLink} className="inline-block px-6 py-3 rounded-xl bg-[#cfa847] text-[#0f0f0f] hover:bg-[#b89236] transition-all">
            {ctaText}
          </a>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
};
