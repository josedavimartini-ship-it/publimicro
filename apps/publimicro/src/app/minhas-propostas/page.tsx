"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TrendingUp, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { useToast } from "@/components/ToastNotification";
import Link from "next/link";

interface Proposal {
  id: string;
  ad_id: string;
  amount: number;
  message: string | null;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  // Joined data
  ad_title: string;
  ad_type: "property" | "listing";
}

export default function MinhasPropostasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/entrar?redirect=/minhas-propostas");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadProposals();
    }
  }, [user]);

  const loadProposals = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load proposals from proposals table
      const { data, error } = await supabase
        .from("proposals")
        .select(`
          id,
          property_id,
          amount,
          message,
          status,
          created_at
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform and fetch property names
      const proposalsWithDetails = await Promise.all(
        (data || []).map(async (prop) => {
          // Try to get property name from properties table first
          let propData = await supabase
            .from("properties")
            .select("title")
            .eq("id", prop.property_id)
            .single();

          // If not found in properties, try sitios (legacy)
          if (propData.error || !propData.data) {
            const { data: sitioData, error: sitioError } = await supabase
              .from("sitios")
              .select("nome")
              .eq("id", prop.property_id)
              .single();
            
            if (!sitioError && sitioData) {
              propData = { data: { title: sitioData.nome }, error: null, count: null, status: 200, statusText: "OK" };
            }
          }

          return {
            id: prop.id,
            ad_id: prop.property_id,
            amount: prop.amount,
            message: prop.message,
            status: prop.status as "pending" | "accepted" | "rejected",
            created_at: prop.created_at,
            ad_title: propData.data?.title || "Propriedade",
            ad_type: "property" as const,
          };
        })
      );

      setProposals(proposalsWithDetails);
    } catch (error: any) {
      showToast({ 
        type: "error", 
        title: "Erro ao carregar propostas",
        message: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Aceita";
      case "rejected":
        return "Recusada";
      default:
        return "Pendente";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-400 bg-green-900/20 border-green-500/50";
      case "rejected":
        return "text-red-400 bg-red-900/20 border-red-500/50";
      default:
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500/50";
    }
  };

  const filteredProposals = proposals.filter((p) => filter === "all" || p.status === filter);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl">Carregando propostas...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] bg-clip-text text-transparent mb-2">
            Minhas Propostas
          </h1>
          <p className="text-[#8B9B6E]">Acompanhe o status dos seus lances e propostas</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 font-semibold rounded-full whitespace-nowrap transition-all ${
              filter === "all"
                ? "bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] text-[#0a0a0a]"
                : "bg-[#1a1a1a] border-2 border-[#2a2a1a] text-[#8B9B6E] hover:border-[#A8C97F]"
            }`}
          >
            Todas ({proposals.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-6 py-3 font-semibold rounded-full whitespace-nowrap transition-all ${
              filter === "pending"
                ? "bg-yellow-500 text-[#0a0a0a]"
                : "bg-[#1a1a1a] border-2 border-[#2a2a1a] text-[#8B9B6E] hover:border-[#A8C97F]"
            }`}
          >
            Pendentes ({proposals.filter((p) => p.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("accepted")}
            className={`px-6 py-3 font-semibold rounded-full whitespace-nowrap transition-all ${
              filter === "accepted"
                ? "bg-green-500 text-[#0a0a0a]"
                : "bg-[#1a1a1a] border-2 border-[#2a2a1a] text-[#8B9B6E] hover:border-[#A8C97F]"
            }`}
          >
            Aceitas ({proposals.filter((p) => p.status === "accepted").length})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-6 py-3 font-semibold rounded-full whitespace-nowrap transition-all ${
              filter === "rejected"
                ? "bg-red-500 text-[#0a0a0a]"
                : "bg-[#1a1a1a] border-2 border-[#2a2a1a] text-[#8B9B6E] hover:border-[#A8C97F]"
            }`}
          >
            Recusadas ({proposals.filter((p) => p.status === "rejected").length})
          </button>
        </div>

        {/* Proposals List */}
        {filteredProposals.length === 0 ? (
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-12 text-center">
            <TrendingUp className="w-16 h-16 text-[#8B9B6E] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#E6C98B] mb-2">
              {filter === "all" ? "Nenhuma proposta enviada" : `Nenhuma proposta ${getStatusText(filter)}`}
            </h3>
            <p className="text-[#8B9B6E] mb-6">Explore propriedades e faça sua primeira proposta</p>
            <Link
              href="/imoveis"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#A8C97F]/20 border-2 border-[#A8C97F] text-[#A8C97F] font-semibold rounded-full hover:bg-[#A8C97F]/30 transition-all"
            >
              Ver Propriedades
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-xl p-6 hover:border-[#A8C97F] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-[#E6C98B]">{proposal.ad_title}</h3>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                          proposal.status
                        )}`}
                      >
                        {getStatusIcon(proposal.status)}
                        {getStatusText(proposal.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-[#D4AF37] font-bold text-2xl">
                        R$ {proposal.amount.toLocaleString("pt-BR")}
                      </p>
                      <p className="text-[#8B9B6E] text-sm">
                        Enviada em {new Date(proposal.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {proposal.message && (
                      <div className="bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg p-4">
                        <p className="text-[#E6C98B] text-sm italic">"{proposal.message}"</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Action */}
                  <Link
                    href={`/${proposal.ad_type === "property" ? "imoveis" : "acheme-coisas"}/${proposal.ad_id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-[#A8C97F]/20 border-2 border-[#A8C97F] text-[#A8C97F] font-semibold rounded-full hover:bg-[#A8C97F]/30 transition-all whitespace-nowrap"
                  >
                    <Eye className="w-5 h-5" />
                    Ver Anúncio
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
