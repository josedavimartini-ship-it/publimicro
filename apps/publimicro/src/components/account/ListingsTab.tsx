import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ListingsTab({ user }: { user: any }) {
  const [listings, setListings] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("properties").select("*", { count: "exact" }).eq("user_id", user.id).then(({ data }) => {
      setListings(data || []);
    });
  }, [user]);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Meus Anúncios</h2>
      {listings.length === 0 ? <div>Nenhum anúncio encontrado.</div> : (
        <ul className="space-y-2">
          {listings.map((l) => (
            <li key={l.id} className="p-4 bg-gray-100 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-bold text-lg">{l.title || l.titulo}</div>
                <div className="text-sm text-gray-600">{l.status}</div>
              </div>
              <a href={`/imoveis/${l.id}`} className="mt-2 md:mt-0 px-4 py-2 bg-[#FFD700] text-black rounded font-bold hover:bg-[#B87333] transition">Ver anúncio</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
