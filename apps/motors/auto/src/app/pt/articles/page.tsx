import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliAutos · Artigos & Insights',
  description: 'Análises, tendências e estudos de caso do mercado Automotivo por especialistas PubliAutos.',
  keywords: ['Automotivo','PubliAutos','artigos','insights','análise','mercado']
};

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12" dir="ltr">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Artigos & Insights</h1>
        <p className="text-xl text-zinc-600">
          Análises profundas, tendências de mercado e estudos de caso do setor Automotivo.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
          <article className="border rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-2 text-sm text-zinc-600 mb-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Tendências</span>
              <time>2025-10-15</time>
              <span>·</span>
              <span>8 min</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <a href="/pt/articles/eletrificacao-transforma-varejo-automotivo" className="hover:text-blue-600">Eletrificação Transforma o Varejo Automotivo em 2025</a>
            </h3>
            <p className="text-zinc-600 mb-4">Como concessionárias estão reinventando a experiência de compra para a era dos veículos elétricos.</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Por Marina Costa</span>
              <a href="/pt/articles/eletrificacao-transforma-varejo-automotivo" className="text-blue-600 hover:underline text-sm font-medium">
                Ler mais →
              </a>
            </div>
          </article>

          <article className="border rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-2 text-sm text-zinc-600 mb-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Finanças</span>
              <time>2025-10-10</time>
              <span>·</span>
              <span>6 min</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <a href="/pt/articles/financiamento-verde-acelera-vendas" className="hover:text-blue-600">Financiamento Verde: Como Linhas Especiais Aceleram Conversão</a>
            </h3>
            <p className="text-zinc-600 mb-4">Taxas reduzidas e prazos estendidos para EVs viram argumento decisivo em 41% das vendas.</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Por Carlos Mendes</span>
              <a href="/pt/articles/financiamento-verde-acelera-vendas" className="text-blue-600 hover:underline text-sm font-medium">
                Ler mais →
              </a>
            </div>
          </article>

          <article className="border rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-2 text-sm text-zinc-600 mb-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Marketing</span>
              <time>2025-10-05</time>
              <span>·</span>
              <span>7 min</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <a href="/pt/articles/dados-first-party-revolucionam-midia" className="hover:text-blue-600">Dados First-Party: Como Montadoras Revolucionam Mídia Automotiva</a>
            </h3>
            <p className="text-zinc-600 mb-4">Plataformas próprias de dados conectados geram ROAS 4-6x superior a campanhas tradicionais.</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Por Daniela Ferreira</span>
              <a href="/pt/articles/dados-first-party-revolucionam-midia" className="text-blue-600 hover:underline text-sm font-medium">
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
