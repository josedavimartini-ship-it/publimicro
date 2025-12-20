"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { 
  MessageCircle, Send, Search, MoreVertical, Phone, Video,
  ChevronLeft, Check, CheckCheck, Paperclip, Smile, Pin
} from "lucide-react";
import { AnimatedHandshake } from "@/components/AnimatedHandshake";
import Link from "next/link";

// Conversation type
interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    online: boolean;
  };
  listing?: {
    id: string;
    title: string;
    price: number;
    image?: string;
  };
  lastMessage: {
    text: string;
    timestamp: Date;
    isRead: boolean;
    fromMe: boolean;
  };
  unreadCount: number;
  isPinned: boolean;
}

// Message type
interface Message {
  id: string;
  text: string;
  timestamp: Date;
  fromMe: boolean;
  isRead: boolean;
  type: "text" | "image" | "offer" | "system";
  offerAmount?: number;
  offerStatus?: "pending" | "accepted" | "rejected" | "countered";
}

// Mock data for demonstration
const mockConversations: Conversation[] = [
  {
    id: "1",
    participant: {
      id: "u1",
      name: "João Silva",
      avatar: "https://i.pravatar.cc/150?u=joao",
      online: true,
    },
    listing: {
      id: "l1",
      title: "iPhone 14 Pro Max 256GB",
      price: 5500,
      image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=100",
    },
    lastMessage: {
      text: "Aceito sua proposta!",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
      fromMe: false,
    },
    unreadCount: 2,
    isPinned: true,
  },
  {
    id: "2",
    participant: {
      id: "u2",
      name: "Maria Santos",
      online: false,
    },
    listing: {
      id: "l2",
      title: "Sítio em Minas Gerais",
      price: 850000,
    },
    lastMessage: {
      text: "Podemos agendar uma visita?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
      fromMe: true,
    },
    unreadCount: 0,
    isPinned: false,
  },
];

const mockMessages: Message[] = [
  {
    id: "m1",
    text: "Olá! Vi seu anúncio do iPhone e tenho interesse.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    fromMe: true,
    isRead: true,
    type: "text",
  },
  {
    id: "m2",
    text: "Oi! Obrigado pelo interesse. O aparelho está em ótimo estado, com apenas 6 meses de uso.",
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    fromMe: false,
    isRead: true,
    type: "text",
  },
  {
    id: "m3",
    text: "Qual o menor valor que aceita?",
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    fromMe: true,
    isRead: true,
    type: "text",
  },
  {
    id: "m4",
    text: "",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    fromMe: true,
    isRead: true,
    type: "offer",
    offerAmount: 5000,
    offerStatus: "pending",
  },
  {
    id: "m5",
    text: "Aceito sua proposta!",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    fromMe: false,
    isRead: false,
    type: "text",
  },
];

