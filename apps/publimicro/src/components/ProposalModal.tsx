'use client';

import { useState, useEffect } from 'react';
import { apiPost } from '@/lib/api';
import { X, DollarSign, MessageSquare } from 'lucide-react';
import BottomSheet from './BottomSheet';

interface ProposalModalProps {
  adId: string;
  adTitle?: string;
  currentBid?: number;
  minBid?: number;
  open: boolean;
  onClose: () => void;
}

export default function ProposalModal({ 
  adId, 
  adTitle, 
  currentBid, 
  minBid,
  open, 
  onClose 
}: ProposalModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

    if (minBid && numericAmount < minBid) {
      setError(`A proposta mínima é R$ ${minBid.toLocaleString('pt-BR')}`);
      setLoading(false);
      return;
    }

    try {
      await apiPost('/api/proposals', { 
        ad_id: adId, 
        amount: numericAmount,
        message 
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setAmount('');
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

  // Mobile: Use BottomSheet
  if (isMobile) {
    return (
      <BottomSheet isOpen={open} onClose={onClose} title="Fazer Proposta">
        <div className="space-y-4 pb-6">
          {adTitle && <p className="text-[#B7791F] font-medium">{adTitle}</p>}
          {currentBid && <p className="text-[#676767] text-sm">Proposta atual: <span className="text-[#B7791F] font-bold">R$ {currentBid.toLocaleString('pt-BR')}</span></p>}
          
          {success ? (
            <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Proposta Enviada!</h3>
              <p className="text-green-300 text-sm">Entraremos em contato em breve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#B7791F] mb-2">Valor da Proposta *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#676767]" />
                  <input type="text" value={amount} onChange={handleAmountChange} placeholder="R$ 0,00" className="w-full pl-10 pr-4 py-3 bg-[#232323] border border-[#E6C98B] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#B7791F]" required />
                </div>
                {minBid && <p className="text-xs text-[#676767] mt-1">Proposta mínima: R$ {minBid.toLocaleString('pt-BR')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B7791F] mb-2">Mensagem (opcional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-[#676767]" />
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Conte mais sobre sua proposta..." rows={4} className="w-full pl-10 pr-4 py-3 bg-[#232323] border border-[#E6C98B] rounded-lg text-[#f2e6b1] placeholder-[#676767] focus:outline-none focus:border-[#B7791F] resize-none" />
                </div>
              </div>
              {error && <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">{error}</div>}
              <button type="submit" disabled={loading} className="w-full px-6 py-4 bg-gradient-to-r from-[#E6C98B] to-[#B7791F] hover:from-[#B7791F] hover:to-[#E6C98B] text-[#0a0a0a] font-bold rounded-lg transition-all disabled:opacity-50 shadow-lg">
                {loading ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Enviando...</span> : <span className="flex items-center justify-center gap-2"><DollarSign className="w-5 h-5" />Enviar Proposta</span>}
              </button>
            </form>
          )}
        </div>
      </BottomSheet>
    );
  }

  // Desktop: Use centered modal
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl w-full max-w-lg relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#676767] hover:text-[#A8C97F] transition-colors z-10"
          aria-label="Close"
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
                Proposta atual: <span className="text-[#B7791F] font-bold">R$ {currentBid.toLocaleString('pt-BR')}</span>
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
              <h3 className="text-xl font-bold text-green-400 mb-2">Proposta Enviada!</h3>
              <p className="text-green-300 text-sm">
                Você receberá uma notificação quando sua proposta for analisada.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-yellow-400 mb-2">⚠️ Importante:</h4>
                <ul className="text-xs text-yellow-300 space-y-1">
                  <li>• Você só pode fazer propostas após visitar o imóvel</li>
                  <li>• Propostas são vinculantes e serão analisadas</li>
                  <li>• O vendedor pode aceitar, recusar ou contra-propor</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#B7791F] mb-2">
                  Valor da Proposta * {minBid && <span className="text-[#676767] text-xs">(mínimo: R$ {minBid.toLocaleString('pt-BR')})</span>}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#676767]" />
                  <input
                    type="text"
                    placeholder="R$ 0,00"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full pl-12 pr-4 py-4 bg-[#2a2a2a] border-2 border-[#3a3a2a] rounded-lg text-[#f2e6b1] text-2xl font-bold placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors"
                    required
                  />
                </div>
                {minBid && parseFloat(amount.replace(/[^\d]/g, '')) / 100 < minBid && (
                  <p className="text-xs text-red-400 mt-1">
                    Valor abaixo da proposta mínima
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#B7791F] mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Mensagem (opcional)
                </label>
                <textarea
                  placeholder="Adicione detalhes sobre sua proposta, condições de pagamento, etc..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#f2e6b1] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg p-4">
                <h4 className="text-sm font-bold text-[#B7791F] mb-2">Próximos Passos:</h4>
                <ul className="text-xs text-[#676767] space-y-1">
                  <li>1. Sua proposta será enviada ao vendedor</li>
                  <li>2. Aguarde análise (normalmente 24-72h)</li>
                  <li>3. Você será notificado da decisão</li>
                  <li>4. Se aceita, siga com documentação</li>
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
                    Enviando...
                  </span>
                ) : (
                  '💰 Enviar Proposta'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}