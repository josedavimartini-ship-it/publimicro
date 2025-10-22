"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Definimos um tipo seguro pros itens retornados do Supabase
type Item = {
  id: string;
  titulo: string;
  preco?: number;
};

// Função principal com tipo de retorno explícito
export default function AdminPage(): JSX.Element {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchItems(): Promise<void> {
      try {
        const { data, error } = await supabase.from("items").select("*");
        if (error) throw error;

        // Garantimos que `data` seja do tipo Item[]
        setItems((data as Item[]) || []);
      } catch (err) {
        console.error("Erro ao carregar itens:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchItems();
  }, []);

  // Função com tipo e await explícito
  const approve = async (id: string): Promise<void> => {
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
              <strong>{item.titulo}</strong> – R$ {item.preco ?? "0,00"}
              <button
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  void approve(item.id);
                }}
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
