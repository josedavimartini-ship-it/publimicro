"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabaseBrowser';
import { Check, Star, Zap, Crown, Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const PLANS = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    description: 'Ideal para começar',
    features: [
      'Até 3 anúncios ativos',
      'Fotos básicas (5 por anúncio)',
      'Validade de 30 dias',
      'Suporte por email',
    ],
    icon: Star,
    popular: false,
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 49.90,
    description: 'Para corretores e proprietários',
    features: [
      'Até 20 anúncios ativos',
      'Fotos ilimitadas',
      'Validade de 90 dias',
      'Destaque na busca',
      'Estatísticas de visualização',
      'Suporte prioritário',
    ],
    icon: Zap,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 149.90,
    description: 'Para imobiliárias',
    features: [
      'Anúncios ilimitados',
      'Fotos e vídeos ilimitados',
      'Validade ilimitada',
      'Destaque premium',
      'Dashboard completo',
      'API de integração',
      'Gerente de conta dedicado',
    ],
    icon: Crown,
    popular: false,
  },
];

export default function AssinaturaPage() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch user's current subscription
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();
        
        if (profile?.subscription_tier) {
          setCurrentPlan(profile.subscription_tier);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      router.push('/entrar?redirect=/assinatura');
      return;
    }

    if (planId === 'free') {
      // Free plan doesn't need payment
      return;
    }

    setProcessingPlan(planId);

    try {
      // Create checkout session via API
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Erro ao criar sessão de pagamento');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Erro ao processar. Tente novamente.');
    } finally {
      setProcessingPlan(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          Carregando...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs />
        
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C9A87C] to-[#B8904D] mb-4">
            Planos e Preços
          </h1>
          <p className="text-[#B8A890] max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades. 
            Todos os planos incluem acesso à nossa plataforma completa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-[#1a1a1a] border-2 rounded-2xl p-8 transition-all ${
                  plan.popular
                    ? 'border-[#A8C97F] scale-105'
                    : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#A8C97F] text-black px-4 py-1 rounded-full text-sm font-bold">
                    Mais Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${
                    plan.popular ? 'bg-[#A8C97F]/20' : 'bg-[#2a2a2a]'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      plan.popular ? 'text-[#A8C97F]' : 'text-[#8B9B6E]'
                    }`} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#E6C98B]">{plan.name}</h2>
                  <p className="text-[#8B9B6E] text-sm mt-1">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-black text-[#D4C4A8]">
                    {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2).replace('.', ',')}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-[#676767] text-sm">/mês</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-[#A8C97F]' : 'text-[#6B7F5C]'
                      }`} />
                      <span className="text-[#B8A890] text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => { void handleSelectPlan(plan.id); }}
                  disabled={isCurrentPlan || processingPlan === plan.id}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    isCurrentPlan
                      ? 'bg-[#2a2a2a] text-[#676767] cursor-not-allowed'
                      : plan.popular
                        ? 'bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] text-[#D4C4A8] hover:from-[#7A8F6B] hover:to-[#3A6F7F]'
                        : 'border-2 border-[#6B7F5C] text-[#6B7F5C] hover:bg-[#6B7F5C]/10'
                  }`}
                >
                  {processingPlan === plan.id ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : isCurrentPlan ? (
                    'Plano Atual'
                  ) : plan.price === 0 ? (
                    'Começar Grátis'
                  ) : (
                    'Assinar Agora'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#676767] text-sm">
            Pagamento seguro via Stripe. Cancele quando quiser.
          </p>
        </div>
      </div>
    </main>
  );
}





















