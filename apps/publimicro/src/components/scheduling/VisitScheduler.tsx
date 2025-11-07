"use client";

import { useState, useEffect } from "react";
import FocusLock from "react-focus-lock";

interface VisitSchedulerProps {
  propertyId?: string;
  propertyTitle?: string;
  onClose?: () => void;  // Optional close callback
}

type VisitType = "presencial" | "video";

export default function VisitScheduler({ 
  propertyId, 
  propertyTitle 
}: VisitSchedulerProps) {
  const [visitType, setVisitType] = useState<VisitType>("presencial");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    documento: "", // CPF/RG for security
    cidade: "",
    estado: "",
    pais: "Brasil",
    dataPreferencia: "",
    horarioPreferencia: "",
    mensagem: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/schedule-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          visitType,
          propertyId,
          propertyTitle,
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
          cidade: "",
          estado: "",
          pais: "Brasil",
          dataPreferencia: "",
          horarioPreferencia: "",
          mensagem: "",
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Erro ao agendar visita:", error);
      setStatus("error");
    }
  };

  return (
    <div className="bg-[#0b0b0b] border border-[#242424] rounded-2xl p-8">
      <h2 className="text-3xl font-bold text-[#cfa847] mb-2">
        Agendar Visita
      </h2>
      <p className="text-[#bfa97a] mb-6">
        {propertyTitle ? `Para: ${propertyTitle}` : "Escolha o tipo de visita e preencha os dados"}
      </p>

      {/* Visit Type Toggle */}
      <div className="flex gap-4 mb-8">
        <button
          type="button"
          onClick={() => setVisitType("presencial")}
          className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
            visitType === "presencial"
              ? "bg-amber-500 text-black shadow-lg"
              : "bg-[#0f0f0f] border border-[#242424] text-[#bfa97a] hover:border-amber-500/30"
          }`}
        >
          <div className="text-2xl mb-1">🏠</div>
          Visita Presencial
        </button>
        <button
          type="button"
          onClick={() => setVisitType("video")}
          className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
            visitType === "video"
              ? "bg-amber-500 text-black shadow-lg"
              : "bg-[#0f0f0f] border border-[#242424] text-[#bfa97a] hover:border-amber-500/30"
          }`}
        >
          <div className="text-2xl mb-1">📹</div>
          Videoconferência
        </button>
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
              CPF ou RG * (para segurança)
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
              WhatsApp *
            </label>
            <input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              required
              placeholder="+55 (62) 99999-9999"
              className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="cidade" className="block text-sm text-[#bfa97a] mb-2">
              Cidade *
            </label>
            <input
              id="cidade"
              type="text"
              value={formData.cidade}
              onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              required
              className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label htmlFor="estado" className="block text-sm text-[#bfa97a] mb-2">
              Estado *
            </label>
            <input
              id="estado"
              type="text"
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              required
              placeholder="GO"
              className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label htmlFor="pais" className="block text-sm text-[#bfa97a] mb-2">
              País
            </label>
            <input
              id="pais"
              type="text"
              value={formData.pais}
              onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="data" className="block text-sm text-[#bfa97a] mb-2">
              Data Preferencial *
            </label>
            <input
              id="data"
              type="date"
              value={formData.dataPreferencia}
              onChange={(e) => setFormData({ ...formData, dataPreferencia: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label htmlFor="horario" className="block text-sm text-[#bfa97a] mb-2">
              Horário Preferencial *
            </label>
            <select
              id="horario"
              value={formData.horarioPreferencia}
              onChange={(e) => setFormData({ ...formData, horarioPreferencia: e.target.value })}
              required
              className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
            >
              <option value="">Selecione</option>
              <option value="manhã">Manhã (8h - 12h)</option>
              <option value="tarde">Tarde (13h - 17h)</option>
              <option value="noite">Noite (18h - 20h)</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="mensagem" className="block text-sm text-[#bfa97a] mb-2">
            Mensagem (opcional)
          </label>
          <textarea
            id="mensagem"
            value={formData.mensagem}
            onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
            rows={4}
            placeholder="Informações adicionais, dúvidas ou solicitações especiais..."
            className="w-full bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Security Notice */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-amber-400 flex items-start gap-2">
            <span className="text-lg">🔒</span>
            <span>
              <strong>Política de Segurança:</strong> Seus dados serão verificados antes da confirmação. 
              Visitas presenciais requerem documentação válida. Manteremos suas informações confidenciais.
            </span>
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {status === "sending" ? "Enviando..." : `Agendar ${visitType === "video" ? "Videoconferência" : "Visita Presencial"}`}
        </button>

        {/* Status Messages */}
        {status === "sent" && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center">
            ✓ Solicitação enviada com sucesso! Entraremos em contato em até 24h.
          </div>
        )}
        {status === "error" && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
            ✗ Erro ao enviar. Por favor, tente novamente ou entre em contato via WhatsApp.
          </div>
        )}
      </form>
    </div>
  );
}
