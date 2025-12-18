"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface ChatBalloonProps {
  sellerId: string;
  sellerName?: string;
  itemId: string;
  itemType: 'property' | 'listing' | 'vehicle';
  itemTitle: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ChatBalloon({
  sellerId,
  sellerName = 'Vendedor',
  itemId,
  itemType,
  itemTitle,
  size = 'md',
  className = ''
}: ChatBalloonProps) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sizeConfig = {
    sm: { button: 'w-10 h-10', icon: 'w-5 h-5' },
    md: { button: 'w-12 h-12', icon: 'w-6 h-6' },
    lg: { button: 'w-14 h-14', icon: 'w-7 h-7' }
  };

  const handleClick = () => {
    if (!user) {
      router.push(`/entrar?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    if (!profile?.verified) {
      // Show message that verification is required
      alert('Você precisa verificar sua conta antes de enviar mensagens. Complete seu perfil e aguarde a verificação.');
      router.push('/conta');
      return;
    }
    
    setIsOpen(true);
  };

  const handleSend = async () => {
    if (!message.trim() || !user) return;
    
    setSending(true);
    
    try {
      // Here you would typically call an API to send the message
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: sellerId,
          item_id: itemId,
          item_type: itemType,
          item_title: itemTitle,
          message: message.trim()
        })
      });

      if (response.ok) {
        setSent(true);
        setMessage('');
        setTimeout(() => {
          setIsOpen(false);
          setSent(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const quickMessages = [
    'Ainda está disponível?',
    'Qual o menor valor?',
    'Aceita troca?',
    'Pode enviar mais fotos?'
  ];

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={handleClick}
        className={`${sizeConfig[size].button} ${className} rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Enviar mensagem ao vendedor"
      >
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
          }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity, 
            repeatDelay: 3 
          }}
        >
          <MessageCircle className={sizeConfig[size].icon} />
        </motion.div>
        
        {/* Notification dot */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center">
          <span className="text-[8px] font-bold text-[#0a0a0a]">1</span>
        </span>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl w-full max-w-md overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{sellerName}</h3>
                    <p className="text-xs text-white/80 truncate max-w-[200px]">{itemTitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {sent ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <motion.svg
                        className="w-8 h-8 text-[#25D366]"
                        viewBox="0 0 24 24"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    </div>
                    <h4 className="text-lg font-bold text-[#25D366]">Mensagem Enviada!</h4>
                    <p className="text-[#8B9B6E] text-sm mt-2">O vendedor receberá sua mensagem em breve.</p>
                  </motion.div>
                ) : (
                  <>
                    {/* Quick Messages */}
                    <div>
                      <p className="text-xs text-[#8B9B6E] mb-2">Mensagens rápidas:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickMessages.map((msg, i) => (
                          <button
                            key={i}
                            onClick={() => setMessage(msg)}
                            className="px-3 py-1.5 bg-[#2a2a1a] border border-[#3a3a2a] rounded-full text-xs text-[#C9A87C] hover:bg-[#3a3a2a] transition-colors"
                          >
                            {msg}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="space-y-3">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="w-full h-24 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-xl p-3 text-[#E6C98B] placeholder-[#676767] resize-none focus:border-[#25D366] focus:outline-none transition-colors"
                      />
                      
                      <button
                        onClick={() => void handleSend()}
                        disabled={!message.trim() || sending}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                          message.trim() && !sending
                            ? 'bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white hover:opacity-90'
                            : 'bg-[#2a2a1a] text-[#676767] cursor-not-allowed'
                        }`}
                      >
                        {sending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Enviar Mensagem
                          </>
                        )}
                      </button>
                    </div>

                    {/* Security Notice */}
                    <p className="text-xs text-[#676767] text-center">
                      🔒 Suas mensagens são protegidas. Nunca compartilhe dados bancários.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
