export default function NegociacoesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0D7377] to-[#5F7161] mb-6">
          💬 Negociações
        </h1>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-12">
          <p className="text-xl text-[#676767] mb-6">
            Você não tem negociações ativas no momento.
          </p>
          <p className="text-[#676767] mb-8">
            Suas conversas com vendedores e suas propostas aparecerão aqui.
          </p>
        </div>
      </div>
    </main>
  );
}