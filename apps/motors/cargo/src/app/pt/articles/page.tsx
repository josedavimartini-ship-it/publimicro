import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PubliCargo · Artigos & Insights',
  description: 'Análises, tendências e estudos de caso do mercado Logística por especialistas PubliCargo.',
  keywords: ['Logística','PubliCargo','artigos','insights','análise','mercado']
};

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12" dir="ltr">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Artigos & Insights</h1>
        <p className="text-xl text-zinc-600">
          Análises profundas, tendências de mercado e estudos de caso do setor Logística.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
          <article className="border rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-2 text-sm text-zinc-600 mb-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Logística 4.0</span>
              <time>2025-10-08</time>
              <span>·</span>
              <span>9 min</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <a href="/pt/articles/telemetria-reduz-custo-frete" className="hover:text-blue-600">Telemetria Reduz Custo Operacional de Frete em Até 23%</a>
            </h3>
            <p className="text-zinc-600 mb-4">Sensores IoT e IA para roteirização dinâmica cortam combustível, pneus e manutenção não-planejada.</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Por Fernando Oliveira</span>
              <a href="/pt/articles/telemetria-reduz-custo-frete" className="text-blue-600 hover:underline text-sm font-medium">
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
