"use client";

import { useState, useEffect } from "react";

type ProposalFormProps = {
  propId?: string | null;
};

export default function ProposalForm({
  propId,
}: ProposalFormProps): JSX.Element {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authCode, setAuthCode] = useState("");
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    documento: "",
    valor: "",
    condicoes: "",
    justificativa: "",
    mensagem: "",
  });
  
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    // Check if user has visited the property (authorization)
    const checkAuthorization = async () => {
      if (!propId) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(`/api/check-authorization?propId=${propId}`);
        const data = await response.json();
        setIsAuthorized(data.authorized || false);
      } catch (error) {
        console.error("Erro ao verificar autorização:", error);
        setIsAuthorized(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthorization();
  }, [propId]);

  const handleAuthCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/validate-auth-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: authCode, propId }),
      });

      const data = await response.json();
      
      if (data.valid) {
        setIsAuthorized(true);
        alert("Código validado! Você pode enviar sua proposta.");
      } else {
        alert("Código inválido. Por favor, verifique e tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao validar código:", error);
      alert("Erro ao validar código. Tente novamente.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/proposta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          prop_id: propId,
        }),
      });

      if (response.ok) {
        setStatus("sent");
        // Reset form
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          documento: "",
          valor: "",
          condicoes: "",
          justificativa: "",
          mensagem: "",
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Erro ao enviar proposta:", error);
      setStatus("error");
    }
  };

  if (checkingAuth) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[#bfa97a]">Verificando autorização...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="bg-[#0b0b0b] border border-[#242424] rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl font-bold text-[#cfa847] mb-4">
            Autorização Necessária
          </h2>
          <p className="text-[#bfa97a] mb-6">
            Para enviar uma proposta, você precisa primeiro:
          </p>
          
          <div className="space-y-4 text-left max-w-md mx-auto mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <strong className="text-[#e6c86b]">Agendar uma visita</strong>
                <p className="text-sm text-[#bfa97a]">Presencial ou por videoconferência</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <strong className="text-[#e6c86b]">Realizar a visita</strong>
                <p className="text-sm text-[#bfa97a]">Conhecer o imóvel e tirar dúvidas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <strong className="text-[#e6c86b]">Receber código de autorização</strong>
                <p className="text-sm text-[#bfa97a]">Enviado por nossa equipe após a visita</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href={`/schedule-visit?propertyId=${propId || ""}`}
              className="block px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all hover:scale-105"
            >
              📅 Agendar Visita Agora
            </a>

            <div className="text-[#bfa97a]">ou</div>

            <form onSubmit={handleAuthCodeSubmit} className="flex gap-2">
              <input
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="Código de autorização"
                className="flex-1 bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#0f0f0f] border border-amber-500/30 hover:bg-amber-500/10 text-amber-500 font-semibold rounded-lg transition-all"
              >
                Validar
              </button>
            </form>
          </div>
        </div>

        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-amber-400 flex items-start gap-2">
            <span className="text-lg">ℹ️</span>
            <span>
              <strong>Por que essa política?</strong> Garantimos segurança para proprietários e seriedade 
              nas negociações. Apenas interessados que conheceram o imóvel podem fazer propostas.
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0b0b] border border-[#242424] rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center">
          <span className="text-2xl">✓</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#cfa847]">
            Enviar Proposta de Aquisição
          </h2>
          <p className="text-sm text-green-400">Autorizado ✓</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nome" className="block text-sm text-[#bfa97a] mb-2">
              Nome Completo *
            </label>
            <input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label htmlFor="documento" className="block text-sm text-[#bfa97a] mb-2">
              CPF *
            </label>
            <input
              id="documento"
              type="text"
              value={formData.documento}
              onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
              required
              placeholder="000.000.000-00"
              className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm text-[#bfa97a] mb-2">
              E-mail *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label htmlFor="telefone" className="block text-sm text-[#bfa97a] mb-2">
              Telefone/WhatsApp *
            </label>
            <input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              required
              className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Proposal Details */}
        <div>
          <label htmlFor="valor" className="block text-sm text-[#bfa97a] mb-2">
            Valor da Proposta (R$) *
          </label>
          <input
            id="valor"
            type="number"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            required
            placeholder="1.000.000"
            className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div>
          <label htmlFor="condicoes" className="block text-sm text-[#bfa97a] mb-2">
            Condições de Pagamento *
          </label>
          <input
            id="condicoes"
            type="text"
            value={formData.condicoes}
            onChange={(e) => setFormData({ ...formData, condicoes: e.target.value })}
            required
            placeholder="Ex: 30% entrada + financiamento 70%"
            className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div>
          <label htmlFor="justificativa" className="block text-sm text-[#bfa97a] mb-2">
            Justificativa da Proposta
          </label>
          <textarea
            id="justificativa"
            value={formData.justificativa}
            onChange={(e) => setFormData({ ...formData, justificativa: e.target.value })}
            rows={3}
            placeholder="Por que considera este valor justo? (opcional)"
            className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div>
          <label htmlFor="mensagem" className="block text-sm text-[#bfa97a] mb-2">
            Observações Adicionais
          </label>
          <textarea
            id="mensagem"
            value={formData.mensagem}
            onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
            rows={4}
            placeholder="Informações adicionais sobre sua proposta..."
            className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Security Notice */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-amber-400 flex items-start gap-2">
            <span className="text-lg">📋</span>
            <span>
              Sua proposta será analisada e você receberá retorno em até 48 horas úteis. 
              Todas as informações são confidenciais.
            </span>
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {status === "sending" ? "Enviando Proposta..." : "Enviar Proposta"}
        </button>

        {/* Status Messages */}
        {status === "sent" && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center">
            ✓ Proposta enviada com sucesso! Aguarde nosso contato.
          </div>
        )}
        {status === "error" && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
            ✗ Erro ao enviar proposta. Por favor, tente novamente.
          </div>
        )}
      </form>
    </div>
  );
}
