import Link from "next/link";

interface SectionCardProps {
  title: string;
  description: string;
  href: string;
}

export default function SectionCard({
  title,
  description,
  href,
}: SectionCardProps): JSX.Element {
  return (
    <Link
      href={href}
      className="block rounded-xl shadow-lg bg-[#1a2a1a]/90 backdrop-blur-md p-6 hover:shadow-2xl transition relative border-2 border-[#3a4a3a] hover:border-[#6B7F5C] focus:outline-none focus:ring-4 focus:ring-[#6B7F5C]/40 group"
      style={{ boxShadow: '0 4px 32px 0 rgba(0,0,0,0.25)' }}
    >
      {/* Overlay for depth */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#8B9B6E]/10 via-transparent to-[#2C5F6F]/10 pointer-events-none z-0" aria-hidden="true"></span>
      <h3 className="relative z-10 text-xl font-semibold text-[#A8C97F] drop-shadow-lg group-hover:text-[#D4AF37] transition-colors">{title}</h3>
      <p className="relative z-10 mt-2 text-sm text-[#8B9B6E] drop-shadow group-hover:text-[#C9A87C] transition-colors">{description}</p>
    </Link>
  );
}
