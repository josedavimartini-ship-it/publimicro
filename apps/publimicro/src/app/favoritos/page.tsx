export default function FavoritosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#B7791F] mb-6">
          ❤️ Favoritos
        </h1>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-12">
          <p className="text-xl text-[#676767] mb-6">
            Você ainda não tem anúncios favoritos.
          </p>
          <p className="text-[#676767] mb-8">
            Explore nossos anúncios e salve seus favoritos clicando no ícone de coração.
          </p>
        </div>
      </div>
    </main>
  );
}