'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabaseBrowser';
import VerificationWizard from '@/components/verification/VerificationWizard';

export default function VerificationPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const checkAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/entrar?redirect=/verificacao');
        return;
      }

      setUser(session.user);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/entrar?redirect=/verificacao');
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B7F5C] mb-4" />
          <p className="text-[#B8A890]">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2a2a2a] border border-[#3a3a3a] rounded-full mb-4">
            <svg
              className="w-8 h-8 text-[#6B7F5C]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#C9A87C] mb-2">
            Verificação de Identidade
          </h1>
          <p className="text-lg text-[#B8A890] max-w-2xl mx-auto">
            Para garantir a segurança de todos os usuários, precisamos verificar sua identidade antes de liberar recursos premium.
          </p>
        </div>

        {/* Benefits Banner */}
        <div className="bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] rounded-lg p-6 mb-8 text-[#D4C4A8]">
          <h3 className="text-xl font-semibold mb-3">
            ✨ O que você ganha com a verificação:
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div>
                <p className="font-medium">Selo Verificado</p>
                <p className="text-sm text-[#B8A890]">Ganhe credibilidade nos seus anúncios</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Recursos Premium</p>
                <p className="text-sm text-[#B8A890]">Destaques, impulsionamentos e mais</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Segurança</p>
                <p className="text-sm text-[#B8A890]">Proteja sua conta e seus dados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wizard Component */}
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg p-8">
          <VerificationWizard />
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[#B8A890] flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div className="text-sm text-[#B8A890]">
              <p className="font-medium mb-1">🔒 Seus dados estão seguros</p>
              <p>
                Todas as informações são criptografadas e armazenadas com segurança. Não compartilhamos seus dados pessoais com terceiros.{' '}
                <a href="/privacidade" className="text-[#6B7F5C] hover:text-[#7A8F6B] font-medium">
                  Política de Privacidade
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#C9A87C] mb-4">
            Perguntas Frequentes
          </h3>
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-[#D4C4A8] font-medium">
                Por que preciso verificar minha identidade?
                <svg className="w-5 h-5 text-[#B8A890] group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 text-[#B8A890] text-sm">
                A verificação de identidade garante a segurança de todos os usuários da plataforma, previne fraudes e aumenta a confiança nas transações.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-[#D4C4A8] font-medium">
                Quanto tempo leva o processo?
                <svg className="w-5 h-5 text-[#B8A890] group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 text-[#B8A890] text-sm">
                Na maioria dos casos, a verificação é automática e leva apenas alguns minutos. Casos que exigem revisão manual podem levar até 24 horas.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-[#D4C4A8] font-medium">
                Quais documentos são aceitos?
                <svg className="w-5 h-5 text-[#B8A890] group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 text-[#B8A890] text-sm">
                Aceitamos RG, CNH, Passaporte ou CPF com foto. O documento deve estar dentro da validade e com foto visível.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-[#D4C4A8] font-medium">
                Meus dados ficam seguros?
                <svg className="w-5 h-5 text-[#B8A890] group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 text-[#B8A890] text-sm">
                Sim! Usamos criptografia de ponta a ponta e seguimos rigorosos padrões de segurança. Seus documentos são armazenados em servidores seguros e nunca são compartilhados.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

