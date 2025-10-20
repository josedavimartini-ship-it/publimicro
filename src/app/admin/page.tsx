"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase.from("items").select("*");
        if (error) throw error;
        setItems(data || []); // Garante que nunca fique undefined
      } catch (err) {
        console.error("Erro ao carregar itens:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  const approve = async (id: string) => {
    alert(`Item ${id} aprovado (função em construção)`);
  };

  return (
    <main style={{ padding: 24, background: "#f6f6f6", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 16 }}>Painel Admin</h1>

      {loading ? (
        <p>Carregando anúncios...</p>
      ) : items.length === 0 ? (
        <p>Nenhum anúncio cadastrado ainda.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                background: "#fff",
                padding: 12,
                marginBottom: 8,
                borderRadius: 6,
              }}
            >
              <strong>{item.titulo}</strong> – R$ {item.preco}
              <button
                onClick={() => approve(item.id)}
                style={{ marginLeft: 12 }}
              >
                Aprovar
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
