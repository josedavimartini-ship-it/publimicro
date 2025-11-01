"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  LayoutDashboard,
  Home,
  Users,
  Mail,
  DollarSign,
  LogOut,
  ArrowLeft,
  Eye,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface AdminStats {
  totalProperties: number;
  totalUsers: number;
  totalBids: number;
  totalContacts: number;
  activeBids: number;
  pendingContacts: number;
  avgBidAmount: number;
}

interface Property {
  id: string;
  nome: string;
  localizacao: string;
  preco: number;
  lance_inicial: number;
  created_at: string;
}

interface Bid {
  id: string;
  property_id: string;
  user_id: string;
  bid_amount: number;
  message: string;
  status: string;
  created_at: string;
  sitios: { nome: string } | { nome: string }[];
}

interface Contact {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  status: string;
  created_at: string;
}

type Tab = "dashboard" | "properties" | "bids" | "contacts" | "users";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/entrar");
        return;
      }

      // Check if user is admin
      const adminEmails = [
        "admin@publimicro.com.br",
        "contato@publimicro.com.br",
        user.email, // Allow current user for testing
      ];

      const userIsAdmin = adminEmails.includes(user.email || "");
      
      if (!userIsAdmin) {
        alert("Acesso negado. Apenas administradores podem acessar esta página.");
        router.push("/");
        return;
      }

      setIsAdmin(true);
      await loadDashboardData();
    } catch (error) {
      console.error("Error checking admin access:", error);
      router.push("/entrar");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [
        { count: propertiesCount },
        { count: usersCount },
        { count: bidsCount },
        { count: contactsCount },
        { count: activeBidsCount },
        { count: pendingContactsCount },
        { data: avgBidData },
      ] = await Promise.all([
        supabase.from("sitios").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("bids").select("*", { count: "exact", head: true }),
        supabase.from("contacts").select("*", { count: "exact", head: true }),
        supabase.from("bids").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contacts").select("*", { count: "exact", head: true }).eq("status", "novo"),
        supabase.from("bids").select("bid_amount"),
      ]);

      const avgBid = avgBidData && avgBidData.length > 0
        ? avgBidData.reduce((sum, b) => sum + b.bid_amount, 0) / avgBidData.length
        : 0;

      setStats({
        totalProperties: propertiesCount || 0,
        totalUsers: usersCount || 0,
        totalBids: bidsCount || 0,
        totalContacts: contactsCount || 0,
        activeBids: activeBidsCount || 0,
        pendingContacts: pendingContactsCount || 0,
        avgBidAmount: avgBid,
      });

      await loadProperties();
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const loadProperties = async () => {
    const { data } = await supabase
      .from("sitios")
      .select("id, nome, localizacao, preco, lance_inicial, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    
    setProperties(data || []);
  };

  const loadBids = async () => {
    const { data } = await supabase
      .from("bids")
      .select(`
        id,
        property_id,
        user_id,
        bid_amount,
        message,
        status,
        created_at,
        sitios (nome)
      `)
      .order("created_at", { ascending: false })
      .limit(50);
    
    setBids(data || []);
  };

  const loadContacts = async () => {
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    
    setContacts(data || []);
  };

  const updateBidStatus = async (bidId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bids")
        .update({ status: newStatus })
        .eq("id", bidId);

      if (error) throw error;

      alert(`Lance ${newStatus === "accepted" ? "aceito" : "rejeitado"} com sucesso!`);
      await loadBids();
    } catch (error: any) {
      alert("Erro ao atualizar lance: " + error.message);
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contacts")
        .update({ status: newStatus })
        .eq("id", contactId);

      if (error) throw error;

      alert("Status atualizado com sucesso!");
      await loadContacts();
    } catch (error: any) {
      alert("Erro ao atualizar contato: " + error.message);
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta propriedade?")) return;

    try {
      const { error } = await supabase
        .from("sitios")
        .delete()
        .eq("id", propertyId);

      if (error) throw error;

      alert("Propriedade excluída com sucesso!");
      await loadProperties();
    } catch (error: any) {
      alert("Erro ao excluir propriedade: " + error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    if (!isAdmin) return;

    if (activeTab === "properties") loadProperties();
    if (activeTab === "bids") loadBids();
    if (activeTab === "contacts") loadContacts();
  }, [activeTab, isAdmin]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl">Verificando permissões...</div>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1a1a1a] border-r-2 border-[#2a2a1a] p-6 flex flex-col">
          <div className="mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#D4A574] hover:text-[#FF6B35] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Voltar ao Site</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4A574] to-[#FF6B35] mb-8">
            Admin Panel
          </h1>

          <nav className="space-y-2 flex-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold"
                  : "text-[#8B9B6E] hover:bg-[#2a2a1a]"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("properties")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "properties"
                  ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold"
                  : "text-[#8B9B6E] hover:bg-[#2a2a1a]"
              }`}
            >
              <Home className="w-5 h-5" />
              Propriedades
            </button>

            <button
              onClick={() => setActiveTab("bids")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "bids"
                  ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold"
                  : "text-[#8B9B6E] hover:bg-[#2a2a1a]"
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Lances
              {stats && stats.activeBids > 0 && (
                <span className="ml-auto bg-[#FF6B35] text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded-full">
                  {stats.activeBids}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("contacts")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "contacts"
                  ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold"
                  : "text-[#8B9B6E] hover:bg-[#2a2a1a]"
              }`}
            >
              <Mail className="w-5 h-5" />
              Contatos
              {stats && stats.pendingContacts > 0 && (
                <span className="ml-auto bg-[#FF6B35] text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded-full">
                  {stats.pendingContacts}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold"
                  : "text-[#8B9B6E] hover:bg-[#2a2a1a]"
              }`}
            >
              <Users className="w-5 h-5" />
              Usuários
            </button>
          </nav>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all mt-4"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && stats && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-[#D4A574]">Dashboard</h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FF6B35]/20 rounded-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-[#FF6B35]" />
                    </div>
                    <div>
                      <p className="text-[#8B9B6E] text-sm">Propriedades</p>
                      <p className="text-3xl font-bold text-[#D4A574]">{stats.totalProperties}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#8B9B6E]/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-[#8B9B6E]" />
                    </div>
                    <div>
                      <p className="text-[#8B9B6E] text-sm">Lances Ativos</p>
                      <p className="text-3xl font-bold text-[#D4A574]">{stats.activeBids}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#D4A574]/20 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#D4A574]" />
                    </div>
                    <div>
                      <p className="text-[#8B9B6E] text-sm">Contatos Pendentes</p>
                      <p className="text-3xl font-bold text-[#D4A574]">{stats.pendingContacts}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FF6B35]/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#FF6B35]" />
                    </div>
                    <div>
                      <p className="text-[#8B9B6E] text-sm">Usuários</p>
                      <p className="text-3xl font-bold text-[#D4A574]">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#D4A574] mb-4">Estatísticas de Lances</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8B9B6E]">Total de Lances</span>
                      <span className="text-[#D4A574] font-bold">{stats.totalBids}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8B9B6E]">Lance Médio</span>
                      <span className="text-[#D4A574] font-bold">
                        R$ {stats.avgBidAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8B9B6E]">Lances Pendentes</span>
                      <span className="text-[#FF6B35] font-bold">{stats.activeBids}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#D4A574] mb-4">Contatos</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8B9B6E]">Total de Contatos</span>
                      <span className="text-[#D4A574] font-bold">{stats.totalContacts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8B9B6E]">Novos</span>
                      <span className="text-[#FF6B35] font-bold">{stats.pendingContacts}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Properties Tab */}
          {activeTab === "properties" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-[#D4A574]">Propriedades</h2>
                <Link
                  href="/anunciar"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Nova Propriedade
                </Link>
              </div>

              <div className="bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0a0a0a]">
                      <tr>
                        <th className="px-6 py-4 text-left text-[#D4A574] font-semibold">Nome</th>
                        <th className="px-6 py-4 text-left text-[#D4A574] font-semibold">Localização</th>
                        <th className="px-6 py-4 text-left text-[#D4A574] font-semibold">Preço</th>
                        <th className="px-6 py-4 text-left text-[#D4A574] font-semibold">Lance Inicial</th>
                        <th className="px-6 py-4 text-left text-[#D4A574] font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr key={property.id} className="border-t border-[#2a2a1a] hover:bg-[#2a2a1a]/30 transition-colors">
                          <td className="px-6 py-4 text-[#8B9B6E]">{property.nome}</td>
                          <td className="px-6 py-4 text-[#8B9B6E]">{property.localizacao}</td>
                          <td className="px-6 py-4 text-[#D4A574] font-semibold">
                            R$ {property.preco?.toLocaleString("pt-BR") || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-[#FF6B35] font-semibold">
                            R$ {property.lance_inicial?.toLocaleString("pt-BR") || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/imoveis/${property.id}`}
                                className="p-2 bg-[#8B9B6E]/20 hover:bg-[#8B9B6E]/30 rounded-lg transition-colors"
                                title="Visualizar"
                              >
                                <Eye className="w-4 h-4 text-[#8B9B6E]" />
                              </Link>
                              <button
                                onClick={() => deleteProperty(property.id)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Bids Tab */}
          {activeTab === "bids" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#D4A574]">Lances</h2>

              <div className="bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0a0a0a]">
                      <tr>
                        <th className="px-6 py-4 text-left text-[#D4A574] font-semibold">Propriedade</th>
                        <th className="px-6 py-4 text-left text-[#D4A574] font-semibold">Valor</th>
                        <th className="px-6 py-4 text-left text-[#D4A574] font-semibold">Mensagem</th>
                        <th className="px-6 py-4 text-left text-[#D4A574] font-semibold">Status</th>
                        <th className="px-6 py-4 text-left text-[#D4A574] font-semibold">Data</th>
                        <th className="px-6 py-4 text-left text-[#D4A574] font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bids.map((bid) => (
                        <tr key={bid.id} className="border-t border-[#2a2a1a] hover:bg-[#2a2a1a]/30 transition-colors">
                          <td className="px-6 py-4 text-[#8B9B6E]">
                            {Array.isArray(bid.sitios) ? bid.sitios[0]?.nome : bid.sitios?.nome || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-[#FF6B35] font-bold">
                            R$ {bid.bid_amount.toLocaleString("pt-BR")}
                          </td>
                          <td className="px-6 py-4 text-[#8B9B6E] max-w-xs truncate">
                            {bid.message || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                bid.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : bid.status === "accepted"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {bid.status === "pending" ? "Pendente" : bid.status === "accepted" ? "Aceito" : "Rejeitado"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#8B9B6E] text-sm">
                            {new Date(bid.created_at).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-6 py-4">
                            {bid.status === "pending" && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateBidStatus(bid.id, "accepted")}
                                  className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                                  title="Aceitar"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                </button>
                                <button
                                  onClick={() => updateBidStatus(bid.id, "rejected")}
                                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                  title="Rejeitar"
                                >
                                  <XCircle className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === "contacts" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#D4A574]">Contatos</h2>

              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#D4A574]">{contact.nome}</h3>
                        <p className="text-[#8B9B6E] text-sm">{contact.email}</p>
                        {contact.telefone && (
                          <p className="text-[#8B9B6E] text-sm">{contact.telefone}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            contact.status === "novo"
                              ? "bg-[#FF6B35]/20 text-[#FF6B35]"
                              : contact.status === "em_analise"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : contact.status === "respondido"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-[#676767]/20 text-[#676767]"
                          }`}
                        >
                          {contact.status === "novo"
                            ? "Novo"
                            : contact.status === "em_analise"
                            ? "Em Análise"
                            : contact.status === "respondido"
                            ? "Respondido"
                            : "Arquivado"}
                        </span>
                        <span className="text-[#676767] text-xs">
                          {new Date(contact.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    <p className="text-[#8B9B6E] mb-4">{contact.mensagem}</p>

                    <div className="flex flex-wrap gap-2">
                      {contact.status === "novo" && (
                        <button
                          onClick={() => updateContactStatus(contact.id, "em_analise")}
                          className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors text-sm font-semibold"
                        >
                          Marcar em Análise
                        </button>
                      )}
                      {(contact.status === "novo" || contact.status === "em_analise") && (
                        <button
                          onClick={() => updateContactStatus(contact.id, "respondido")}
                          className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-sm font-semibold"
                        >
                          Marcar como Respondido
                        </button>
                      )}
                      <button
                        onClick={() => updateContactStatus(contact.id, "arquivado")}
                        className="px-4 py-2 bg-[#676767]/20 hover:bg-[#676767]/30 text-[#676767] rounded-lg transition-colors text-sm font-semibold"
                      >
                        Arquivar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#D4A574]">Usuários</h2>
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-8 text-center">
                <Users className="w-16 h-16 text-[#8B9B6E] mx-auto mb-4" />
                <p className="text-[#8B9B6E] text-lg">
                  Gerenciamento de usuários em desenvolvimento...
                </p>
                <p className="text-[#676767] text-sm mt-2">
                  Total de usuários cadastrados: {stats?.totalUsers || 0}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
