"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Trash2, Edit, Eye, EyeOff, PlusCircle, Home, Package } from "lucide-react";
import { useToast } from "@/components/ToastNotification";
import Image from "next/image";
import Link from "next/link";

interface Property {
  id: string;
  nome: string;
  preco: number;
  fotos: string[];
  localizacao: string;
  created_at: string;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  photos: string[];
  city: string;
  state: string;
  created_at: string;
  is_featured: boolean;
}

export default function MeusAnunciosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<"properties" | "listings">("properties");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/entrar?redirect=/meus-anuncios");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load properties
      const { data: propsData, error: propsError } = await supabase
        .from("sitios")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (propsError) throw propsError;
      setProperties(propsData || []);

      // Load AcheMeCoisas listings
      const { data: listingsData, error: listingsError } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (listingsError) throw listingsError;
      setListings(listingsData || []);
    } catch (error: any) {
      showToast({ 
        type: "error", 
        title: "Erro ao carregar anúncios",
        message: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta propriedade?")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("sitios").delete().eq("id", id);

      if (error) throw error;

      setProperties(properties.filter((p) => p.id !== id));
      showToast({ 
        type: "success", 
        title: "Propriedade excluída com sucesso!" 
      });
    } catch (error: any) {
      showToast({ 
        type: "error", 
        title: "Erro ao excluir propriedade",
        message: error.message 
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("listings").delete().eq("id", id);

      if (error) throw error;

      setListings(listings.filter((l) => l.id !== id));
      showToast({ 
        type: "success", 
        title: "Anúncio excluído com sucesso!" 
      });
    } catch (error: any) {
      showToast({ 
        type: "error", 
        title: "Erro ao excluir anúncio",
        message: error.message 
      });
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl">Carregando seus anúncios...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] bg-clip-text text-transparent mb-2">
              Meus Anúncios
            </h1>
            <p className="text-[#8B9B6E]">Gerencie suas propriedades e listings</p>
          </div>
          <Link
            href="/acheme-coisas/postar"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#CD7F32] to-[#B87333] hover:from-[#D4AF37] hover:to-[#CD7F32] text-[#0a0a0a] font-bold rounded-full transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Novo Anúncio
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#2a2a1a]">
          <button
            onClick={() => setActiveTab("properties")}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
              activeTab === "properties"
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-[#8B9B6E] hover:text-[#D4A574]"
            }`}
          >
            <Home className="w-5 h-5" />
            Propriedades ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
              activeTab === "listings"
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-[#8B9B6E] hover:text-[#D4A574]"
            }`}
          >
            <Package className="w-5 h-5" />
            AcheMeCoisas ({listings.length})
          </button>
        </div>

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div>
            {properties.length === 0 ? (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-12 text-center">
                <Home className="w-16 h-16 text-[#8B9B6E] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#E6C98B] mb-2">Nenhuma propriedade cadastrada</h3>
                <p className="text-[#8B9B6E] mb-6">Comece anunciando sua primeira propriedade</p>
                <Link
                  href="/postar-imovel"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#A8C97F]/20 border-2 border-[#A8C97F] text-[#A8C97F] font-semibold rounded-full hover:bg-[#A8C97F]/30 transition-all"
                >
                  <PlusCircle className="w-5 h-5" />
                  Anunciar Propriedade
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-xl overflow-hidden hover:border-[#A8C97F] transition-all group"
                  >
                    {/* Image */}
                    <div className="aspect-video relative bg-[#0a0a0a]">
                      {property.fotos && property.fotos[0] ? (
                        <Image
                          src={property.fotos[0]}
                          alt={property.nome}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-12 h-12 text-[#8B9B6E]" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-[#E6C98B] mb-2 truncate">{property.nome}</h3>
                      <p className="text-[#8B9B6E] text-sm mb-2">{property.localizacao}</p>
                      <p className="text-[#D4AF37] font-bold text-xl mb-4">
                        R$ {property.preco?.toLocaleString("pt-BR")}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/imoveis/${property.id}`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#A8C97F]/20 border border-[#A8C97F] text-[#A8C97F] font-semibold rounded-lg hover:bg-[#A8C97F]/30 transition-all text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          disabled={deleting === property.id}
                          className="px-4 py-2 bg-red-900/20 border border-red-500/50 text-red-400 font-semibold rounded-lg hover:bg-red-900/30 transition-all disabled:opacity-50 text-sm"
                        >
                          {deleting === property.id ? "..." : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === "listings" && (
          <div>
            {listings.length === 0 ? (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-12 text-center">
                <Package className="w-16 h-16 text-[#8B9B6E] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#E6C98B] mb-2">Nenhum anúncio cadastrado</h3>
                <p className="text-[#8B9B6E] mb-6">Venda, compre ou troque no AcheMeCoisas</p>
                <Link
                  href="/acheme-coisas/postar"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#A8C97F]/20 border-2 border-[#A8C97F] text-[#A8C97F] font-semibold rounded-full hover:bg-[#A8C97F]/30 transition-all"
                >
                  <PlusCircle className="w-5 h-5" />
                  Criar Anúncio
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-xl overflow-hidden hover:border-[#A8C97F] transition-all group relative"
                  >
                    {/* Featured Badge */}
                    {listing.is_featured && (
                      <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] text-[#0a0a0a] text-xs font-bold px-3 py-1 rounded-full">
                        DESTAQUE
                      </div>
                    )}

                    {/* Image */}
                    <div className="aspect-video relative bg-[#0a0a0a]">
                      {listing.photos && listing.photos[0] ? (
                        <Image src={listing.photos[0]} alt={listing.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-[#8B9B6E]" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-[#E6C98B] mb-2 truncate">{listing.title}</h3>
                      <p className="text-[#8B9B6E] text-sm mb-2">
                        {listing.city}, {listing.state}
                      </p>
                      <p className="text-[#D4AF37] font-bold text-xl mb-4">
                        R$ {listing.price?.toLocaleString("pt-BR")}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/acheme-coisas/${listing.id}`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#A8C97F]/20 border border-[#A8C97F] text-[#A8C97F] font-semibold rounded-lg hover:bg-[#A8C97F]/30 transition-all text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          disabled={deleting === listing.id}
                          className="px-4 py-2 bg-red-900/20 border border-red-500/50 text-red-400 font-semibold rounded-lg hover:bg-red-900/30 transition-all disabled:opacity-50 text-sm"
                        >
                          {deleting === listing.id ? "..." : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
