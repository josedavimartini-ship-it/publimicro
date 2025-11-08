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
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);
      
      // Fetch user data
      import AccountDashboard from "@/components/AccountDashboard";
      import { useRouter } from "next/navigation";
      import { useState } from "react";

      export default function ContaPage() {
        const [open, setOpen] = useState(true);
        const router = useRouter();
        return (
          <AccountDashboard open={open} onClose={() => { setOpen(false); router.push("/"); }} />
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