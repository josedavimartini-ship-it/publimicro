import { useEffect, useState } from "react";

const TABS = [
  { key: "ativas", label: "Ativas" },
  { key: "historico", label: "Histórico" },
  { key: "arquivadas", label: "Arquivadas" },
];

export default function ChatTab({ user }: { user: any }) {
  const [tab, setTab] = useState("ativas");
  const [chats, setChats] = useState<any[]>([]);
  useEffect(() => {
    // TODO: Fetch user chats/negotiations from DB, filtered by tab
    setChats([
      {
        id: 1,
        with: "João Silva",
        property: { title: "Sítio dos Sonhos", price: 350000, location: "Zona Rural, MG", fotos: ["/placeholder.jpg"] },
        lastMessage: "Olá, ainda está disponível?",
        unread: 2,
        status: "Proposta enviada",
        lastActivity: "2025-11-05",
        tab: "ativas"
      },
      {
        id: 2,
        with: "Maria Souza",
        property: { title: "Chácara Encantada", price: 280000, location: "Interior, SP", fotos: ["/placeholder.jpg"] },
        lastMessage: "Podemos agendar uma visita?",
        unread: 0,
        status: "Aguardando resposta",
        lastActivity: "2025-11-03",
        tab: "ativas"
      },
      {
        id: 3,
        with: "Carlos Pereira",
        property: { title: "Fazenda Velha", price: 450000, location: "Campo, RS", fotos: ["/placeholder.jpg"] },
        lastMessage: "Proposta aceita! Vamos aos documentos.",
        unread: 0,
        status: "Negociação concluída",
        lastActivity: "2025-10-28",
        tab: "historico"
      },
    ].filter(c => c.tab === tab));
  }, [tab]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      <div className="flex gap-2 mb-6 border-b pb-2">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`px-3 py-1 rounded-t font-bold transition-all ${tab === t.key ? 'bg-[#FFD700] text-black shadow' : 'bg-gray-100 text-gray-500 hover:bg-[#E6C98B]'}`}
            onClick={() => setTab(t.key)}
            type="button"
            aria-selected={tab === t.key}
          >
            {t.label}
          </button>
        ))}
      </div>

      {chats.length === 0 ? (
        <div className="text-center text-gray-400 italic py-12">
          {tab === "ativas" && "Nenhuma conversa ativa ainda... Que tal iniciar um chat com o anunciante?"}
          {tab === "historico" && "Nenhum histórico encontrado. Suas conversas passadas aparecerão aqui."}
          {tab === "arquivadas" && "Nenhuma conversa arquivada. Arquive chats antigos para manter a organização."}
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map((c) => (
            <div key={c.id} className="bg-white rounded shadow p-4 flex gap-4 items-center relative group hover:shadow-lg transition-shadow">
              <img src={c.property.fotos[0]} alt={c.property.title} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-bold text-lg mb-1">{c.property.title}</div>
                <div className="text-sm text-gray-600 mb-1">{c.property.location} • R$ {c.property.price.toLocaleString('pt-BR')}</div>
                <div className="text-sm text-gray-500 mb-1">Com: {c.with}</div>
                <div className="text-sm text-gray-600 italic">"{c.lastMessage}"</div>
                <div className="text-xs text-[#A8C97F] mt-1">Status: {c.status} • Última atividade: {c.lastActivity}</div>
              </div>
              {c.unread > 0 && <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs">{c.unread}</span>}
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-[#FFD700] text-black rounded font-bold hover:bg-[#B87333] transition">Continuar</button>
                <button className="px-3 py-1 bg-[#A8C97F] text-white rounded font-bold hover:bg-[#B87333] transition">Ver imóvel</button>
                {tab === "ativas" && <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded font-bold hover:bg-gray-300 transition">Arquivar</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
