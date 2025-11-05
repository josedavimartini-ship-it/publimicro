"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { 
  User, LogOut, Heart, FileText, Calendar, Settings, 
  Home, TrendingUp, CheckCircle, Clock, XCircle 
} from 'lucide-react';

export default function ContaPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data
  const [properties, setProperties] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/entrar?redirect=/conta');
        return;
      }
      
      setUser(user);
      
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);
      
      // Fetch user data
      await Promise.all([
        fetchProperties(user.id),
        fetchProposals(user.id),
        fetchVisits(user.id),
        fetchFavorites(user.id),
      ]);
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async (userId: string) => {
    const { data } = await supabase
      .from('sitios')
      .select('*')
      .eq('user_id', userId);
    setProperties(data || []);
  };

  const fetchProposals = async (userId: string) => {
    const { data } = await supabase
      .from('proposals')
      .select('*, sitios(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setProposals(data || []);
  };

  const fetchVisits = async (userId: string) => {
    const { data } = await supabase
      .from('visits')
      .select('*, sitios(*)')
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: false });
    setVisits(data || []);
  };

  const fetchFavorites = async (userId: string) => {
    const { data } = await supabase
      .from('favoritos')
      .select('*, sitios(*)')
      .eq('user_id', userId);
    setFavorites(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border-2 border-[#3a3a3a] rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#B87333] to-[#FFD700] rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-[#0a0a0a]" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#B87333] to-[#FFD700]">
                  {profile?.full_name || user?.email}
                </h1>
                <p className="text-[#676767]">{user?.email}</p>
                <p className="text-[#D4A574] text-sm mt-1">
                  Membro desde {new Date(user?.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-900/20 border border-red-500/50 hover:bg-red-900/30 text-red-400 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-6">
            <Home className="w-8 h-8 text-[#B87333] mb-2" />
            <div className="text-3xl font-bold text-[#e6c86b]">{properties.length}</div>
            <div className="text-[#676767] text-sm">Minhas Propriedades</div>
          </div>
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-6">
            <TrendingUp className="w-8 h-8 text-[#A8C97F] mb-2" />
            <div className="text-3xl font-bold text-[#e6c86b]">{proposals.length}</div>
            <div className="text-[#676767] text-sm">Propostas Enviadas</div>
          </div>
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-6">
            <Calendar className="w-8 h-8 text-[#D4A574] mb-2" />
            <div className="text-3xl font-bold text-[#e6c86b]">{visits.length}</div>
            <div className="text-[#676767] text-sm">Visitas Agendadas</div>
          </div>
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-6">
            <Heart className="w-8 h-8 text-[#E6C98B] mb-2" />
            <div className="text-3xl font-bold text-[#e6c86b]">{favorites.length}</div>
            <div className="text-[#676767] text-sm">Gostei</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Home },
            { id: 'properties', label: 'Minhas Propriedades', icon: Home },
            { id: 'proposals', label: 'Propostas', icon: TrendingUp },
            { id: 'visits', label: 'Visitas', icon: Calendar },
            { id: 'favorites', label: 'Gostei', icon: Heart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#B87333] to-[#FFD700] text-[#0a0a0a]'
                  : 'bg-[#2a2a2a] border border-[#3a3a3a] text-[#676767] hover:text-[#D4A574]'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#D4A574]">Bem-vindo de volta!</h2>
              <p className="text-[#676767]">
                Aqui está um resumo da sua atividade na plataforma.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/postar" className="p-6 bg-gradient-to-br from-[#A8C97F]/20 to-[#0D7377]/20 border border-[#A8C97F]/50 rounded-xl hover:scale-105 transition">
                  <Home className="w-12 h-12 text-[#A8C97F] mb-4" />
                  <h3 className="text-xl font-bold text-[#A8C97F] mb-2">Anunciar Propriedade</h3>
                  <p className="text-[#676767] text-sm">Publique sua propriedade gratuitamente</p>
                </Link>
                
                <Link href="/favoritos" className="p-6 bg-gradient-to-br from-[#E6C98B]/20 to-[#B87333]/20 border border-[#E6C98B]/50 rounded-xl hover:scale-105 transition">
                  <Heart className="w-12 h-12 text-[#E6C98B] mb-4" />
                  <h3 className="text-xl font-bold text-[#E6C98B] mb-2">Minhas Propriedades Favoritas</h3>
                  <p className="text-[#676767] text-sm">{favorites.length} propriedades salvas</p>
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div>
              <h2 className="text-2xl font-bold text-[#D4A574] mb-6">Minhas Propriedades</h2>
              {properties.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 text-[#676767] mx-auto mb-4" />
                  <p className="text-[#676767] mb-4">Você ainda não anunciou nenhuma propriedade</p>
                  <Link 
                    href="/postar"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white font-bold rounded-lg hover:scale-105 transition"
                  >
                    Anunciar Agora
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map((prop) => (
                    <div key={prop.id} className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
                      <h3 className="text-[#D4A574] font-bold mb-2">{prop.nome}</h3>
                      <p className="text-[#676767] text-sm">{prop.localizacao}</p>
                      <p className="text-[#A8C97F] font-bold mt-2">R$ {prop.preco?.toLocaleString('pt-BR')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'proposals' && (
            <div>
              <h2 className="text-2xl font-bold text-[#D4A574] mb-6">Minhas Propostas</h2>
              {proposals.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-[#676767] mx-auto mb-4" />
                  <p className="text-[#676767]">Você ainda não fez nenhuma proposta</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((prop) => (
                    <div key={prop.id} className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-[#D4A574] font-bold">{prop.sitios?.nome}</h3>
                        <p className="text-[#A8C97F] font-bold">R$ {prop.amount?.toLocaleString('pt-BR')}</p>
                        <p className="text-[#676767] text-sm">{new Date(prop.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {prop.status === 'pending' && (
                          <>
                            <Clock className="w-5 h-5 text-yellow-500" />
                            <span className="text-yellow-500 text-sm">Pendente</span>
                          </>
                        )}
                        {prop.status === 'accepted' && (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-green-500 text-sm">Aceita</span>
                          </>
                        )}
                        {prop.status === 'rejected' && (
                          <>
                            <XCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-500 text-sm">Recusada</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'visits' && (
            <div>
              <h2 className="text-2xl font-bold text-[#D4A574] mb-6">Minhas Visitas</h2>
              {visits.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-[#676767] mx-auto mb-4" />
                  <p className="text-[#676767]">Você ainda não agendou nenhuma visita</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visits.map((visit) => (
                    <div key={visit.id} className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4">
                      <h3 className="text-[#D4A574] font-bold">{visit.sitios?.nome}</h3>
                      <p className="text-[#676767] text-sm">
                        {new Date(visit.scheduled_date).toLocaleDateString('pt-BR')} às {visit.scheduled_time}
                      </p>
                      <div className="mt-2">
                        {visit.status === 'pending' && (
                          <span className="px-3 py-1 bg-yellow-900/20 border border-yellow-500/50 text-yellow-500 rounded-full text-xs">
                            Aguardando confirmação
                          </span>
                        )}
                        {visit.status === 'confirmed' && (
                          <span className="px-3 py-1 bg-green-900/20 border border-green-500/50 text-green-500 rounded-full text-xs">
                            Confirmada
                          </span>
                        )}
                        {visit.status === 'completed' && (
                          <span className="px-3 py-1 bg-blue-900/20 border border-blue-500/50 text-blue-500 rounded-full text-xs">
                            Concluída
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold text-[#D4A574] mb-6">Propriedades que Gostei</h2>
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-[#676767] mx-auto mb-4" />
                  <p className="text-[#676767] mb-4">Você ainda não salvou nenhuma propriedade</p>
                  <Link 
                    href="/"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-[#E6C98B] to-[#B87333] text-[#0a0a0a] font-bold rounded-lg hover:scale-105 transition"
                  >
                    Explorar Propriedades
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map((fav) => (
                    <Link 
                      key={fav.id} 
                      href={`/imoveis/${fav.sitios?.id}`}
                      className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-4 hover:border-[#A8C97F] transition"
                    >
                      <h3 className="text-[#D4A574] font-bold mb-2">{fav.sitios?.nome}</h3>
                      <p className="text-[#676767] text-sm">{fav.sitios?.localizacao}</p>
                      <p className="text-[#A8C97F] font-bold mt-2">R$ {fav.sitios?.preco?.toLocaleString('pt-BR')}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}