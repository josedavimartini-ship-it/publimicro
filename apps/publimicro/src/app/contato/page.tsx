"use client";

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabaseBrowser';
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ContatoPage() {
  const supabase = createBrowserSupabaseClient();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: dbError } = await supabase
        .from('contacts')
        .insert({
          name,
          email,
          phone,
          subject,
          message,
          status: 'novo',
        });

      if (dbError) throw dbError;

      setSuccess('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao enviar mensagem.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs />
        
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C9A87C] to-[#B8904D] mb-4">
            Entre em Contato
          </h1>
          <p className="text-[#B8A890] max-w-2xl mx-auto">
            Tem alguma dúvida sobre os Sítios Carcará ou quer saber mais sobre nossas propriedades? 
            Estamos aqui para ajudar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#E6C98B] mb-6">Informações de Contato</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#6B7F5C]/20 rounded-lg">
                    <Phone className="w-6 h-6 text-[#A8C97F]" />
                  </div>
                  <div>
                    <h3 className="text-[#D4C4A8] font-semibold">Telefone</h3>
                    <p className="text-[#8B9B6E]">(61) 99999-9999</p>
                    <p className="text-[#676767] text-sm">WhatsApp disponível</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#6B7F5C]/20 rounded-lg">
                    <Mail className="w-6 h-6 text-[#A8C97F]" />
                  </div>
                  <div>
                    <h3 className="text-[#D4C4A8] font-semibold">Email</h3>
                    <p className="text-[#8B9B6E]">contato@publimicro.com.br</p>
                    <p className="text-[#676767] text-sm">Respondemos em até 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#6B7F5C]/20 rounded-lg">
                    <MapPin className="w-6 h-6 text-[#A8C97F]" />
                  </div>
                  <div>
                    <h3 className="text-[#D4C4A8] font-semibold">Localização</h3>
                    <p className="text-[#8B9B6E]">Planaltina de Goiás - GO</p>
                    <p className="text-[#676767] text-sm">Região do entorno de Brasília</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#E6C98B] mb-4">Horário de Atendimento</h2>
              <div className="space-y-2 text-[#8B9B6E]">
                <p><span className="text-[#D4C4A8]">Segunda a Sexta:</span> 8h às 18h</p>
                <p><span className="text-[#D4C4A8]">Sábados:</span> 9h às 13h</p>
                <p><span className="text-[#D4C4A8]">Domingos:</span> Agendamento prévio</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#2a2a2a] border-2 border-[#3a3a3a] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-[#A8C97F]" />
              <h2 className="text-2xl font-bold text-[#E6C98B]">Envie sua Mensagem</h2>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#D4C4A8] font-semibold mb-2">Nome *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#D4C4A8] font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#D4C4A8] font-semibold mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#D4C4A8] font-semibold mb-2">Assunto *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                  required
                >
                  <option value="">Selecione um assunto</option>
                  <option value="Interesse em propriedade">Interesse em propriedade</option>
                  <option value="Agendar visita">Agendar visita</option>
                  <option value="Dúvidas gerais">Dúvidas gerais</option>
                  <option value="Proposta">Fazer uma proposta</option>
                  <option value="Outro">Outro assunto</option>
                </select>
              </div>

              <div>
                <label className="block text-[#D4C4A8] font-semibold mb-2">Mensagem *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                  placeholder="Como podemos ajudar?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] hover:from-[#7A8F6B] hover:to-[#3A6F7F] text-[#D4C4A8] font-bold rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Mensagem
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}





















