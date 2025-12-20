'use client';

interface PostIconProps {
  className?: string;
  size?: number;
  label?: string;
}

export default function PostIcon({ className = '', size = 36, label = 'Post' }: PostIconProps) {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mailGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#B8904D" />
            <stop offset="1" stopColor="#D4AF37" />
          </linearGradient>
        </defs>

        {/* Mail envelope */}
        <rect x="8" y="18" width="48" height="28" rx="4" fill="#2e2e2e" stroke="url(#mailGrad)" strokeWidth="2" />
        <path d="M10 20 L32 36 L54 20" stroke="url(#mailGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Paper flying line */}
        <path d="M34 10 L44 8 L54 10" stroke="#8B6F45" strokeWidth="2" strokeLinecap="round" />
        <path d="M44 8 L44 18" stroke="#8B6F45" strokeWidth="2" strokeLinecap="round" />

        {/* Mail highlight */}
        <circle cx="48" cy="22" r="3" fill="#6B7F5C" />
      </svg>

      <span className="text-xs font-bold text-warm">{label}</span>
    </div>
  );
}
