'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VerificationGate, useVerificationStatus, VerificationBadge } from '@/components/verification/VerificationGate';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  recommended?: boolean;
  stripePriceId: string;
}

const PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 0,
    interval: 'month',
    stripePriceId: '',
    features: [
      '5 anúncios ativos',
      'Fotos básicas',
      'Suporte por email',
      'Visibilidade padrão',
    ],
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 49.90,
    interval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || '',
    recommended: true,
    features: [
      '✨ Anúncios ilimitados',
      '🎯 5 Destaques por mês',
      '📸 Até 20 fotos por anúncio',
      '🚀 Impulsionamento básico',
      '⭐ Selo verificado',
      '📊 Estatísticas detalhadas',
      '💬 Suporte prioritário',
    ],
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 149.90,
    interval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || '',
    features: [
      '✨ Tudo do Profissional',
      '🎯 Destaques ilimitados',
      '🚀 Impulsionamento premium',
      '🏆 Destaque na homepage',
      '📈 Analytics avançado',
      '🤝 Gerente de conta dedicado',
      '📞 Suporte 24/7',
      '🎨 Customização de perfil',
    ],
  },
];

export default function AssinaturaPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const { verified, status } = useVerificationStatus();

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.price === 0) {
      router.push('/');
      return;
    }

    setLoading(plan.id);

    try {
      // Get auth token
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/entrar?redirect=/assinatura');
        return;
      }

      // Create checkout session
      const response = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          planId: plan.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if verification is required
        if (data.requiresVerification) {
          router.push('/verificacao');
          return;
        }
        throw new Error(data.error || 'Erro ao criar checkout');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Erro ao processar assinatura. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Planos e Preços
            </h1>
            {verified && <VerificationBadge status="approved" />}
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para impulsionar seus negócios
          </p>
        </div>

        {/* Verification Notice */}
        {!verified && status !== 'not_started' && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-900 mb-1">
                  Verificação Necessária
                </h3>
                <p className="text-sm text-yellow-800">
                  Complete sua verificação de identidade para assinar planos premium.{' '}
                  <button
                    onClick={() => router.push('/verificacao')}
                    className="font-medium underline hover:text-yellow-900"
                  >
                    Verificar agora
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                plan.recommended ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.recommended && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 text-sm font-medium">
                  ⭐ Mais Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {plan.price.toFixed(2)}
                  </span>
                  <span className="text-gray-600">/mês</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.price === 0 ? (
                  <button
                    onClick={() => router.push('/')}
                    className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Plano Atual
                  </button>
                ) : (
                  <VerificationGate
                    fallback={
                      <button
                        onClick={() => router.push('/verificacao')}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        🔐 Verificar para Assinar
                      </button>
                    }
                  >
                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={loading === plan.id}
                      className={`w-full ${
                        plan.recommended
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processando...
                        </span>
                      ) : (
                        'Assinar Agora'
                      )}
                    </button>
                  </VerificationGate>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Perguntas Frequentes
          </h2>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-gray-900 font-medium">
                Posso cancelar a qualquer momento?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 text-gray-600 text-sm">
                Sim! Você pode cancelar sua assinatura a qualquer momento. Seus benefícios continuarão até o final do período pago.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-gray-900 font-medium">
                Por que preciso verificar minha identidade?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 text-gray-600 text-sm">
                A verificação garante segurança para todos os usuários, previne fraudes e aumenta a confiança nas transações da plataforma.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-gray-900 font-medium">
                Posso mudar de plano depois?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 text-gray-600 text-sm">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. O valor será ajustado proporcionalmente.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-gray-900 font-medium">
                Quais formas de pagamento são aceitas?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 text-gray-600 text-sm">
                Aceitamos cartões de crédito (Visa, Mastercard, Amex) via Stripe. Em breve: Pix, boleto bancário e débito.
              </p>
            </details>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Ainda tem dúvidas? Entre em contato com nosso time de suporte.
          </p>
          <a
            href="/contato"
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            Falar com Suporte →
          </a>
        </div>
      </div>
    </div>
  );
}
