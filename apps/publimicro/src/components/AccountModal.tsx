'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { X } from 'lucide-react';

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AccountModal({ open, onClose }: AccountModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'phone'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const signInWithProvider = async (provider: 'google' | 'azure' | 'apple') => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) throw error;
      setError('Check your email to confirm your account!');
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!otpSent) {
        // Send OTP
        const { error } = await supabase.auth.signInWithOtp({
          phone: phone.startsWith('+') ? phone : `+55${phone.replace(/\D/g, '')}`,
        });
        
        if (error) throw error;
        setOtpSent(true);
        setError('Código enviado! Verifique seu WhatsApp/SMS.');
      } else {
        // Verify OTP
        const { error } = await supabase.auth.verifyOtp({
          phone: phone.startsWith('+') ? phone : `+55${phone.replace(/\D/g, '')}`,
          token: otp,
          type: 'sms',
        });
        
        if (error) throw error;
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl w-full max-w-md relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#676767] hover:text-[#A8C97F] transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] to-[#A8C97F] mb-2">
            {mode === 'login' ? 'Entrar' : mode === 'register' ? 'Cadastrar' : 'Login com Telefone'}
          </h2>
          <p className="text-[#A8C97F] mb-6">
            {mode === 'login'
              ? 'Acesse sua conta para continuar'
              : mode === 'register'
              ? 'Crie sua conta e ganhe 2 anúncios grátis!'
              : 'Entre usando seu número de telefone'}
          </p>

          {mode !== 'phone' && (
            <>
              {/* OAuth Buttons - Compact Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  onClick={() => signInWithProvider('google')}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-white text-[#0a0a0a] rounded-lg hover:bg-gray-100 hover:scale-105 transition-all font-medium disabled:opacity-50"
                  title="Google"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-xs">Google</span>
                </button>

                <button
                  onClick={() => signInWithProvider('azure')}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-[#2F2F2F] text-white rounded-lg hover:bg-[#3F3F3F] hover:scale-105 transition-all font-medium disabled:opacity-50"
                  title="Microsoft"
                >
                  <svg className="w-6 h-6" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span className="text-xs">Microsoft</span>
                </button>

                <button
                  onClick={() => signInWithProvider('apple')}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-black text-white rounded-lg hover:bg-[#1a1a1a] hover:scale-105 transition-all font-medium disabled:opacity-50 border border-[#2a2a1a]"
                  title="Apple"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="text-xs">Apple</span>
                </button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2a2a1a]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] text-[#676767]">ou</span>
                </div>
              </div>

          {/* Phone Login Option Button */}
          <button
            onClick={() => {
              setMode('phone');
              setError('');
              setOtpSent(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0D7377] text-white rounded-lg hover:bg-[#0D7377]/80 hover:scale-105 transition-all font-medium mb-4 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Telefone/WhatsApp
          </button>
          </>
          )}

          {mode === 'phone' ? (
            /* Phone Login Form */
            <form onSubmit={handlePhoneSignIn} className="space-y-3">
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors text-sm"
                required
                disabled={otpSent}
              />

              {otpSent && (
                <input
                  type="text"
                  placeholder="Código de 6 dígitos"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors text-center text-lg tracking-widest"
                  required
                  maxLength={6}
                  autoFocus
                />
              )}

              {error && (
                <div className={`text-xs p-2 rounded-lg ${error.includes('enviado') ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-[#0D7377] to-[#A8C97F] hover:from-[#A8C97F] hover:to-[#0D7377] text-white font-bold rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm"
              >
                {loading ? 'Processando...' : otpSent ? 'Verificar Código' : 'Enviar Código'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setOtpSent(false);
                  setError('');
                  setPhone('');
                  setOtp('');
                }}
                className="w-full text-[#E6C98B] hover:text-[#A8C97F] transition-colors text-xs"
              >
                ← Voltar para outras opções
              </button>
            </form>
          ) : (
          /* Email Form */
          <div>
          <form onSubmit={mode === 'login' ? handleEmailSignIn : handleEmailSignUp} className="space-y-3">
            {mode === 'register' && (
              <>
                <input
                  type="text"
                  placeholder="Nome Completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors text-sm"
                  required
                />
                <input
                  type="tel"
                  placeholder="Telefone (WhatsApp)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors text-sm"
                />
              </>
            )}
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors text-sm"
              required
            />
            
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors text-sm"
              required
              minLength={6}
            />

            {error && (
              <div className={`text-xs p-2 rounded-lg ${error.includes('Check your email') ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-[#A8C97F] to-[#8B9B6E] hover:from-[#8B9B6E] hover:to-[#A8C97F] text-[#0a0a0a] font-bold rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm"
            >
              {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-4 text-center text-xs">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-[#E6C98B] hover:text-[#A8C97F] transition-colors"
            >
              {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}