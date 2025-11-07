"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

function AnuncioPublicadoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  const listingId = searchParams.get("id");
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  const fetchListing = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select(`
        *,
        categories (name, icon)
      `)
      .eq("id", listingId)
      .single();

    if (data) setListing(data);
    setLoading(false);
  };

  const handleUpgrade = async (plan: "destaque" | "marketing") => {
    if (!listingId) return;
    
    setProcessing(true);
    
    try {
      // Obter token de autenticação
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert("Você precisa estar logado para fazer upgrade");
        router.push("/entrar");
        return;
      }

      // Chamar API para criar sessão de checkout
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          listingId,
          productType: plan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar sessão de pagamento");
      }

      // Redirecionar para checkout do Stripe
      window.location.href = data.url;
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error);
      alert(`Erro ao processar pagamento: ${error.message}`);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Anúncio não encontrado</h1>
          <p className="text-gray-600 mb-6">O anúncio que você procura não existe.</p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-green-100 rounded-full p-6 mb-4">
            <div className="text-6xl">✅</div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Anúncio Publicado com Sucesso!
          </h1>
          <p className="text-xl text-gray-600">
            Seu anúncio já está disponível para visualização
          </p>
        </div>

        {/* Listing Preview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">{listing.categories?.icon}</div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">
                {listing.categories?.name}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {listing.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>📍 {listing.city}, {listing.state}</span>
                {listing.price && (
                  <span className="text-xl font-bold text-green-600">
                    R$ {listing.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {listing.photos && listing.photos.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-6">
              {listing.photos.slice(0, 4).map((photo: string, idx: number) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Foto ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href={`/acheme-coisas/${listing.slug}`}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition text-center"
            >
              👁️ Ver Anúncio
            </Link>
            <Link
              href="/conta"
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition text-center"
            >
              📊 Gerenciar Anúncios
            </Link>
          </div>
        </div>

        {/* Upsell Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            🚀 Quer Vender Mais Rápido?
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Aumente a visibilidade do seu anúncio com nossas opções premium
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Destaque Plan */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl shadow-xl p-8 border-2 border-orange-200 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Destaque na Home
              </h3>
              <div className="text-4xl font-bold text-orange-600 mb-4">
                R$ 20<span className="text-lg text-gray-600">/30 dias</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">Aparece na <strong>página inicial</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700"><strong>Badge de destaque</strong> no anúncio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">Posição <strong>prioritária</strong> nas buscas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">Até <strong>10x mais visualizações</strong></span>
                </li>
              </ul>

              <button
                onClick={() => handleUpgrade("destaque")}
                disabled={processing}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition shadow-lg disabled:opacity-50"
              >
                {processing ? "Processando..." : "Destacar Anúncio"}
              </button>
            </div>

            {/* Marketing Orgânico Plan */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 border-2 border-purple-200 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                PRO
              </div>
              
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Marketing Orgânico
              </h3>
              <div className="text-4xl font-bold text-purple-600 mb-4">
                R$ 120<span className="text-lg text-gray-600">/30 dias</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700"><strong>Tudo do Destaque</strong> incluído</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">Divulgação em <strong>redes sociais</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700"><strong>Email marketing</strong> segmentado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">Otimização <strong>SEO</strong> do anúncio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700"><strong>Relatório</strong> de desempenho</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">Suporte <strong>prioritário</strong></span>
                </li>
              </ul>

              <button
                onClick={() => handleUpgrade("marketing")}
                disabled={processing}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-purple-600 hover:to-purple-700 transition shadow-lg disabled:opacity-50"
              >
                {processing ? "Processando..." : "Ativar Marketing"}
              </button>
            </div>

          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Não quer impulsionar agora?
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Continuar Sem Impulsionar
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>💡</span> Dicas para Vender Mais Rápido
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Fotos de qualidade:</strong> Anúncios com fotos nítidas vendem 3x mais rápido</li>
            <li>• <strong>Descrição completa:</strong> Detalhe o estado, marca, modelo e características</li>
            <li>• <strong>Preço competitivo:</strong> Pesquise produtos similares antes de precificar</li>
            <li>• <strong>Responda rápido:</strong> Compradores valorizam vendedores atenciosos</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default function AnuncioPublicadoPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <AnuncioPublicadoContent />
    </Suspense>
  );
}
