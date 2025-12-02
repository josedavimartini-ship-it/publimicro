"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabaseBrowser';
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function EntrarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserSupabaseClient();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    void checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push(redirectTo);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push(redirectTo);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao entrar. Verifique suas credenciais.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
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
      setSuccess('Conta criada! Verifique seu email para confirmar.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar conta.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError('');

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao entrar com Google.';
      setError(msg);
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          Verificando...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-6">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C9A87C] to-[#B8904D]">
              PubliMicro
            </h1>
          </Link>
          <p className="text-[#B8A890] mt-2">
            {mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-[#2a2a2a] border-2 border-[#3a3a3a] rounded-2xl p-8">
          {/* Mode Toggle */}
          <div className="flex mb-6 bg-[#1a1a1a] rounded-lg p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-[#6B7F5C] text-white'
                  : 'text-[#8B9B6E] hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-[#6B7F5C] text-white'
                  : 'text-[#8B9B6E] hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 mb-6"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continuar com Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#3a3a3a]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#2a2a2a] text-[#8B9B6E]">ou</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={mode === 'login' ? handleSignIn : handleSignUp} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-[#D4C4A8] font-semibold mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#D4C4A8] font-semibold mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[#D4C4A8] font-semibold mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
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
              <label className="block text-[#D4C4A8] font-semibold mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4C4A8] rounded-lg focus:outline-none focus:border-[#6B7F5C]"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] hover:from-[#7A8F6B] hover:to-[#3A6F7F] text-[#D4C4A8] font-bold rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Entrar' : 'Criar Conta'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {mode === 'login' && (
            <p className="mt-4 text-center text-[#8B9B6E] text-sm">
              <Link href="/recuperar-senha" className="hover:text-[#A8C97F] underline">
                Esqueceu sua senha?
              </Link>
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-[#676767] text-sm">
          Ao continuar, você concorda com nossos{' '}
          <Link href="/termos" className="text-[#8B9B6E] hover:underline">
            Termos de Uso
          </Link>{' '}
          e{' '}
          <Link href="/privacidade" className="text-[#8B9B6E] hover:underline">
            Política de Privacidade
          </Link>
        </p>
      </div>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]"></div>
    </main>
  );
}

export default function EntrarPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EntrarContent />
    </Suspense>
  );
}





















