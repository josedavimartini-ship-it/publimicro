import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6 mr-64">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className={"text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0D7377] to-[#14FFEC] mb-6".replace("#0D7377","#0D7377").replace("#14FFEC","#14FFEC")}>
          🌍 PubliGlobal
        </h1>
        <p className="text-2xl text-[#d8c68e] mb-8">Comércio Internacional</p>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-12">
          <h3 className="text-2xl font-bold text-[#B7791F] mb-4">Em Construção</h3>
          <p className="text-[#676767] text-lg">Conteúdo em breve.</p>
        </div>
        <Link href="/" className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-[#0D7377] to-[#14FFEC] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-all">
           Voltar ao Início
        </Link>
      </div>
    </main>
  );
}
