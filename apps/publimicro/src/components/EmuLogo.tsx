"use client";

interface EmuLogoProps {
  className?: string;
  size?: number;
}

/**
 * Logo AcheMe: Emu realista com binóculos
 * Cores naturais: bronze (#CD7F32, #B87333), verde musgo (#556B2F), marrom terra
 */
export default function EmuLogo({ className = "", size = 120 }: EmuLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AcheMe Logo - Emu com binóculos"
    >
      {/* Definições de gradientes */}
      <defs>
        {/* Gradiente corpo da Emu - tons marrom terroso */}
        <linearGradient id="emuBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B7355" />
          <stop offset="50%" stopColor="#6B5344" />
          <stop offset="100%" stopColor="#4A3C2F" />
        </linearGradient>

        {/* Gradiente pescoço - marrom claro */}
        <linearGradient id="emuNeck" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A89080" />
          <stop offset="100%" stopColor="#8B7355" />
        </linearGradient>

        {/* Gradiente cabeça - marrom acinzentado */}
        <linearGradient id="emuHead" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9A8B7E" />
          <stop offset="100%" stopColor="#7A6B5E" />
        </linearGradient>

        {/* Gradiente binóculos - bronze/cobre */}
        <linearGradient id="binocularsBronze" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#CD7F32" />
          <stop offset="100%" stopColor="#B87333" />
        </linearGradient>

        {/* Gradiente verde musgo para detalhes */}
        <linearGradient id="mossGreen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B8E23" />
          <stop offset="100%" stopColor="#556B2F" />
        </linearGradient>

        {/* Sombras */}
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Corpo da Emu */}
      <ellipse
        cx="100"
        cy="140"
        rx="50"
        ry="45"
        fill="url(#emuBody)"
        filter="url(#shadow)"
      />

      {/* Plumagem texturizada (3 camadas) */}
      <path
        d="M 65 120 Q 60 135 65 150 Q 70 140 75 130 Z"
        fill="#6B5344"
        opacity="0.6"
      />
      <path
        d="M 135 120 Q 140 135 135 150 Q 130 140 125 130 Z"
        fill="#6B5344"
        opacity="0.6"
      />
      <path
        d="M 100 110 Q 85 125 80 145 Q 95 135 100 120 Z"
        fill="#5A4332"
        opacity="0.5"
      />

      {/* Pernas (finas e longas como emu real) */}
      <rect x="85" y="175" width="6" height="20" rx="3" fill="#5A4332" />
      <rect x="109" y="175" width="6" height="20" rx="3" fill="#5A4332" />
      
      {/* Pés com 3 dedos */}
      <path d="M 88 192 L 82 198 M 88 192 L 88 198 M 88 192 L 94 198" stroke="#4A3C2F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 112 192 L 106 198 M 112 192 L 112 198 M 112 192 L 118 198" stroke="#4A3C2F" strokeWidth="2.5" strokeLinecap="round" />

      {/* Pescoço longo e curvado */}
      <path
        d="M 100 110 Q 95 70 100 40"
        stroke="url(#emuNeck)"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
        filter="url(#shadow)"
      />

      {/* Cabeça */}
      <ellipse
        cx="100"
        cy="32"
        rx="18"
        ry="20"
        fill="url(#emuHead)"
        filter="url(#shadow)"
      />

      {/* Bico (pequeno e pontudo) */}
      <path
        d="M 115 32 L 125 30 L 115 28 Z"
        fill="#5A4332"
      />

      {/* Olhos expressivos */}
      <circle cx="106" cy="28" r="3.5" fill="#2C1810" />
      <circle cx="106" cy="27" r="1.2" fill="white" opacity="0.9" />

      {/* BINÓCULOS - elemento principal da marca */}
      <g transform="translate(80, 18)">
        {/* Corpo dos binóculos em bronze/cobre */}
        {/* Cilindro esquerdo */}
        <ellipse cx="15" cy="20" rx="11" ry="13" fill="url(#binocularsBronze)" stroke="#8B6914" strokeWidth="1.5" />
        <ellipse cx="15" cy="18" rx="9" ry="3" fill="#D4AF37" opacity="0.7" />
        
        {/* Cilindro direito */}
        <ellipse cx="35" cy="20" rx="11" ry="13" fill="url(#binocularsBronze)" stroke="#8B6914" strokeWidth="1.5" />
        <ellipse cx="35" cy="18" rx="9" ry="3" fill="#D4AF37" opacity="0.7" />

        {/* Ponte conectando os cilindros */}
        <rect x="22" y="16" width="6" height="8" rx="2" fill="url(#binocularsBronze)" stroke="#8B6914" strokeWidth="1" />

        {/* Lentes (com reflexo) */}
        <circle cx="15" cy="30" r="8" fill="#1a1a2e" stroke="#D4AF37" strokeWidth="2" />
        <circle cx="15" cy="28" r="3" fill="#4a4a5e" opacity="0.4" />
        <circle cx="17" cy="27" r="1.5" fill="white" opacity="0.6" />

        <circle cx="35" cy="30" r="8" fill="#1a1a2e" stroke="#D4AF37" strokeWidth="2" />
        <circle cx="35" cy="28" r="3" fill="#4a4a5e" opacity="0.4" />
        <circle cx="37" cy="27" r="1.5" fill="white" opacity="0.6" />

        {/* Detalhes de ajuste (rodinha lateral) */}
        <circle cx="8" cy="20" r="2.5" fill="#B87333" stroke="#8B6914" strokeWidth="0.8" />
        <circle cx="42" cy="20" r="2.5" fill="#B87333" stroke="#8B6914" strokeWidth="0.8" />

        {/* Alça verde musgo */}
        <path
          d="M 10 12 Q 25 8 40 12"
          stroke="url(#mossGreen)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Asa dobrada (pequena, típica de emu) */}
      <ellipse
        cx="135"
        cy="130"
        rx="18"
        ry="28"
        fill="#6B5344"
        opacity="0.8"
        transform="rotate(-15 135 130)"
      />
      <path
        d="M 140 115 Q 145 125 142 135 Q 138 125 140 115 Z"
        fill="#5A4332"
        opacity="0.6"
      />

      {/* Cauda curta (penas marrom escuro) */}
      <ellipse
        cx="90"
        cy="175"
        rx="12"
        ry="8"
        fill="#5A4332"
        opacity="0.7"
        transform="rotate(20 90 175)"
      />

      {/* Brilho nos binóculos (destaque) */}
      <ellipse
        cx="95"
        cy="40"
        rx="4"
        ry="3"
        fill="white"
        opacity="0.3"
      />
      <ellipse
        cx="115"
        cy="40"
        rx="4"
        ry="3"
        fill="white"
        opacity="0.3"
      />

      {/* Linha de visão (opcional - efeito de procura) */}
      <g opacity="0.15">
        <line x1="87" y1="48" x2="60" y2="55" stroke="url(#mossGreen)" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="113" y1="48" x2="140" y2="55" stroke="url(#mossGreen)" strokeWidth="1.5" strokeDasharray="3,3" />
      </g>
    </svg>
  );
}
