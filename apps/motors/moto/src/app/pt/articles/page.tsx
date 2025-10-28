import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliMotos · Artigos & Insights',
  description: 'Análises, tendências e estudos de caso do mercado Duas Rodas por especialistas PubliMotos.',
  keywords: ['Duas Rodas','PubliMotos','artigos','insights','análise','mercado']
};

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12" dir="ltr">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Artigos & Insights</h1>
        <p className="text-xl text-zinc-600">
          Análises profundas, tendências de mercado e estudos de caso do setor Duas Rodas.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
          <article className="border rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-2 text-sm text-zinc-600 mb-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Mercado</span>
              <time>2025-10-12</time>
              <span>·</span>
              <span>6 min</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <a href="/pt/articles/delivery-apps-impulsionam-vendas-motos" className="hover:text-blue-600">Apps de Delivery Impulsionam 68% do Crescimento em Motos Urbanas</a>
            </h3>
            <p className="text-zinc-600 mb-4">Parcerias com iFood, Rappi e Loggi criam novo canal de vendas e financiamento para motociclistas profissionais.</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Por Ricardo Santos</span>
              <a href="/pt/articles/delivery-apps-impulsionam-vendas-motos" className="text-blue-600 hover:underline text-sm font-medium">
                Ler mais →
              </a>
            </div>
          </article>
      </div>

      <div className="mt-12 text-center">
        <button className="px-6 py-3 border-2 border-zinc-300 rounded-lg hover:bg-zinc-50 transition font-medium">
          Carregar mais artigos
        </button>
      </div>
    </main>
  );
}
