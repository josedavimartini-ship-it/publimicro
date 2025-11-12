'use client';

import { useState, useEffect } from 'react';
import { apiPost } from '@/lib/api';
import { X, DollarSign, MessageSquare, ShieldCheck, AlertCircle } from 'lucide-react';
import BottomSheet from './BottomSheet';
import { useAuth } from './AuthProvider';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

interface ProposalModalProps {
  adId: string;
  adTitle?: string;
  currentBid?: number;
  minBid?: number;
  open: boolean;
  onClose: () => void;
}

// Simulated proposal history (replace with real API call)
const mockHistory = [
  { amount: 350000, date: '2025-11-01', status: 'Aceita' },
  { amount: 340000, date: '2025-10-28', status: 'Recusada' },
];

export default function ProposalModal({ 
  adId, 
  adTitle, 
  currentBid, 
  minBid,
  open, 
  onClose 
}: ProposalModalProps) {
  const { profile } = useAuth();
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(false);
  const [amount, setAmount] = useState('');
  const [entry, setEntry] = useState('');
  const [installments, setInstallments] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'proposta' | 'historico'>('proposta');

  // Check if user is authorized to make proposals
  const canMakeProposal = profile?.can_place_bids === true && profile?.verified === true;
  const needsProfileCompletion = !profile?.profile_completed;
  const needsVerification = profile?.profile_completed && !profile?.verified;

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const numericAmount = parseFloat(amount.replace(/[^\d]/g, ''));
    const numericEntry = parseFloat(entry.replace(/[^\d]/g, ''));
    const nInstallments = Number(installments);

    if (minBid && numericAmount < minBid) {
      setError(`A proposta mínima é R$ ${minBid.toLocaleString('pt-BR')}`);
      setLoading(false);
      return;
    }
    if (numericEntry < numericAmount * 0.3) {
      setError('A entrada deve ser no mínimo 30% do valor total.');
      setLoading(false);
      return;
    }
    if (nInstallments < 1 || nInstallments > 36) {
      setError('O número de parcelas deve ser entre 1 e 36.');
      setLoading(false);
      return;
    }

    // Simulate fee/inflation (for now, 1% ao mês)
    const fee = 0.01;
    const totalFinanced = numericAmount - numericEntry;
    const totalWithFees = totalFinanced * Math.pow(1 + fee, nInstallments);

    try {
      await apiPost('/api/proposals', { 
        ad_id: adId, 
        amount: numericAmount,
        entry: numericEntry,
        installments: nInstallments,
        totalWithFees,
        message 
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setAmount('');
        setEntry('');
        setInstallments(1);
        setMessage('');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(numbers) / 100);
    return formatted;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatCurrency(e.target.value));
  };


  if (!open) return null;

  // If user cannot make proposals, show guidance and CTAs instead of the form
  if (!canMakeProposal) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl w-full max-w-md relative shadow-2xl p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#676767] hover:text-[#A8C97F] transition-colors z-10"
            aria-label={t('sitioscarcara.close') || 'Close'}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-[#B87333]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-[#B87333]" />
            </div>
            <h3 className="text-2xl font-bold text-[#E6C98B] mb-3">{t('sitioscarcara.proposal_access_needed') || 'Acesso Necessário'}</h3>
            <p className="text-[#676767] mb-6">
              {t('sitioscarcara.proposal_requirements') || 'Para enviar propostas, é necessário ter o perfil completo, estar verificado e ter autorização (visita realizada).'}
            </p>

            <div className="space-y-3 max-w-sm mx-auto">
              {!profile && (
                <a href={`/entrar?redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/')}`} className="block px-6 py-3 bg-gradient-to-r from-[#B87333] to-[#FFD700] text-[#0a0a0a] font-bold rounded-xl">{t('sitioscarcara.login') || 'Fazer Login'}</a>
              )}

              {profile && !profile.profile_completed && (
                <Link href="/conta" className="block px-6 py-3 bg-[#0f0f0f] border border-amber-500/30 text-amber-500 font-semibold rounded-lg">{t('sitioscarcara.complete_profile') || 'Completar Perfil'}</Link>
              )}

              {profile && profile.profile_completed && !profile.verified && (
                <div className="p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-300 mb-3">{t('sitioscarcara.verification_needed') || 'Sua conta precisa ser verificada antes de enviar propostas.'}</p>
                  <a href={`/schedule-visit?propertyId=${adId}`} className="inline-block px-6 py-3 bg-gradient-to-r from-[#0D7377] to-[#5F7161] text-white font-bold rounded-lg">{t('sitioscarcara.schedule_visit') || 'Agendar Visita'}</a>
                </div>
              )}

              {profile && profile.profile_completed && profile.verified && !profile.can_place_bids && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300">
                  <p className="text-sm">{t('sitioscarcara.visit_required_before_bids') || 'Você precisa realizar a visita e obter autorização da nossa equipe para poder dar lances.'}</p>
                  <a href={`/schedule-visit?propertyId=${adId}`} className="mt-3 inline-block px-6 py-3 bg-gradient-to-r from-[#CD7F32] to-[#B87333] text-[#0a0a0a] font-bold rounded-lg">{t('sitioscarcara.schedule_visit') || 'Agendar Visita'}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Use centered modal
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl w-full max-w-lg relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#676767] hover:text-[#A8C97F] transition-colors z-10"
          aria-label={t('sitioscarcara.close') || 'Close'}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] to-[#B7791F] mb-2">
              Fazer Proposta
            </h2>
            {adTitle && (
              <p className="text-[#B7791F] font-medium">{adTitle}</p>
            )}
            {currentBid && (
              <p className="text-[#676767] text-sm mt-2">
                {t('sitioscarcara.current_bid') || 'Proposta atual:'} <span className="text-[#B7791F] font-bold">R$ {currentBid.toLocaleString('pt-BR')}</span>
              </p>
            )}
          </div>

          {success ? (
            <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-2">{t('sitioscarcara.proposal_sent') || 'Proposta Enviada!'}</h3>
              <p className="text-green-300 text-sm">
                {t('sitioscarcara.proposal_notification') || 'Você receberá uma notificação quando sua proposta for analisada.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-yellow-400 mb-2">⚠️ {t('sitioscarcara.important') || 'Importante:'}</h4>
                <ul className="text-xs text-yellow-300 space-y-1">
                  <li>{t('sitioscarcara.important_step1') || '• Você só pode fazer propostas após visitar o imóvel'}</li>
                  <li>{t('sitioscarcara.important_step2') || '• Propostas são vinculantes e serão analisadas'}</li>
                  <li>{t('sitioscarcara.important_step3') || '• O vendedor pode aceitar, recusar ou contra-propor'}</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#B7791F] mb-2">
                  {t('sitioscarcara.proposal_amount_label') || 'Valor da Proposta *'} {minBid && <span className="text-[#676767] text-xs">(mínimo: R$ {minBid.toLocaleString('pt-BR')})</span>}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#676767]" />
                  <input
                    type="text"
                    placeholder={t('sitioscarcara.proposal_amount_placeholder') || 'R$ 0,00'}
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full pl-12 pr-4 py-4 bg-[#2a2a2a] border-2 border-[#3a3a2a] rounded-lg text-[#f2e6b1] text-2xl font-bold placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors"
                    required
                  />
                </div>
                {minBid && parseFloat(amount.replace(/[^\d]/g, '')) / 100 < minBid && (
                    <p className="text-xs text-red-400 mt-1">
                      {t('sitioscarcara.below_minimum_offer')}
                    </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#B7791F] mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {t('sitioscarcara.message_optional') || 'Mensagem (opcional)'}
                </label>
                <textarea
                  placeholder={t('sitioscarcara.proposal_message_placeholder') || 'Adicione detalhes sobre sua proposta, condições de pagamento, etc...'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#f2e6b1] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {t('sitioscarcara.proposal_error') || error}
                </div>
              )}

              <div className="bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg p-4">
                <h4 className="text-sm font-bold text-[#B7791F] mb-2">{t('sitioscarcara.next_steps') || 'Próximos Passos:'}</h4>
                <ul className="text-xs text-[#676767] space-y-1">
                  <li>{t('sitioscarcara.step1') || '1. Sua proposta será enviada ao vendedor'}</li>
                  <li>{t('sitioscarcara.step2') || '2. Aguarde análise (normalmente 24-72h)'}</li>
                  <li>{t('sitioscarcara.step3') || '3. Você será notificado da decisão'}</li>
                  <li>{t('sitioscarcara.step4') || '4. Se aceita, siga com documentação'}</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading || (minBid ? parseFloat(amount.replace(/[^\d]/g, '')) / 100 < minBid : false)}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] hover:from-[#0D7377] hover:to-[#A8C97F] text-white font-bold rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('sitioscarcara.sending') || 'Enviando...'}
                  </span>
                ) : (
                  `💰 ${t('sitioscarcara.send_proposal') || 'Enviar Proposta'}`
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}