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
  title: string;
  location: string;
  price: number;
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
  properties: { title: string } | { title: string }[];
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
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedFilesInput, setSelectedFilesInput] = useState<FileList | null>(null);
  const [selectedKmlInput, setSelectedKmlInput] = useState<File | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [editingAdminEmails, setEditingAdminEmails] = useState(false);
  const [adminEmailsInput, setAdminEmailsInput] = useState('');
  const [bids, setBids] = useState<Bid[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [biddingOpen, setBiddingOpen] = useState<boolean | null>(null);
  const [biddingLoading, setBiddingLoading] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) fetchBiddingStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const fetchBiddingStatus = async () => {
    try {
      const res = await fetch('/api/admin/bidding/proxy');
      const j = await res.json();
      if (res.ok) setBiddingOpen(Boolean(j.bidding_open));
    } catch (err) {
      console.error('Error fetching bidding status', err);
    }
  };

  const toggleBidding = async (val: boolean) => {
    setBiddingLoading(true);
    try {
      const res = await fetch('/api/admin/bidding/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidding_open: val }),
      });
      const j = await res.json();
      if (res.ok) setBiddingOpen(Boolean(j.bidding_open));
      else throw new Error(j.error || 'Failed');
    } catch (err: any) {
      alert('Erro ao atualizar status de bidding: ' + (err.message || String(err)));
    } finally {
      setBiddingLoading(false);
    }
  };

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
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("user_profiles").select("*", { count: "exact", head: true }),
        supabase.from("proposals").select("*", { count: "exact", head: true }),
        supabase.from("contacts").select("*", { count: "exact", head: true }),
        supabase.from("proposals").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contacts").select("*", { count: "exact", head: true }).eq("status", "novo"),
        supabase.from("proposals").select("bid_amount"),
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
      .from("properties")
      .select("id, title, location, price, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    
    setProperties(data || []);
  };

  const handleMediaFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFilesInput(e.target.files);
  };

  const handleKmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setSelectedKmlInput(f || null);
  };

  const readFileAsBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const uploadPropertyMedia = async () => {
    if (!selectedPropertyId) return alert('Selecione uma propriedade');
    if (!selectedFilesInput && !selectedKmlInput) return alert('Selecione fotos ou um arquivo KML');
    setUploadingMedia(true);
    try {
      const filesArr: any[] = [];
      if (selectedFilesInput) {
        for (let i = 0; i < selectedFilesInput.length; i++) {
          const f = selectedFilesInput[i];
          const base64 = await readFileAsBase64(f);
          filesArr.push({ name: f.name, base64, mime: f.type });
        }
      }

      let kmlObj = null;
      if (selectedKmlInput) {
        const base64 = await readFileAsBase64(selectedKmlInput);
        kmlObj = { name: selectedKmlInput.name, base64, mime: selectedKmlInput.type };
      }

      const res = await fetch('/api/admin/property-media/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: selectedPropertyId, files: filesArr, kmlFile: kmlObj }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Upload failed');
      alert('Upload completo');
      // reload properties
      await loadProperties();
      setSelectedFilesInput(null);
      setSelectedKmlInput(null);
      // clear file inputs if present
      const fileInputs = document.querySelectorAll('input[type=file]') as NodeListOf<HTMLInputElement>;
      fileInputs.forEach(fi => fi.value = '');
    } catch (err: any) {
      alert('Erro no upload: ' + (err.message || String(err)));
    } finally {
      setUploadingMedia(false);
    }
  };

  const fetchAdminEmails = async () => {
    try {
      const res = await fetch('/api/admin/settings/proxy');
      const j = await res.json();
      if (res.ok) setAdminEmails(Array.isArray(j.admin_emails) ? j.admin_emails : []);
    } catch (err) {
      console.error('Error fetching admin emails', err);
    }
  };

  const saveAdminEmails = async () => {
    try {
      const arr = adminEmailsInput.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/admin/settings/proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ admin_emails: arr }) });
      const j = await res.json();
      if (res.ok) {
        setAdminEmails(arr);
        setEditingAdminEmails(false);
        alert('Admin emails updated');
      } else {
        throw new Error(j.error || 'Failed');
      }
    } catch (err: any) {
      alert('Erro ao salvar admin emails: ' + (err.message || String(err)));
    }
  };

  const loadBids = async () => {
    const { data } = await supabase
      .from("proposals")
      .select(`
        id,
        property_id,
        user_id,
        bid_amount,
        message,
        status,
        created_at,
        properties (title)
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
        .from("proposals")
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
        .from("properties")
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
        <div className="text-[#E6C98B] text-xl">Verificando permissões...</div>
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
              className="flex items-center gap-2 text-[#E6C98B] hover:text-[#A8C97F] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Voltar ao Site</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] to-[#A8C97F] mb-8">
            Admin Panel
          </h1>

          <nav className="space-y-2 flex-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-[#0a0a0a] font-bold"
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
                  ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-[#0a0a0a] font-bold"
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
                  ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-[#0a0a0a] font-bold"
                  : "text-[#8B9B6E] hover:bg-[#2a2a1a]"
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Lances
              {stats && stats.activeBids > 0 && (
                <span className="ml-auto bg-[#A8C97F] text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded-full">
                  {stats.activeBids}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("contacts")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "contacts"
                  ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-[#0a0a0a] font-bold"
                  : "text-[#8B9B6E] hover:bg-[#2a2a1a]"
              }`}
            >
              <Mail className="w-5 h-5" />
              Contatos
              {stats && stats.pendingContacts > 0 && (
                <span className="ml-auto bg-[#A8C97F] text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded-full">
                  {stats.pendingContacts}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-[#0a0a0a] font-bold"
                  : "text-[#8B9B6E] hover:bg-[#2a2a1a]"
              }`}
            >
              <Users className="w-5 h-5" />
              Usuários
            </button>
          </nav>

          {/* Quick Bidding toggle */}
          <div className="mt-4">
            <div className="px-3 py-3 bg-[#121212] rounded-lg border border-[#2a2a1a]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8B9B6E]">Bidding Season</p>
                  <p className="text-sm font-semibold text-[#E6C98B]">{biddingOpen === null ? 'Loading...' : biddingOpen ? 'Open' : 'Closed'}</p>
                </div>
                <div>
                  <button
                    disabled={biddingLoading || biddingOpen === null}
                    onClick={() => toggleBidding(!Boolean(biddingOpen))}
                    className={`px-4 py-2 rounded-full font-semibold transition-all ${biddingOpen ? 'bg-green-500/80 text-black' : 'bg-gray-700 text-white'} ${biddingLoading ? 'opacity-60 cursor-wait' : 'hover:scale-105'}`}
                  >
                    {biddingLoading ? 'Updating...' : biddingOpen ? 'Close' : 'Open'}
                  </button>
                </div>
              </div>
            </div>
          </div>

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
              <h2 className="text-3xl font-bold text-[#E6C98B]">Dashboard</h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#A8C97F]/20 rounded-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-[#A8C97F]" />
                    </div>
                    <div>
                      <p className="text-[#8B9B6E] text-sm">Propriedades</p>
                      <p className="text-3xl font-bold text-[#E6C98B]">{stats.totalProperties}</p>
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
                      <p className="text-3xl font-bold text-[#E6C98B]">{stats.activeBids}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E6C98B]/20 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#E6C98B]" />
                    </div>
                    <div>
                      <p className="text-[#8B9B6E] text-sm">Contatos Pendentes</p>
                      <p className="text-3xl font-bold text-[#E6C98B]">{stats.pendingContacts}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#A8C97F]/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#A8C97F]" />
                    </div>
                    <div>
                      <p className="text-[#8B9B6E] text-sm">Usuários</p>
                      <p className="text-3xl font-bold text-[#E6C98B]">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#E6C98B] mb-4">Estatísticas de Lances</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8B9B6E]">Total de Lances</span>
                      <span className="text-[#E6C98B] font-bold">{stats.totalBids}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8B9B6E]">Lance Médio</span>
                      <span className="text-[#E6C98B] font-bold">
                        R$ {stats.avgBidAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8B9B6E]">Lances Pendentes</span>
                      <span className="text-[#A8C97F] font-bold">{stats.activeBids}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#E6C98B] mb-4">Contatos</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8B9B6E]">Total de Contatos</span>
                      <span className="text-[#E6C98B] font-bold">{stats.totalContacts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8B9B6E]">Novos</span>
                      <span className="text-[#A8C97F] font-bold">{stats.pendingContacts}</span>
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
                <h2 className="text-3xl font-bold text-[#E6C98B]">Propriedades</h2>
                <Link
                  href="/anunciar"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Nova Propriedade
                </Link>
              </div>

              {/* Media upload small form */}
              <div className="mt-6 mb-6 p-4 bg-[#121212] border border-[#2a2a1a] rounded-lg">
                <h3 className="text-lg font-semibold text-[#E6C98B] mb-2">Upload de Fotos / KML</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="text-sm text-[#8B9B6E]">Propriedade</label>
                    <select value={selectedPropertyId || ''} onChange={(e) => setSelectedPropertyId(e.target.value)} className="w-full mt-1 p-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded">
                      <option value="">-- Selecionar --</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-[#8B9B6E]">Fotos (múltiplas)</label>
                    <input type="file" accept="image/*" multiple onChange={handleMediaFilesChange} className="w-full mt-1" />
                  </div>

                  <div>
                    <label className="text-sm text-[#8B9B6E]">Arquivo KML (opcional)</label>
                    <input type="file" accept=".kml,application/vnd.google-earth.kml+xml" onChange={handleKmlFileChange} className="w-full mt-1" />
                  </div>
                </div>

                <div className="mt-4">
                  <button onClick={uploadPropertyMedia} disabled={uploadingMedia} className="px-4 py-2 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] rounded font-semibold">
                    {uploadingMedia ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>

                {/* Admin Emails editor */}
                <div className="mt-6 p-4 bg-[#121212] border border-[#2a2a1a] rounded-lg">
                  <h3 className="text-lg font-semibold text-[#E6C98B] mb-2">Admin Allowlist</h3>
                  {!editingAdminEmails && (
                    <div>
                      <p className="text-sm text-[#8B9B6E]">Emails allowed to use admin UI:</p>
                      <ul className="mt-2 text-[#E6C98B] list-disc pl-6">
                        {adminEmails.map(e => <li key={e}>{e}</li>)}
                      </ul>
                      <div className="mt-2">
                        <button onClick={() => { setEditingAdminEmails(true); setAdminEmailsInput(adminEmails.join(', ')); fetchAdminEmails(); }} className="px-3 py-1 bg-gray-700 rounded">Edit</button>
                      </div>
                    </div>
                  )}

                  {editingAdminEmails && (
                    <div>
                      <textarea value={adminEmailsInput} onChange={(e) => setAdminEmailsInput(e.target.value)} className="w-full bg-[#0a0a0a] p-2 rounded h-24" />
                      <div className="mt-2">
                        <button onClick={saveAdminEmails} className="px-3 py-1 bg-green-600 rounded mr-2">Save</button>
                        <button onClick={() => setEditingAdminEmails(false)} className="px-3 py-1 bg-gray-700 rounded">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>

              <div className="bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0a0a0a]">
                      <tr>
                        <th className="px-6 py-4 text-left text-[#E6C98B] font-semibold">Nome</th>
                        <th className="px-6 py-4 text-left text-[#E6C98B] font-semibold">Localização</th>
                        <th className="px-6 py-4 text-left text-[#E6C98B] font-semibold">Preço</th>
                        <th className="px-6 py-4 text-left text-[#E6C98B] font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr key={property.id} className="border-t border-[#2a2a1a] hover:bg-[#2a2a1a]/30 transition-colors">
                          <td className="px-6 py-4 text-[#8B9B6E]">{property.title}</td>
                          <td className="px-6 py-4 text-[#8B9B6E]">{property.location}</td>
                          <td className="px-6 py-4 text-[#E6C98B] font-semibold">
                            R$ {property.price?.toLocaleString("pt-BR") || "N/A"}
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
              <h2 className="text-3xl font-bold text-[#E6C98B]">Lances</h2>

              <div className="bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0a0a0a]">
                      <tr>
                        <th className="px-6 py-4 text-left text-[#E6C98B] font-semibold">Propriedade</th>
                        <th className="px-6 py-4 text-left text-[#E6C98B] font-semibold">Valor</th>
                        <th className="px-6 py-4 text-left text-[#E6C98B] font-semibold">Mensagem</th>
                        <th className="px-6 py-4 text-left text-[#E6C98B] font-semibold">Status</th>
                        <th className="px-6 py-4 text-left text-[#E6C98B] font-semibold">Data</th>
                        <th className="px-6 py-4 text-left text-[#E6C98B] font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bids.map((bid) => (
                        <tr key={bid.id} className="border-t border-[#2a2a1a] hover:bg-[#2a2a1a]/30 transition-colors">
                          <td className="px-6 py-4 text-[#8B9B6E]">
                            {Array.isArray(bid.properties) ? bid.properties[0]?.title : bid.properties?.title || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-[#A8C97F] font-bold">
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
              <h2 className="text-3xl font-bold text-[#E6C98B]">Contatos</h2>

              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#E6C98B]">{contact.nome}</h3>
                        <p className="text-[#8B9B6E] text-sm">{contact.email}</p>
                        {contact.telefone && (
                          <p className="text-[#8B9B6E] text-sm">{contact.telefone}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            contact.status === "novo"
                              ? "bg-[#A8C97F]/20 text-[#A8C97F]"
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
              <h2 className="text-3xl font-bold text-[#E6C98B]">Usuários</h2>
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
