import Link from "next/link";

export default function Hero(): JSX.Element {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-20 bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-800 text-white">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-[#FFD700] via-[#DAA520] to-[#B87333] bg-clip-text text-transparent drop-shadow-lg">
        ACHEME
      </h1>
      <p className="mt-4 text-lg max-w-2xl">
        Global marketplace connecting buyers and sellers worldwide — properties, vehicles, opportunities.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/imoveis"
          className="bg-amber-400 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow hover:bg-amber-500 transition"
        >
          Browse Listings
        </Link>
        <Link
          href="/anunciar"
          className="bg-white/10 text-white border border-white/40 font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition"
        >
          Post Now
        </Link>
      </div>
    </section>
  );
}
