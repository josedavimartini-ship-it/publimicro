"use client";
import { useState } from "react";

export default function NewListing(): JSX.Element {
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [preco, setPreco] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    const payload = {
      titulo,
      descricao,
      preco: Number(preco),
      localizacao: "Goiás",
      imagens: [] as string[],
    };

    try {
      const res = await fetch("/api/anuncios", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const data: { data?: { id: string }; error?: string } = await res.json();

      if (res.ok && data.data) {
        alert("Anúncio criado: " + data.data.id);
        window.location.href = "/admin";
      } else {
        alert("Erro: " + (data.error || "Falha desconhecida"));
      }
    } catch (error) {
      console.error("Erro ao enviar anúncio:", error);
      alert("Erro inesperado ao criar o anúncio.");
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1>Novo Anúncio</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <input
          placeholder="Preço (R$)"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          type="number"
          required
        />
        <button
          type="submit"
          style={{
            background: "#2E7D32",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 6,
          }}
        >
          Publicar
        </button>
      </form>
    </main>
  );
}
