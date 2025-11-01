"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Mail, Phone, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const { error: submitError } = await supabase
        .from("contacts")
        .insert({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone || null,
          mensagem: formData.mensagem,
          status: "novo",
        });

      if (submitError) throw submitError;

      setSuccess(true);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        mensagem: "",
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      setError(err.message || "Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/sitioCanarioFogueira.jpg"
          alt="Fundo contato"
          fill
          className="object-cover brightness-75"
          priority
        />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 text-[#D4A574] border border-[#D4A574]/30 rounded-full transition-all backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </Link>
      </div>

      {/* Conteúdo */}
      <section className="flex flex-col items-center justify-center min-h-screen text-[#D4A574] text-center px-6 py-20">
        <div className="bg-black/70 backdrop-blur-sm p-10 rounded-2xl max-w-2xl w-full shadow-2xl border border-[#D4A574]/20">
          <h1 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#D4A574] to-[#FF6B35]">
            Contato & Agendamento
          </h1>
          <p className="mb-8 text-lg text-[#8B9B6E]">
            Solicite informações, agende visitas presenciais ou videoconferências.
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg flex items-center gap-3 animate-pulse">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <div className="text-left">
                <p className="text-green-400 font-semibold">Mensagem enviada com sucesso!</p>
                <p className="text-green-300 text-sm">Entraremos em contato em breve.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-left">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="sr-only">Nome completo</label>
              <input
                id="nome"
                type="text"
                placeholder="Nome completo *"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                className="w-full p-4 rounded-lg bg-[#0a0a0a]/80 border-2 border-[#2a2a1a] text-[#D4A574] placeholder-[#676767] focus:border-[#FF6B35] focus:outline-none transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#676767]" />
                <input
                  id="email"
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-[#0a0a0a]/80 border-2 border-[#2a2a1a] text-[#D4A574] placeholder-[#676767] focus:border-[#FF6B35] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="telefone" className="sr-only">Telefone ou WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#676767]" />
                <input
                  id="telefone"
                  type="text"
                  placeholder="Telefone/WhatsApp"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-[#0a0a0a]/80 border-2 border-[#2a2a1a] text-[#D4A574] placeholder-[#676767] focus:border-[#FF6B35] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Mensagem */}
            <div>
              <label htmlFor="mensagem" className="sr-only">Mensagem</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#676767]" />
                <textarea
                  id="mensagem"
                  placeholder="Mensagem *"
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  required
                  rows={5}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-[#0a0a0a]/80 border-2 border-[#2a2a1a] text-[#D4A574] placeholder-[#676767] focus:border-[#FF6B35] focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] font-bold py-4 rounded-full transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Enviando..." : "✉️ Enviar solicitação"}
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-[#2a2a1a]">
            <p className="text-[#8B9B6E] text-sm mb-3">Ou entre em contato diretamente:</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/5534992610004"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#25D366] text-[#25D366] font-semibold rounded-full hover:bg-[#25D366]/10 transition-all"
              >
                <Phone className="w-5 h-5" />
                WhatsApp
              </a>
              <a
                href="mailto:contato@publimicro.com.br"
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#D4A574] text-[#D4A574] font-semibold rounded-full hover:bg-[#D4A574]/10 transition-all"
              >
                <Mail className="w-5 h-5" />
                Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
