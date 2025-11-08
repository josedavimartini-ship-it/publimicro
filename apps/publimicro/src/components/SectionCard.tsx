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
      className="block rounded-lg shadow-lg bg-white/80 backdrop-blur-md p-6 hover:shadow-2xl transition relative border border-[#FFD700]/30 focus:outline-none focus:ring-4 focus:ring-[#FFD700]/40 group"
      style={{ boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)' }}
    >
      {/* Overlay for contrast on light backgrounds */}
      <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-black/10 via-black/5 to-white/0 pointer-events-none z-0" aria-hidden="true"></span>
      <h3 className="relative z-10 text-xl font-semibold text-gray-900 drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)] group-hover:text-[#B87333] transition-colors">{title}</h3>
      <p className="relative z-10 mt-2 text-sm text-gray-700 drop-shadow-[0_1px_4px_rgba(0,0,0,0.10)] group-hover:text-[#D4A574] transition-colors">{description}</p>
    </Link>
  );
}
