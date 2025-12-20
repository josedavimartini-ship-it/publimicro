"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronDown, ChevronUp, User, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read: boolean;
}

interface PropertyChatBoxProps {
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
  sellerName?: string;
}

export default function PropertyChatBox({ 
  propertyId, 
  propertyTitle,
  sellerId,
  sellerName = 'Vendedor'
}: PropertyChatBoxProps) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation and messages when expanded
  useEffect(() => {
    if (!isExpanded || !user) return;

    async function loadConversation() {
      setLoading(true);
      try {
        // Find existing conversation
        const { data: conv } = await supabase
          .from('conversations')
          .select('id')
          .eq('item_id', propertyId)
          .or(`and(participant_1.eq.${user.id},participant_2.eq.${sellerId}),and(participant_1.eq.${sellerId},participant_2.eq.${user.id})`)
          .single();

        if (conv) {
          setConversationId(conv.id);
          
          // Load messages
          const { data: msgs } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          setMessages(msgs || []);

          // Mark messages as read
          await supabase
            .from('messages')
            .update({ read: true })
            .eq('conversation_id', conv.id)
            .eq('receiver_id', user.id)
            .eq('read', false);
        }
      } catch (error) {
        console.error('Error loading conversation:', error);
      } finally {
        setLoading(false);
      }
    }

    void loadConversation();

    // Subscribe to new messages
    let channel: ReturnType<typeof supabase.channel> | null = null;
    void (async () => {
      channel = await supabase
        .channel(`property_chat_${propertyId}_${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined
        }, (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);
          
          // Mark as read if we're the receiver and chat is open
          if (newMsg.sender_id !== user.id && isExpanded) {
            void supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMsg.id);
          }
        })
        .subscribe();
    })();

    return () => {
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [isExpanded, user, propertyId, sellerId, conversationId]);

  // Check for unread messages on mount
  useEffect(() => {
    if (!user) return;

    async function checkUnread() {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('item_id', propertyId)
        .eq('receiver_id', user.id)
        .eq('read', false);

      setUnreadCount(count || 0);
    }

    void checkUnread();
  }, [user, propertyId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_id: sellerId,
          item_id: propertyId,
          item_type: 'property',
          item_title: propertyTitle,
          message: newMessage.trim()
        })
      });

      const result = await response.json();

      if (response.ok) {
        setNewMessage('');
        setConversationId(result.conversation_id);
        
        // Add message to local state immediately
        setMessages(prev => [...prev, result.message]);
        
        // Focus back on input
        inputRef.current?.focus();
      } else {
        alert(result.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const handleExpand = () => {
    if (!user) {
      // Redirect to login
      router.push(`/entrar?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    // Check if profile exists and is verified (phone_verified is optional)
    const isVerified = Boolean(profile?.verified || profile?.phone_verified);
    if (!isVerified) {
      alert('Por favor, verifique sua conta antes de enviar mensagens.');
      router.push('/conta?tab=verificacao');
      return;
    }

    setIsExpanded(true);
    setIsMinimized(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ontem ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('pt-BR', { weekday: 'short' }) + ' ' + 
             date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  // Collapsed state - just the chat button
  if (!isExpanded) {
    return (
      <motion.button
        onClick={handleExpand}
        className="fixed bottom-24 right-4 md:relative md:bottom-auto md:right-auto flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#5A6B4D] text-warm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-semibold">Conversar com {sellerName}</span>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-warm text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>
    );
  }

  // Expanded chat box
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-4 right-4 md:relative md:bottom-auto md:right-auto w-full max-w-md bg-[#1a1a1a] border-2 border-[#6B7F5C]/50 rounded-2xl shadow-2xl overflow-hidden z-50 ${
        isMinimized ? 'h-14' : 'h-[500px] md:h-[450px]'
      }`}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#5A6B4D] cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{sellerName}</h3>
            <p className="text-white/70 text-xs truncate max-w-[180px]">{propertyTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-white/10 rounded">
            {isMinimized ? <ChevronUp className="w-5 h-5 text-warm" /> : <ChevronDown className="w-5 h-5 text-warm" />}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="p-1 hover:bg-white/10 rounded"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="flex flex-col h-[calc(100%-56px)]"
          >
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0a0a]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin w-8 h-8 border-2 border-[#6B7F5C] border-t-transparent rounded-full" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <MessageCircle className="w-12 h-12 text-[#6B7F5C]/50 mb-3" />
                  <p className="text-[#8B9B6E] text-sm">
                    Inicie uma conversa com o vendedor sobre este imóvel.
                  </p>
                  <p className="text-[#676767] text-xs mt-2">
                    Tire suas dúvidas, agende visitas, negocie valores...
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          msg.sender_id === user?.id
                            ? 'bg-[#6B7F5C] text-white rounded-br-md'
                            : 'bg-[#2a2a2a] text-[#E6C98B] rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${
                          msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}>
                          <Clock className="w-3 h-3 opacity-50" />
                          <span className="text-xs opacity-50">{formatTime(msg.created_at)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#1a1a1a] border-t border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-full text-warm placeholder-[#676767] focus:outline-none focus:border-[#6B7F5C] text-sm"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="p-2 bg-[#6B7F5C] text-warm rounded-full hover:bg-[#7A8F6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {/* Quick messages */}
              <div className="flex flex-wrap gap-1 mt-2">
                {['Ainda disponível?', 'Aceita proposta?', 'Posso visitar?'].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setNewMessage(quick)}
                    className="px-2 py-1 text-xs bg-[#2a2a2a] text-[#8B9B6E] rounded-full hover:bg-[#3a3a3a] transition-colors"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
