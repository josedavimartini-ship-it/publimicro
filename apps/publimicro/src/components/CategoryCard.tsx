import Link from "next/link";

interface CategoryCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
}

export function CategoryCard({ href, icon, title, description }: CategoryCardProps) {
  // Temporarily disable navigation for categories under construction
  const isComingSoon = !href.includes("proper") && !href.includes("tudo");

  if (isComingSoon) {
    return (
      <div className="relative group bg-[#0b0b0b] border border-amber-900/30 rounded-2xl p-6 transition-all hover:border-amber-700/50 cursor-not-allowed opacity-75">
        <div className="absolute top-3 right-3 text-xs bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-1 rounded-full">
          Em breve
        </div>
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-amber-300 mb-2">{title}</h3>
        <p className="text-sm text-[#e7d7a8]">{description}</p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group bg-[#0b0b0b] border border-amber-900/40 hover:border-amber-600/60 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-500/10"
    >
      <div className="text-5xl mb-4 transition-transform group-hover:scale-110">{icon}</div>
      <h3 className="text-xl font-bold text-amber-300 group-hover:text-amber-200 mb-2">{title}</h3>
      <p className="text-sm text-[#e7d7a8]">{description}</p>
    </Link>
  );
}