import React from "react";

export const HighlightsCarousel: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Anúncios em Destaque
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-xl p-4 shadow hover:shadow-md transition">
            <img
              src="https://placehold.co/400x250"
              alt="Anúncio 1"
              className="rounded-lg mb-3"
            />
            <p className="font-medium text-gray-900">Exemplo de anúncio</p>
            <p className="text-sm text-gray-600">Categoria / Localização</p>
          </div>
          <div className="border rounded-xl p-4 shadow hover:shadow-md transition">
            <img
              src="https://placehold.co/400x250"
              alt="Anúncio 2"
              className="rounded-lg mb-3"
            />
            <p className="font-medium text-gray-900">Outro anúncio destaque</p>
            <p className="text-sm text-gray-600">Categoria / Localização</p>
          </div>
          <div className="border rounded-xl p-4 shadow hover:shadow-md transition">
            <img
              src="https://placehold.co/400x250"
              alt="Anúncio 3"
              className="rounded-lg mb-3"
            />
            <p className="font-medium text-gray-900">Mais um anúncio</p>
            <p className="text-sm text-gray-600">Categoria / Localização</p>
          </div>
        </div>
      </div>
    </section>
  );
};
