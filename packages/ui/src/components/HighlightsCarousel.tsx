import React from "react";

export const HighlightsCarousel: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6 text-[#D4A574]">
          Anúncios em Destaque
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border-2 border-[#2a2a1a] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-xl p-4 shadow hover:shadow-md hover:border-[#FF6B35] transition">
            <img
              src="https://placehold.co/400x250"
              alt="Anúncio 1"
              className="rounded-lg mb-3"
            />
            <p className="font-medium text-[#D4A574]">Exemplo de anúncio</p>
            <p className="text-sm text-[#8B9B6E]">Categoria / Localização</p>
          </div>
          <div className="border-2 border-[#2a2a1a] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-xl p-4 shadow hover:shadow-md hover:border-[#FF6B35] transition">
            <img
              src="https://placehold.co/400x250"
              alt="Anúncio 2"
              className="rounded-lg mb-3"
            />
            <p className="font-medium text-[#D4A574]">Outro anúncio destaque</p>
            <p className="text-sm text-[#8B9B6E]">Categoria / Localização</p>
          </div>
          <div className="border-2 border-[#2a2a1a] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-xl p-4 shadow hover:shadow-md hover:border-[#FF6B35] transition">
            <img
              src="https://placehold.co/400x250"
              alt="Anúncio 3"
              className="rounded-lg mb-3"
            />
            <p className="font-medium text-[#D4A574]">Mais um anúncio</p>
            <p className="text-sm text-[#8B9B6E]">Categoria / Localização</p>
          </div>
        </div>
      </div>
    </section>
  );
};
