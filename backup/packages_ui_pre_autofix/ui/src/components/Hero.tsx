"use client";
import React from "react";

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  children?: React.ReactNode;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, ctaText, ctaLink, children }) => {
  return (
    <section className="py-20 text-center bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-4">{title}</h1>
        {subtitle && <p className="text-lg text-gray-300 mb-6">{subtitle}</p>}
        {ctaText && ctaLink && (
          <a 
            href={ctaLink} 
            className="inline-block px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-all"
          >
            {ctaText}
          </a>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
};