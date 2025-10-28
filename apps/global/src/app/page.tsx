export const metadata = {
  title: "Publimicro Global — Negócios Internacionais",
  description: "Conectando o Brasil ao mundo",
};

export default function GlobalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🌍</div>
          <h1 className="text-5xl font-bold text-amber-400 mb-4">
            Publimicro Global
          </h1>
          <p className="text-xl text-gray-400">
            Conectando o Brasil ao mundo
          </p>
        </div>

        <article className="prose prose-invert prose-lg max-w-none">
          <div className="bg-gray-800/50 rounded-xl p-8 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">
              🚧 Em Desenvolvimento
            </h2>
            <p className="text-gray-300">
              A seção <strong>Publimicro Global</strong> está sendo construída para conectar 
              empreendedores, importadores e exportadores brasileiros ao mercado internacional.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-white mb-6">O que é o Publimicro Global?</h2>
          
          <p className="text-gray-300 leading-relaxed">
            O <strong className="text-amber-400">Publimicro Global</strong> será a ponte entre 
            o mercado brasileiro e oportunidades internacionais. Uma plataforma dedicada a:
          </p>

          <ul className="space-y-3 text-gray-300">
            <li>✅ <strong>Importação e Exportação:</strong> Conecte-se com fornecedores e compradores globais</li>
            <li>✅ <strong>Parcerias Internacionais:</strong> Encontre distribuidores e representantes</li>
            <li>✅ <strong>Logística Global:</strong> Soluções de transporte e desembaraço</li>
            <li>✅ <strong>Câmbio e Pagamentos:</strong> Facilidades para transações internacionais</li>
          </ul>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 my-8">
            <h3 className="text-xl font-bold text-amber-400 mb-3">💡 Interesse em participar?</h3>
            <p className="text-gray-300 mb-4">
              Cadastre-se para receber atualizações e ser um dos primeiros a usar a plataforma.
            </p>
            <a 
              href="/contato" 
              className="inline-block bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-3 rounded-lg transition-all"
            >
              Manifestar Interesse
            </a>
          </div>

          <h2 className="text-3xl font-bold text-white mb-6 mt-12">Mercados Disponíveis</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-amber-400 mb-3">🇺🇸 América do Norte</h3>
              <p className="text-gray-400 text-sm">
                Estados Unidos, Canadá e México
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-amber-400 mb-3">🇪🇺 Europa</h3>
              <p className="text-gray-400 text-sm">
                União Europeia e Reino Unido
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-amber-400 mb-3">🇨🇳 Ásia</h3>
              <p className="text-gray-400 text-sm">
                China, Japão, Coreia e Sudeste Asiático
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-amber-400 mb-3">🌎 América Latina</h3>
              <p className="text-gray-400 text-sm">
                Mercosul e demais países da região
              </p>
            </div>
          </div>
        </article>

        <div className="text-center mt-16">
          <a 
            href="/" 
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            ← Voltar para o ecossistema Publimicro
          </a>
        </div>
      </div>
    </div>
  );
}