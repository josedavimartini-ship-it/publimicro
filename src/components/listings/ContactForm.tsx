"use client";

import { useState } from "react";

export default function ContactForm({ itemTitle }: { itemTitle: string }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await new Promise((r) => setTimeout(r, 1000)); // simula envio
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Contate o anunciante sobre "{itemTitle}"
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Seu nome completo"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
          className="w-full border rounded-lg p-3"
        />
        <input
          type="email"
          placeholder="Seu e-mail"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full border rounded-lg p-3"
        />
        <input
          type="tel"
          placeholder="Telefone ou WhatsApp"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          className="w-full border rounded-lg p-3"
        />
        <textarea
          placeholder="Escreva sua mensagem..."
          value={form.mensagem}
          onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
          required
          className="w-full border rounded-lg p-3 min-h-[120px]"
        />

        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition"
        >
          {status === "sending" ? "Enviando..." : "Enviar mensagem"}
        </button>

        {status === "sent" && (
          <p className="text-green-600 font-medium mt-2">Mensagem enviada com sucesso!</p>
        )}
        {status === "error" && (
          <p className="text-red-600 font-medium mt-2">Erro ao enviar. Tente novamente.</p>
        )}
      </form>
    </section>
  );
}