export default function ChatPage() {
  const { user, loading } = useAuth();
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.listing?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  // Format price
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `m${Date.now()}`,
      text: newMessage,
      timestamp: new Date(),
      fromMe: true,
      isRead: false,
      type: "text",
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  // Send offer
  const handleSendOffer = () => {
    const amount = parseFloat(offerAmount.replace(/\D/g, "")) / 100;
    if (!amount) return;

    const offer: Message = {
      id: `m${Date.now()}`,
      text: "",
      timestamp: new Date(),
      fromMe: true,
      isRead: false,
      type: "offer",
      offerAmount: amount,
      offerStatus: "pending",
    };

    setMessages([...messages, offer]);
    setOfferAmount("");
    setShowOfferModal(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AnimatedHandshake size={80} className="mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#E6C98B] mb-4">Chat & Negociação</h1>
          <p className="text-[#9ca3af] mb-8">
            Faça login para acessar suas conversas e negociar com vendedores e compradores.
          </p>
          <Link
            href="/entrar?redirect=/chat"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] text-[#0a0a0a] rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-5 h-5" />
            Entrar para conversar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-[calc(100vh-5rem)]">
          {/* Conversations List */}
          <div
            className={`
              w-full md:w-96 bg-[#121212] border-r border-[#2a2a2a]
              ${selectedConversation ? "hidden md:block" : "block"}
            `}
          >
            {/* Header */}
            <div className="p-4 border-b border-[#2a2a2a]">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-[#E6C98B] flex items-center gap-2">
                  <AnimatedHandshake size={24} />
                  Chat
                </h1>
                <button className="p-2 text-[#9ca3af] hover:text-[#E6C98B] transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar conversas..."
                  className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#E6C98B] placeholder-[#666] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="overflow-y-auto h-[calc(100%-140px)]">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-[#666]">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conversa encontrada</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`
                      w-full p-4 flex items-start gap-3 hover:bg-[#1a1a1a] transition-colors border-b border-[#1a1a1a]
                      ${selectedConversation?.id === conv.id ? "bg-[#1a1a1a]" : ""}
                    `}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {conv.participant.avatar ? (
                        <img
                          src={conv.participant.avatar}
                          alt={conv.participant.name}
                          className="w-12 h-12 rounded-full border-2 border-[#2a2a2a]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6B7F5C] to-[#8B9B6E] flex items-center justify-center text-warm font-bold">
                          {conv.participant.name[0]}
                        </div>
                      )}
                      {conv.participant.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-[#E6C98B] truncate flex items-center gap-1">
                          {conv.isPinned && <Pin className="w-3 h-3 text-[#D4AF37]" />}
                          {conv.participant.name}
                        </span>
                        <span className="text-xs text-[#666] flex-shrink-0">
                          {formatTime(conv.lastMessage.timestamp)}
                        </span>
                      </div>

                      {conv.listing && (
                        <p className="text-xs text-[#8B9B6E] truncate mb-1">
                          {conv.listing.title}
                        </p>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-[#9ca3af] truncate">
                          {conv.lastMessage.fromMe && (
                            <span className="mr-1">
                              {conv.lastMessage.isRead ? (
                                <CheckCheck className="w-4 h-4 inline text-[#8B9B6E]" />
                              ) : (
                                <Check className="w-4 h-4 inline" />
                              )}
                            </span>
                          )}
                          {conv.lastMessage.text}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 bg-[#D4AF37] text-[#0a0a0a] rounded-full text-xs font-bold flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat View */}
          {selectedConversation ? (
            <div className="flex-1 flex flex-col bg-[#0a0a0a]">
              {/* Chat Header */}
              <div className="p-4 bg-[#121212] border-b border-[#2a2a2a] flex items-center gap-4">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 text-[#9ca3af] hover:text-[#E6C98B] transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* User Info */}
                <div className="flex items-center gap-3 flex-1">
                  {selectedConversation.participant.avatar ? (
                    <img
                      src={selectedConversation.participant.avatar}
                      alt={selectedConversation.participant.name}
                      className="w-10 h-10 rounded-full border-2 border-[#2a2a2a]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B7F5C] to-[#8B9B6E] flex items-center justify-center text-warm font-bold">
                      {selectedConversation.participant.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-[#E6C98B]">
                      {selectedConversation.participant.name}
                    </p>
                    <p className="text-xs text-[#666]">
                      {selectedConversation.participant.online ? (
                        <span className="text-green-500">Online</span>
                      ) : (
                        "Offline"
                      )}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="p-2 text-[#9ca3af] hover:text-[#E6C98B] transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-[#9ca3af] hover:text-[#E6C98B] transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-[#9ca3af] hover:text-[#E6C98B] transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Listing Banner */}
              {selectedConversation.listing && (
                <div className="p-3 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center gap-3">
                  {selectedConversation.listing.image && (
                    <img
                      src={selectedConversation.listing.image}
                      alt={selectedConversation.listing.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#E6C98B] truncate">
                      {selectedConversation.listing.title}
                    </p>
                    <p className="text-sm font-bold text-[#8B9B6E]">
                      {formatPrice(selectedConversation.listing.price)}
                    </p>
                  </div>
                  <Link
                    href={`/anuncio/${selectedConversation.listing.id}`}
                    className="px-3 py-1 bg-[#252525] text-[#E6C98B] text-xs rounded-lg hover:bg-[#333] transition-colors"
                  >
                    Ver anúncio
                  </Link>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
                  >
                    {msg.type === "offer" ? (
                      <div
                        className={`
                          max-w-xs p-4 rounded-2xl border-2
                          ${msg.fromMe 
                            ? "bg-gradient-to-br from-[#D4AF37]/20 to-[#CD7F32]/20 border-[#D4AF37]" 
                            : "bg-gradient-to-br from-[#6B7F5C]/20 to-[#8B9B6E]/20 border-[#8B9B6E]"
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <AnimatedHandshake size={20} />
                          <span className="text-sm font-medium text-[#E6C98B]">
                            {msg.fromMe ? "Sua proposta" : "Proposta recebida"}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-[#D4AF37]">
                          {typeof msg.offerAmount === 'number' ? formatPrice(msg.offerAmount) : '—'}
                        </p>
                        {msg.offerStatus === "pending" && !msg.fromMe && (
                          <div className="flex gap-2 mt-3">
                            <button className="flex-1 py-2 bg-[#8B9B6E] text-warm rounded-lg text-sm font-medium hover:bg-[#6B7F5C] transition-colors">
                              Aceitar
                            </button>
                            <button className="flex-1 py-2 bg-[#1a1a1a] text-[#E6C98B] rounded-lg text-sm font-medium hover:bg-[#252525] transition-colors">
                              Recusar
                            </button>
                          </div>
                        )}
                        <p className="text-[10px] text-[#666] mt-2 text-right">
                          {msg.timestamp.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ) : (
                      <div
                        className={`
                          max-w-[70%] px-4 py-2 rounded-2xl
                          ${msg.fromMe
                            ? "bg-gradient-to-r from-[#6B7F5C] to-[#8B9B6E] text-white rounded-br-none"
                            : "bg-[#1a1a1a] text-[#E6C98B] rounded-bl-none"
                          }
                        `}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[10px] opacity-70">
                            {msg.timestamp.toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {msg.fromMe && (
                            msg.isRead ? (
                              <CheckCheck className="w-3 h-3 text-[#D4AF37]" />
                            ) : (
                              <Check className="w-3 h-3 opacity-70" />
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-[#121212] border-t border-[#2a2a2a]">
                <div className="flex items-center gap-3">
                  <button className="p-2 text-[#666] hover:text-[#E6C98B] transition-colors">
                    <Smile className="w-6 h-6" />
                  </button>
                  <button className="p-2 text-[#666] hover:text-[#E6C98B] transition-colors">
                    <Paperclip className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setShowOfferModal(true)}
                    className="p-2 text-[#D4AF37] hover:text-[#CD7F32] transition-colors"
                    title="Enviar proposta"
                  >
                    <AnimatedHandshake size={24} />
                  </button>

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-[#E6C98B] placeholder-[#666] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-gradient-to-r from-[#6B7F5C] to-[#8B9B6E] text-warm rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-[#0a0a0a]">
              <div className="text-center">
                <AnimatedHandshake size={80} className="mx-auto mb-6 opacity-50" />
                <h2 className="text-xl font-bold text-[#E6C98B] mb-2">
                  Selecione uma conversa
                </h2>
                <p className="text-[#666]">
                  Escolha uma conversa para começar a negociar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-md w-full border border-[#2a2a2a]">
            <div className="flex items-center gap-3 mb-6">
              <AnimatedHandshake size={32} />
              <h3 className="text-xl font-bold text-[#E6C98B]">Enviar Proposta</h3>
            </div>

            <div className="mb-6">
              <label className="text-sm text-[#9ca3af] mb-2 block">Valor da proposta</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]">R$</span>
                <input
                  type="text"
                  value={offerAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    const formatted = (parseInt(value) / 100).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    });
                    setOfferAmount(value ? formatted : "");
                  }}
                  placeholder="0,00"
                  className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-[#333] rounded-xl text-2xl font-bold text-[#E6C98B] placeholder-[#666] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 py-3 bg-[#252525] text-[#E6C98B] rounded-xl font-medium hover:bg-[#333] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendOffer}
                disabled={!offerAmount}
                className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] text-[#0a0a0a] rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Enviar Proposta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







