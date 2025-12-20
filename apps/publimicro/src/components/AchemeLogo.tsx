'use client';

/**
 * ACHEME Logo Component - Vector Emu + Magnifier
 *
 * New design:
 *  - Single inline stylized Emu head SVG (no external photos)
 *  - Rainbow gradient across the "AcheMe" word
 *  - Small magnifying-glass placed under the middle "e" with optional pulse animation
 */

interface AchemeLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export default function AchemeLogo({ 
  className = "", 
  size = "md",
  animate = true 
}: AchemeLogoProps) {
  // Size configurations
  const sizeConfig = {
    sm: { container: "h-8", text: "text-lg", image: 20, mag: 10 },
    md: { container: "h-12", text: "text-2xl", image: 28, mag: 12 },
    lg: { container: "h-16", text: "text-4xl", image: 40, mag: 14 },
  } as const;
  
  const config = sizeConfig[size];

  // Inline Emu head SVG as JSX for crisp rendering everywhere
  const EmuHead = ({ className = "" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      role="img"
    >
      <defs>
        <linearGradient id="emuGrad" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#5B4A35" />
        </linearGradient>
        <linearGradient id="eyeGrad" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFC107" />
        </linearGradient>
      </defs>

      <ellipse cx="32" cy="28" rx="18" ry="16" fill="url(#emuGrad)" />
      <ellipse cx="40" cy="24" rx="5" ry="6" fill="#3a3a3a" />
      <circle cx="41" cy="23" r="2" fill="url(#eyeGrad)" />
      <circle cx="41" cy="23" r="0.8" fill="#000" />
      <path d="M50 28 L62 26 L60 30 L50 32 Z" fill="#4a4a4a" />
      <path d="M20 36 Q16 50 18 58" stroke="url(#emuGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );

  // Magnifying glass svg
  const Magnifier = ({ className = "" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={config.mag}
      height={config.mag}
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="5" stroke="#111827" strokeWidth="1.5" fill="#FFFFFF" fillOpacity="0.95" />
      <path d="M16.5 16.5 L21 21" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11" cy="11" r="2.5" fill="#F59E0B" />
    </svg>
  );

  // Rainbow gradient class using Tailwind utilities inline (keeps it compact & accessible)
  const rainbowClass = "bg-clip-text text-transparent bg-gradient-to-r from-[#FF4B4B] via-[#FFB86B] via-[#FFD54F] via-[#6EE7B7] via-[#60A5FA] to-[#C084FC]";

  return (
    <div className={`flex items-center gap-1 ${config.container} ${className}`} aria-label="AcheMe logo">
      {/* "Ach" part - uses rainbow gradient so the whole word reads consistently */}
      <span className={`${config.text} font-extrabold tracking-tight ${rainbowClass}`}>Ach</span>

      {/* Emu head - vector */}
      <div
        className="relative rounded-full overflow-hidden flex-shrink-0"
        style={{ width: config.image, height: config.image }}
        aria-hidden
      >
        <EmuHead className="w-full h-full" />
      </div>

      {/* "eMe" with magnifier under the middle 'e' */}
      <span className={`${config.text} font-extrabold tracking-tight ${rainbowClass} relative`}> 
        {/* middle 'e' wrapped so we can position the magnifier beneath it */}
        <span className="inline-block relative">e
          <span className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 ${animate ? 'animate-pulse' : ''}`} aria-hidden>
            <Magnifier />
          </span>
        </span>
        Me
      </span>
    </div>
  );
}

