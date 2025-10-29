import Link from 'next/link';

export default function AnunciarPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#B7791F] mb-6">
            📢 Publicar Anúncio
          </h1>
          <p className="text-xl text-[#d8c68e] mb-4">
            Anuncie grátis e alcance milhares de compradores
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#B7791F] mb-4">Como funciona?</h2>
          <div className="space-y-4 text-[#676767]">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#FF6B35]/20 rounded-full flex items-center justify-center text-[#FF6B35] font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-[#d8c68e] mb-1">Crie sua conta</h3>
                <p className="text-sm">Cadastre-se gratuitamente e ganhe 2 anúncios grátis</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#FF6B35]/20 rounded-full flex items-center justify-center text-[#FF6B35] font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-[#d8c68e] mb-1">Preencha os dados</h3>
                <p className="text-sm">Título, descrição, fotos e preço do seu item</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#FF6B35]/20 rounded-full flex items-center justify-center text-[#FF6B35] font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-[#d8c68e] mb-1">Publique!</h3>
                <p className="text-sm">Seu anúncio estará disponível imediatamente</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-yellow-400 mb-2">🎁 Benefícios</h3>
          <ul className="space-y-2 text-sm text-yellow-300">
            <li>✓ 2 anúncios grátis ao se cadastrar</li>
            <li>✓ Alcance milhares de compradores</li>
            <li>✓ Gerencie seus anúncios facilmente</li>
            <li>✓ Receba propostas diretamente</li>
            <li>✓ Sistema de visitas integrado</li>
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/entrar"
            className="inline-block px-12 py-5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] text-lg font-bold rounded-full transition-all hover:scale-105 shadow-2xl"
          >
            Criar Conta e Anunciar Grátis
          </Link>
          <p className="text-sm text-[#676767] mt-4">
            Já tem conta? <Link href="/entrar" className="text-[#FF6B35] hover:underline">Faça login</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
