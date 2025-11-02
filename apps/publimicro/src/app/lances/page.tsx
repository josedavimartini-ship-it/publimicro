"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Eye, DollarSign, Calendar } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/Skeleton";

interface Bid {
  id: string;
  property_id: string;
  bid_amount: number;
  message: string;
  status: "pending" | "accepted" | "rejected" | "counter";
  created_at: string;
  updated_at: string;
  sitios: {
    nome: string;
    localizacao: string;
    preco: number;
    lance_inicial: number;
    fotos: string[];
  } | null;
  highest_bid?: number;
  competing_bids?: number;
}

export default function LancesPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUserAndBids();
  }, [filter]);

  const loadUserAndBids = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = "/entrar";
        return;
      }

      setUserId(user.id);
      await loadBids(user.id);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadBids = async (userId: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from("bids")
        .select(`
          *,
          sitios (
            nome,
            localizacao,
            preco,
            lance_inicial,
            fotos
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Load competing bids count and highest bid for each property
      const bidsWithStats = await Promise.all(
        (data || []).map(async (bid) => {
          const { count } = await supabase
            .from("bids")
            .select("*", { count: "exact", head: true })
            .eq("property_id", bid.property_id)
            .neq("status", "rejected");

          const { data: highestBidData } = await supabase
            .from("bids")
            .select("bid_amount")
            .eq("property_id", bid.property_id)
            .neq("status", "rejected")
            .order("bid_amount", { ascending: false })
            .limit(1)
            .single();

          return {
            ...bid,
            competing_bids: (count || 1) - 1, // Subtract own bid
            highest_bid: highestBidData?.bid_amount || bid.bid_amount
          };
        })
      );

      setBids(bidsWithStats);
    } catch (error) {
      console.error("Error loading bids:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-[#B7791F]" />;
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-[#8B9B6E]" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "counter":
        return <AlertCircle className="w-5 h-5 text-[#6A1B9A]" />;
      default:
        return <Clock className="w-5 h-5 text-[#676767]" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Aguardando",
      accepted: "Aceito",
      rejected: "Recusado",
      counter: "Contraproposta"
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-[#B7791F]/20 text-[#B7791F] border-[#B7791F]",
      accepted: "bg-[#A8C97F]/20 text-[#A8C97F] border-[#A8C97F]",
      rejected: "bg-red-500/20 text-red-400 border-red-500",
      counter: "bg-[#6A1B9A]/20 text-[#6A1B9A] border-[#6A1B9A]"
    };
    return colors[status as keyof typeof colors] || "bg-[#2a2a1a] text-[#676767] border-[#676767]";
  };

  const stats = {
    total: bids.length,
    pending: bids.filter(b => b.status === "pending").length,
    accepted: bids.filter(b => b.status === "accepted").length,
    rejected: bids.filter(b => b.status === "rejected").length,
    totalAmount: bids.reduce((sum, bid) => sum + bid.bid_amount, 0)
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] to-[#B7791F] mb-2">
            Meus Lances
          </h1>
          <p className="text-[#8B9B6E]">
            Acompanhe todos os seus lances em propriedades
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-xl p-4">
            <p className="text-[#A8C97F] text-sm mb-1">Total de Lances</p>
            <p className="text-2xl font-bold text-[#E6C98B]">{stats.total}</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#B7791F]/30 rounded-xl p-4">
            <p className="text-[#A8C97F] text-sm mb-1">Aguardando</p>
            <p className="text-2xl font-bold text-[#B7791F]">{stats.pending}</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#A8C97F]/30 rounded-xl p-4">
            <p className="text-[#A8C97F] text-sm mb-1">Aceitos</p>
            <p className="text-2xl font-bold text-[#A8C97F]">{stats.accepted}</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-red-500/30 rounded-xl p-4">
            <p className="text-[#A8C97F] text-sm mb-1">Recusados</p>
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#0D7377]/30 rounded-xl p-4">
            <p className="text-[#A8C97F] text-sm mb-1">Valor Total</p>
            <p className="text-lg font-bold text-[#0D7377]">R$ {stats.totalAmount.toLocaleString("pt-BR")}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {[
            { value: "all", label: "Todos" },
            { value: "pending", label: "Aguardando" },
            { value: "accepted", label: "Aceitos" },
            { value: "rejected", label: "Recusados" }
          ].map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value as any)}
              className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${
                filter === filterOption.value
                  ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white"
                  : "bg-[#2a2a1a] text-[#A8C97F] hover:bg-[#3a3a2a]"
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Bids List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} variant="card" className="w-full h-48" />
            ))}
          </div>
        ) : bids.length > 0 ? (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#A8C97F] transition-all"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Property Image */}
                    <div className="w-full md:w-48 h-32 bg-[#2a2a1a] rounded-lg overflow-hidden flex-shrink-0">
                      {bid.sitios?.fotos && bid.sitios.fotos[0] ? (
                        <Image
                          src={bid.sitios.fotos[0]}
                          alt={bid.sitios.nome || "Propriedade"}
                          width={192}
                          height={128}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <TrendingUp className="w-12 h-12 text-[#959595]" />
                        </div>
                      )}
                    </div>

                    {/* Bid Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link
                            href={`/imoveis/${bid.property_id}`}
                            className="text-xl font-bold text-[#E6C98B] hover:text-[#A8C97F] transition-colors"
                          >
                            {bid.sitios?.nome || "Propriedade"}
                          </Link>
                          <p className="text-[#A8C97F] text-sm mt-1">
                            {bid.sitios?.localizacao || "Localização não disponível"}
                          </p>
                        </div>

                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getStatusColor(bid.status)}`}>
                          {getStatusIcon(bid.status)}
                          <span className="font-semibold text-sm">{getStatusLabel(bid.status)}</span>
                        </div>
                      </div>

                      {/* Bid Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-[#676767] text-xs mb-1">Seu Lance</p>
                          <p className="text-[#B7791F] font-bold text-lg">
                            R$ {bid.bid_amount.toLocaleString("pt-BR")}
                          </p>
                        </div>

                        <div>
                          <p className="text-[#676767] text-xs mb-1">Lance Mais Alto</p>
                          <p className="text-[#E6C98B] font-bold text-lg">
                            R$ {bid.highest_bid?.toLocaleString("pt-BR") || "-"}
                          </p>
                          {bid.highest_bid && bid.highest_bid > bid.bid_amount && (
                            <p className="text-red-400 text-xs mt-1">🔥 Você foi superado</p>
                          )}
                        </div>

                        <div>
                          <p className="text-[#676767] text-xs mb-1">Lances Concorrentes</p>
                          <p className="text-[#A8C97F] font-bold text-lg">
                            {bid.competing_bids || 0}
                          </p>
                        </div>

                        <div>
                          <p className="text-[#676767] text-xs mb-1">Data do Lance</p>
                          <p className="text-[#676767] text-sm">
                            {new Date(bid.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      {/* Message */}
                      {bid.message && (
                        <div className="bg-[#2a2a1a] rounded-lg p-3 mb-4">
                          <p className="text-[#8B9B6E] text-sm">{bid.message}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Link
                          href={`/imoveis/${bid.property_id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white font-semibold rounded-lg hover:scale-105 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Propriedade
                        </Link>

                        {bid.status === "pending" && bid.highest_bid && bid.highest_bid > bid.bid_amount && (
                          <Link
                            href={`/imoveis/${bid.property_id}#bid`}
                            className="flex items-center gap-2 px-4 py-2 border-2 border-[#E6C98B] text-[#E6C98B] font-semibold rounded-lg hover:bg-[#E6C98B]/10 transition-all"
                          >
                            <DollarSign className="w-4 h-4" />
                            Aumentar Lance
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-[#2a2a1a] rounded-full flex items-center justify-center">
              <TrendingUp className="w-16 h-16 text-[#676767]" />
            </div>
            <h2 className="text-2xl font-bold text-[#E6C98B] mb-3">
              Nenhum lance encontrado
            </h2>
            <p className="text-[#A8C97F] mb-6">
              {filter === "all"
                ? "Você ainda não fez nenhum lance em propriedades"
                : `Nenhum lance com status "${getStatusLabel(filter)}"`}
            </p>
            <Link
              href="/imoveis"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white font-bold rounded-full hover:scale-105 transition-all"
            >
              Explorar Propriedades
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
