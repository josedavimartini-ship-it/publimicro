"use client";

import { useState, useEffect, useRef } from "react";
import FocusLock from "react-focus-lock";
import { useAuth } from "../AuthProvider";
import { useI18n } from "@/lib/i18n";

interface VisitSchedulerProps {
  propertyId?: string;
  propertyTitle?: string;
  propertyPhoto?: string; // Background photo for visual appeal
  onClose?: () => void;  // Optional close callback
}

type VisitType = "presencial" | "video";

export default function VisitScheduler({ 
  propertyId, 
  propertyTitle,
  propertyPhoto,
  onClose
}: VisitSchedulerProps) {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const [visitType, setVisitType] = useState<VisitType>("presencial");
  const [isGuest, setIsGuest] = useState(!user); // Track if scheduling as guest
  const [formData, setFormData] = useState({
    nome: profile?.full_name || "",
    email: user?.email || "",
    telefone: profile?.phone || "",
    cpf: profile?.cpf || "",
    birth_date: profile?.birth_date || "",
    cidade: profile?.city || "",
    estado: profile?.state || "",
    pais: "Brasil",
    dataPreferencia: "",
    horarioPreferencia: "",
    mensagem: "",
  });
  const [status, setStatus] = useState<
    | "idle"
    | "sending"
    | "sent"
    | "error"
    | "pending_review"
    | "cpf_exists"
    | "registration_denied"
    | "verification_in_progress"
    | "verification_approved"
    | "verification_rejected"
    | "verification_failed"
  >("idle");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<null | {
    status: string;
    rejection_reason?: string;
    checked_at?: string;
  }>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Poll verification status if pending
  useEffect(() => {
    if (status === "pending_review" && verificationId) {
      const poll = async () => {
        try {
          const res = await fetch(`/api/verification-status?id=${verificationId}`);
          if (res.ok) {
            const data = await res.json();
            setVerificationStatus(data);
            if (data.status === "approved") {
              setStatus("verification_approved");
              clearInterval(pollingRef.current!);
            } else if (data.status === "rejected") {
              setStatus("verification_rejected");
              clearInterval(pollingRef.current!);
            } else if (data.status === "failed") {
              setStatus("verification_failed");
              clearInterval(pollingRef.current!);
            } else if (data.status === "in_progress" || data.status === "pending") {
              setStatus("verification_in_progress");
            }
          }
        } catch (e) {
          // ignore polling errors
        }
      };
      poll();
      pollingRef.current = setInterval(poll, 8000);
      return () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
      };
    }
    // eslint-disable-next-line
  }, [status, verificationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // For guest users, schedule visit WITH background check
      if (isGuest) {
        const response = await fetch("/api/schedule-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            visitType,
            propertyId,
            propertyTitle,
            isGuest: true, // Flag to trigger background check
          }),
        });

        const result = await response.json();

        if (response.ok) {
          if (result.code === 'PENDING_REVIEW') {
            setStatus("pending_review");
            setVerificationId(result.verification_id);
          } else {
            setStatus("sent");
          }
          // Reset form
          setFormData({
            nome: "",
            email: "",
            telefone: "",
            cpf: "",
            birth_date: "",
            cidade: "",
            estado: "",
            pais: "Brasil",
            dataPreferencia: "",
            horarioPreferencia: "",
            mensagem: "",
          });
        } else {
          if (result.code === 'CPF_EXISTS') {
            setStatus("cpf_exists");
          } else if (result.code === 'REGISTRATION_DENIED') {
            setStatus("registration_denied");
          } else {
            setStatus("error");
          }
        }
      } else {
        // Authenticated user - standard visit scheduling
        const response = await fetch("/api/schedule-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            visitType,
            propertyId,
            propertyTitle,
            user_id: user?.id, // Include user ID
          }),
        });

        if (response.ok) {
          setStatus("sent");
          setFormData({
            ...formData,
            dataPreferencia: "",
            horarioPreferencia: "",
            mensagem: "",
          });
        } else {
          setStatus("error");
        }
      }
    } catch (error) {
      console.error("Erro ao agendar visita:", error);
      setStatus("error");
    }
  };

  return (
    <div className="relative bg-[#0b0b0b] border border-[#242424] rounded-2xl overflow-hidden">
      {/* Property Photo Background - Subtle blur effect */}
      {propertyPhoto && (
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${propertyPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
          }}
        />
      )}
      
      {/* Content layer */}
      <div className="relative z-10 p-8">
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-2">
          {t('sitioscarcara.request_visit') || 'Agendar Visita'}
        </h2>
      <p className="text-[#A8896B] mb-6">
        {propertyTitle ? `${t('sitioscarcara.for_property') || 'Para'}: ${propertyTitle}` : t('sitioscarcara.choose_visit_type') || 'Escolha o tipo de visita e preencha os dados'}
      </p>

      {/* Guest vs Authenticated Toggle */}
      {!user && (
        <div className="mb-6 p-4 bg-gradient-to-r from-[#CD7F32]/10 to-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h3 className="font-semibold text-[#D4AF37] mb-1">
                {t('sitioscarcara.guest_schedule_title') || 'Agende sem criar conta!'}
              </h3>
              <p className="text-sm text-[#A8896B]">
                {t('sitioscarcara.guest_schedule_desc') || 'Você pode agendar sua visita agora. Se aprovado, criaremos sua conta automaticamente e você receberá as credenciais por email.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {user && (
        <div className="mb-6 p-4 bg-[#8B9B6E]/10 border border-[#8B9B6E]/20 rounded-lg">
          <div className="flex items-center gap-2 text-[#8B9B6E]">
            <span className="text-xl">✓</span>
            <span className="text-sm">{t('sitioscarcara.scheduling_as') || 'Agendando como'} <strong>{profile?.full_name}</strong></span>
          </div>
        </div>
      )}

      {/* Visit Type Toggle */}
      <div className="flex gap-4 mb-8">
        <button
          type="button"
          onClick={() => setVisitType("presencial")}
          className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
            visitType === "presencial"
              ? "bg-gradient-to-r from-[#CD7F32] to-[#D4AF37] text-[#0a0a0a] shadow-lg"
              : "bg-[#0f0f0f] border border-[#3a3a2a] text-[#A8896B] hover:border-[#D4AF37]/30"
          }`}
        >
          <div className="text-2xl mb-1">🏠</div>
          {t('sitioscarcara.in_person_visit') || 'Visita Presencial'}
        </button>
        <button
          type="button"
          onClick={() => setVisitType("video")}
          className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
            visitType === "video"
              ? "bg-gradient-to-r from-[#CD7F32] to-[#D4AF37] text-[#0a0a0a] shadow-lg"
              : "bg-[#0f0f0f] border border-[#3a3a2a] text-[#A8896B] hover:border-[#D4AF37]/30"
          }`}
        >
          <div className="text-2xl mb-1">📹</div>
          {t('sitioscarcara.video_visit') || 'Videoconferência'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nome" className="block text-sm text-[#A8896B] mb-2">
              {t('sitioscarcara.full_name') || 'Nome Completo'} *
            </label>
            <input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              disabled={!!user} // Disabled for authenticated users
              className="w-full bg-[#0f0f0f] border border-[#3a3a2a] rounded-lg px-4 py-3 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="cpf" className="block text-sm text-[#A8896B] mb-2">
              {t('sitioscarcara.cpf') || 'CPF'} * {isGuest && <span className="text-xs text-[#8B9B6E]">({t('sitioscarcara.for_security') || 'para verificação de segurança'})</span>}
            </label>
            <input
              id="cpf"
              type="text"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              required
              disabled={!!user}
              placeholder="000.000.000-00"
              className="w-full bg-[#0f0f0f] border border-[#3a3a2a] rounded-lg px-4 py-3 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Birth Date for Guest Users (Required for background check) */}
        {isGuest && (
          <div>
            <label htmlFor="birth_date" className="block text-sm text-[#A8896B] mb-2">
              {t('sitioscarcara.birth_date') || 'Data de Nascimento'} * <span className="text-xs text-[#8B9B6E]">({t('sitioscarcara.needed_for_verification') || 'necessário para verificação'})</span>
            </label>
            <input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              required
              max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Must be 18+
              className="w-full bg-[#0f0f0f] border border-[#3a3a2a] rounded-lg px-4 py-3 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm text-[#A8896B] mb-2">
              {t('sitioscarcara.email') || 'E-mail'} *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={!!user}
              className="w-full bg-[#0f0f0f] border border-[#3a3a2a] rounded-lg px-4 py-3 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="telefone" className="block text-sm text-[#A8896B] mb-2">
              {t('sitioscarcara.whatsapp') || 'WhatsApp'} *
            </label>
            <input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              required
              disabled={!!user}
              placeholder="+55 (62) 99999-9999"
              className="w-full bg-[#0f0f0f] border border-[#3a3a2a] rounded-lg px-4 py-3 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="cidade" className="block text-sm text-[#A8896B] mb-2">
              {t('sitioscarcara.city') || 'Cidade'} *
            </label>
            <input
              id="cidade"
              type="text"
              value={formData.cidade}
              onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              required
              disabled={!!user}
              className="w-full bg-[#0f0f0f] border border-[#3a3a2a] rounded-lg px-4 py-3 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="estado" className="block text-sm text-[#A8896B] mb-2">
              {t('sitioscarcara.state') || 'Estado'} *
            </label>
            <input
              id="estado"
              type="text"
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              required
              disabled={!!user}
              placeholder="GO"
              className="w-full bg-[#0f0f0f] border border-[#3a3a2a] rounded-lg px-4 py-3 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="pais" className="block text-sm text-[#A8896B] mb-2">
              {t('sitioscarcara.country') || 'País'}
            </label>
            <input
              id="pais"
              type="text"
              value={formData.pais}
              onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              disabled={!!user}
              className="w-full bg-[#0f0f0f] border border-[#3a3a2a] rounded-lg px-4 py-3 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="data" className="block text-sm text-[#A8896B] mb-2">
              {t('sitioscarcara.preferred_date') || 'Data Preferencial'} *
            </label>
            <input
              id="data"
              type="date"
              value={formData.dataPreferencia}
              onChange={(e) => setFormData({ ...formData, dataPreferencia: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-[#0f0f0f] border border-[#3a3a2a] rounded-lg px-4 py-3 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <div>
            <label htmlFor="horario" className="block text-sm text-[#A8896B] mb-2">
              {t('sitioscarcara.preferred_time') || 'Horário Preferencial'} *
            </label>
            <select
              id="horario"
              value={formData.horarioPreferencia}
              onChange={(e) => setFormData({ ...formData, horarioPreferencia: e.target.value })}
              required
              className="w-full bg-[#0f0f0f] border border-[#3a3a2a] rounded-lg px-4 py-3 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50"
            >
              <option value="">{t('sitioscarcara.select') || 'Selecione'}</option>
              <option value="manhã">{t('sitioscarcara.morning') || 'Manhã (8h - 12h)'}</option>
              <option value="tarde">{t('sitioscarcara.afternoon') || 'Tarde (13h - 17h)'}</option>
              <option value="noite">{t('sitioscarcara.night') || 'Noite (18h - 20h)'}</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="mensagem" className="block text-sm text-[#A8896B] mb-2">
            {t('sitioscarcara.message_optional') || 'Mensagem (opcional)'}
          </label>
          <textarea
            id="mensagem"
            value={formData.mensagem}
            onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
            rows={4}
            placeholder="Informações adicionais, dúvidas ou solicitações especiais..."
            className="w-full bg-[#0f0f0f] border border-[#3a3a2a] rounded-lg px-4 py-3 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>

        {/* Security Notice & Privacy Microcopy */}
        <div className="p-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#CD7F32]/10 border border-[#D4AF37]/20 rounded-lg" aria-live="polite">
          <p className="text-xs text-[#D4AF37] flex items-start gap-2">
            <span className="text-lg" aria-hidden="true">🔒</span>
            <span>
              <strong>{t('sitioscarcara.security_policy') || 'Política de Segurança'}:</strong> {isGuest ? 
                t('sitioscarcara.security_policy_guest') || 'Seus dados serão verificados para garantir a segurança de todos. Caso aprovado, criaremos sua conta automaticamente e você receberá as credenciais por email.' : 
                t('sitioscarcara.security_policy_user') || 'Visitas presenciais requerem documentação válida.'
              }
              <br />
              <span className="block mt-1 text-[#A8896B]">{t('sitioscarcara.lgpd_notice') || 'Manteremos suas informações confidenciais conforme LGPD.'}</span>
              <span className="block mt-1 text-[#A8896B]">{t('sitioscarcara.next_steps_notice') || 'Após o envio, você receberá atualizações por email sobre o status da verificação e agendamento.'}</span>
            </span>
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          aria-label={t('sitioscarcara.schedule') || 'Agendar'}
          disabled={status === "sending"}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#CD7F32] to-[#D4AF37] hover:from-[#B87333] hover:to-[#CD7F32] text-[#0a0a0a] font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[0_8px_30px_rgba(212,175,55,0.3)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
        >
          {status === "sending" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {isGuest ? t('sitioscarcara.verifying_and_sending') || 'Verificando e enviando...' : t('sitioscarcara.sending') || 'Enviando...'}
            </span>
          ) : (
            `${t('sitioscarcara.schedule')} ${visitType === "video" ? t('sitioscarcara.video_visit') || 'Videoconferência' : t('sitioscarcara.in_person_visit') || 'Visita Presencial'}`
          )}
        </button>

        {/* Status Messages */}
        {status === "sent" && (
          <div className="p-4 bg-[#8B9B6E]/10 border border-[#8B9B6E]/30 rounded-lg text-[#8B9B6E]">
            <div className="flex items-start gap-2">
              <span className="text-xl">✓</span>
              <div>
                <p className="font-semibold mb-1">{t('sitioscarcara.request_sent_success') || 'Solicitação enviada com sucesso!'}</p>
                <p className="text-sm">
                  {isGuest ? 
                    t('sitioscarcara.guest_request_pending') || 'Seu cadastro está em análise. Se aprovado, você receberá suas credenciais de acesso por email e a confirmação da visita dentro de 24h.' :
                    t('sitioscarcara.contact_24h') || 'Entraremos em contato em até 24h para confirmar sua visita.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Real-time verification status feedback */}
        {(status === "pending_review" || status === "verification_in_progress") && (
          <div className="p-4 bg-[#D4A574]/10 border border-[#D4A574]/30 rounded-lg text-[#D4A574]">
            <div className="flex items-start gap-2">
              <span className="text-xl">⏳</span>
              <div>
                <p className="font-semibold mb-1">{t('sitioscarcara.verification_in_progress_title') || 'Verificação em andamento'}</p>
                <p className="text-sm">
                  {t('sitioscarcara.verification_in_progress_desc') || 'Estamos revisando suas informações. Você receberá um email com o resultado assim que a análise for concluída.'}
                  <br />
                  {t('sitioscarcara.verification_id') || 'ID da verificação'}: <code className="text-xs bg-[#0a0a0a] px-2 py-1 rounded">{verificationId?.slice(0, 8)}</code>
                </p>
              </div>
            </div>
          </div>
        )}
        {status === "verification_approved" && (
          <div className="p-4 bg-[#8B9B6E]/10 border border-[#8B9B6E]/30 rounded-lg text-[#8B9B6E]">
            <div className="flex items-start gap-2">
              <span className="text-xl">✅</span>
              <div>
                <p className="font-semibold mb-1">{t('sitioscarcara.verification_approved_title') || 'Verificação aprovada!'}</p>
                <p className="text-sm">
                  {t('sitioscarcara.verification_approved_desc') || 'Sua verificação foi aprovada. Você receberá um email com as próximas instruções.'}
                </p>
              </div>
            </div>
          </div>
        )}
        {status === "verification_rejected" && (
          <div className="p-4 bg-[#CD5C5C]/10 border border-[#CD5C5C]/30 rounded-lg text-[#CD5C5C]">
            <div className="flex items-start gap-2">
              <span className="text-xl">✗</span>
              <div>
                <p className="font-semibold mb-1">{t('sitioscarcara.verification_rejected_title') || 'Verificação não aprovada'}</p>
                <p className="text-sm">
                  {t('sitioscarcara.verification_rejected_desc') || 'Sua verificação não foi aprovada. Entre em contato para mais informações.'}
                  {verificationStatus?.rejection_reason && (
                    <><br /><span className="text-xs">{verificationStatus.rejection_reason}</span></>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
        {status === "verification_failed" && (
          <div className="p-4 bg-[#CD5C5C]/10 border border-[#CD5C5C]/30 rounded-lg text-[#CD5C5C]">
            <div className="flex items-start gap-2">
              <span className="text-xl">✗</span>
              <div>
                <p className="font-semibold mb-1">{t('sitioscarcara.verification_failed_title') || 'Falha na verificação'}</p>
                <p className="text-sm">
                  {t('sitioscarcara.verification_failed_desc') || 'Não foi possível concluir a verificação. Tente novamente mais tarde ou entre em contato.'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {status === "error" && (
          <div className="p-4 bg-[#CD5C5C]/10 border border-[#CD5C5C]/30 rounded-lg text-[#CD5C5C]">
            <div className="flex items-start gap-2">
              <span className="text-xl">✗</span>
              <div>
                <p className="font-semibold mb-1">{t('sitioscarcara.request_failed') || 'Não foi possível processar sua solicitação'}</p>
                <p className="text-sm">
                  {t('sitioscarcara.check_data_and_retry') || 'Por favor, verifique seus dados e tente novamente. Se o problema persistir, entre em contato via WhatsApp.'}
                </p>
              </div>
            </div>
          </div>
        )}
        {status === "cpf_exists" && (
          <div className="p-4 bg-[#CD5C5C]/10 border border-[#CD5C5C]/30 rounded-lg text-[#CD5C5C]">
            <div className="flex items-start gap-2">
              <span className="text-xl">✗</span>
              <div>
                <p className="font-semibold mb-1">{t('sitioscarcara.cpf_exists_title') || 'CPF já cadastrado'}</p>
                <p className="text-sm">
                  {t('sitioscarcara.cpf_exists_desc') || 'Este CPF já está cadastrado. Faça login para agendar sua visita ou recupere sua senha.'}
                </p>
              </div>
            </div>
          </div>
        )}
        {status === "registration_denied" && (
          <div className="p-4 bg-[#CD5C5C]/10 border border-[#CD5C5C]/30 rounded-lg text-[#CD5C5C]">
            <div className="flex items-start gap-2">
              <span className="text-xl">✗</span>
              <div>
                <p className="font-semibold mb-1">{t('sitioscarcara.registration_denied_title') || 'Solicitação não aprovada'}</p>
                <p className="text-sm">
                  {t('sitioscarcara.registration_denied_desc') || 'Não foi possível processar sua solicitação. Entre em contato para mais informações.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
      </div> {/* End content layer */}
    </div>
  );
}
