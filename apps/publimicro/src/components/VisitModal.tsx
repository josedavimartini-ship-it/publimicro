'use client';

import { useState, useEffect, useRef } from 'react';
import { apiPost } from '@/lib/api';
import { X, Calendar, Clock, Video, MapPin } from 'lucide-react';
import FocusLock from 'react-focus-lock';

interface VisitModalProps {
  adId: string;
  adTitle?: string;
  open: boolean;
  onClose: () => void;
}

export default function VisitModal({ adId, adTitle, open, onClose }: VisitModalProps) {
  const [form, setForm] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    visit_type: 'in_person',
    scheduled_at: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Store focused element when modal opens
  useEffect(() => {
    if (open) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleClose = () => {
    onClose();
    if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await apiPost('/api/visits', { ad_id: adId, ...form });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setForm({
          guest_name: '',
          guest_email: '',
          guest_phone: '',
          visit_type: 'in_person',
          scheduled_at: '',
          notes: '',
        });
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Erro ao agendar visita. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <FocusLock returnFocus>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl w-full max-w-lg relative shadow-2xl max-h-[90vh] overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#959595] hover:text-[#FF6B35] transition-colors z-10"
            aria-label="Fechar modal de agendamento"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0D7377] to-[#5F7161] mb-2">
              Agendar Visita
            </h2>
            {adTitle && (
              <p className="text-[#B7791F] font-medium">{adTitle}</p>
            )}
            <p className="text-[#676767] text-sm mt-2">
              Preencha os dados abaixo para agendar sua visita. Entraremos em contato para confirmar.
            </p>
          </div>

          {success ? (
            <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Visita Agendada!</h3>
              <p className="text-green-300 text-sm">
                Entraremos em contato em breve para confirmar sua visita.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulário de agendamento de visita">
              <div>
                <label className="block text-sm font-medium text-[#B7791F] mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="guest_name"
                  placeholder="Seu nome completo"
                  value={form.guest_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#232323] border border-[#0D7377] rounded-lg text-[#f2e6b1] placeholder-[#676767] focus:outline-none focus:border-[#0D7377] transition-colors"
                  required
                  aria-required="true"
                  aria-label="Nome Completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#B7791F] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="guest_email"
                  placeholder="seu@email.com"
                  value={form.guest_email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#232323] border border-[#0D7377] rounded-lg text-[#f2e6b1] placeholder-[#676767] focus:outline-none focus:border-[#0D7377] transition-colors"
                  required
                  aria-required="true"
                  aria-label="Email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#B7791F] mb-2">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  name="guest_phone"
                  placeholder="(00) 00000-0000"
                  value={form.guest_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#232323] border border-[#0D7377] rounded-lg text-[#f2e6b1] placeholder-[#676767] focus:outline-none focus:border-[#0D7377] transition-colors"
                  required
                  aria-required="true"
                  aria-label="WhatsApp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#B7791F] mb-2">
                  Tipo de Visita *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, visit_type: 'in_person' })}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      form.visit_type === 'in_person'
                        ? 'border-[#0D7377] bg-[#0D7377]/20 text-[#0D7377]'
                        : 'border-[#3a3a2a] bg-[#2a2a2a] text-[#676767] hover:border-[#4a4a3a]'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Presencial</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, visit_type: 'video' })}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      form.visit_type === 'video'
                        ? 'border-[#0D7377] bg-[#0D7377]/20 text-[#0D7377]'
                        : 'border-[#3a3a2a] bg-[#2a2a2a] text-[#676767] hover:border-[#4a4a3a]'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    <span className="font-medium">Vídeo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#B7791F] mb-2">
                  Data e Hora Preferencial *
                </label>
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  value={form.scheduled_at}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 bg-[#232323] border border-[#0D7377] rounded-lg text-[#f2e6b1] focus:outline-none focus:border-[#0D7377] transition-colors"
                  required
                  aria-required="true"
                  aria-label="Data e Hora Preferencial"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#B7791F] mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  name="notes"
                  placeholder="Informações adicionais sobre sua visita..."
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#232323] border border-[#0D7377] rounded-lg text-[#f2e6b1] placeholder-[#676767] focus:outline-none focus:border-[#0D7377] transition-colors resize-none"
                  aria-label="Observações"
                />
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg p-4">
                <h4 className="text-sm font-bold text-[#B7791F] mb-2">Como funciona:</h4>
                <ul className="text-xs text-[#676767] space-y-1">
                  <li>✓ Envie sua solicitação de visita</li>
                  <li>✓ Aguarde nossa confirmação (24-48h)</li>
                  <li>✓ Receba o link da videochamada ou endereço</li>
                  <li>✓ Após a visita, você poderá fazer propostas</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#0D7377] to-[#5F7161] hover:from-[#5F7161] hover:to-[#0D7377] text-white font-bold rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                aria-label="Agendar Visita"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Agendando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Agendar Visita
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
      </FocusLock>
    </div>
  );
}