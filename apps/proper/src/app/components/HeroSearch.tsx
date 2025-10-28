"use client";

export default function HeroSearch() {
  return (
    <section className="h-[80vh] flex flex-col justify-center items-center text-center bg-proper-black text-proper-gray px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-proper-gold mb-6">
        Encontre o imóvel ideal
      </h1>
      <p className="text-lg mb-8 max-w-2xl">
        Casas, sítios, empreendimentos e oportunidades únicas em todo o Brasil.
      </p>

      <div className="w-full max-w-3xl flex bg-proper-darkgray rounded-full overflow-hidden border border-proper-moss shadow-lg">
        <input
          type="text"
          placeholder="Busque por cidade, tipo ou código..."
          className="flex-grow bg-transparent px-6 py-3 text-proper-gray outline-none"
        />
        <button className="bg-proper-moss hover:bg-proper-orange transition px-8 py-3 font-semibold text-proper-black">
          Buscar
        </button>
      </div>
    </section>
  );
}
