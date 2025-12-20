'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabaseBrowser';

interface VerificationStatus {
  verified: boolean;
  status: 'not_started' | 'pending' | 'manual_review' | 'approved' | 'rejected';
  loading: boolean;
}

export function useVerificationStatus(): VerificationStatus {
  const [status, setStatus] = useState<VerificationStatus>({
    verified: false,
    status: 'not_started',
    loading: true,
  });

  const supabase = createBrowserSupabaseClient();

  const checkVerification = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setStatus({ verified: false, status: 'not_started', loading: false });
        return;
      }

      const response = await fetch('/api/verification/status');
      const data = await response.json();

      setStatus({
        verified: data.verified || false,
        status: data.verification?.status || 'not_started',
        loading: false,
      });
    } catch (error) {
      console.error('Error checking verification:', error);
      setStatus({ verified: false, status: 'not_started', loading: false });
    }
  }, [supabase]);

  useEffect(() => {
    void checkVerification();
  }, [checkVerification]);

  return status;
}

interface VerificationGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireVerification?: boolean;
}

export function VerificationGate({
  children,
  fallback,
  requireVerification = true,
}: VerificationGateProps) {
  const { verified, status, loading } = useVerificationStatus();


  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: 'var(--text-accent)' }} />
      </div>
    );
  }

  if (!requireVerification) {
    return <>{children}</>;
  }

  if (!verified) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return <VerificationRequired status={status} />;
  }

  return <>{children}</>;
}

function VerificationRequired({ status }: { status: string }) {
  const router = useRouter();

  const statusConfig = {
    not_started: {
      icon: '🔐',
      title: 'Verificação Necessária',
      description: 'Para acessar recursos premium, você precisa verificar sua identidade.',
      buttonText: 'Iniciar Verificação',
      buttonAction: () => router.push('/verificacao'),
    },
    pending: {
      icon: '⏳',
      title: 'Verificação em Andamento',
      description: 'Sua verificação está sendo processada. Isso pode levar alguns minutos.',
      buttonText: 'Ver Status',
      buttonAction: () => router.push('/verificacao'),
    },
    manual_review: {
      icon: '👀',
      title: 'Verificação em Análise',
      description: 'Seus documentos estão sendo revisados por nossa equipe. Você receberá uma resposta em até 24 horas.',
      buttonText: 'Ver Detalhes',
      buttonAction: () => router.push('/verificacao'),
    },
    rejected: {
      icon: '❌',
      title: 'Verificação Não Aprovada',
      description: 'Sua verificação não foi aprovada. Revise seus documentos e tente novamente.',
      buttonText: 'Tentar Novamente',
      buttonAction: () => router.push('/verificacao'),
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;

  return (
    <div className="bg-card border rounded-lg p-8 text-center" style={{ borderColor: 'var(--border-default)' }}>
      <div className="text-6xl mb-4">{config.icon}</div>
      <h3 className="text-2xl font-bold text-heading mb-2">
        {config.title}
      </h3>
      <p className="text-warm mb-6 max-w-md mx-auto">
        {config.description}
      </p>
      <button
        onClick={config.buttonAction}
        className="btn-primary inline-flex items-center gap-2"
      >
        {config.buttonText}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      <div className="mt-6 pt-6 border-t" style={{ borderTopColor: 'var(--border-subtle)' }}>
        <p className="text-sm text-warm">
          💡 <strong>Por que precisamos verificar?</strong> A verificação garante segurança para todos os usuários e previne fraudes na plataforma.
        </p>
      </div>
    </div>
  );
}

interface VerificationBadgeProps {
  status: 'approved' | 'pending' | 'rejected' | 'not_started';
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({ status, size = 'md' }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const statusConfig = {
    approved: {
      icon: '✓',
      label: 'Verificado',
      className: 'bg-card text-warm',
      style: { borderColor: 'var(--color-success)' },
    },
    pending: {
      icon: '⏳',
      label: 'Aguardando',
      className: 'bg-card text-warm',
      style: { borderColor: 'var(--color-warning)' },
    },
    rejected: {
      icon: '✗',
      label: 'Rejeitado',
      className: 'bg-card text-warm',
      style: { borderColor: 'var(--color-error)' },
    },
    not_started: {
      icon: '○',
      label: 'Não Verificado',
      className: 'bg-card text-warm',
      style: { borderColor: 'var(--border-subtle)' },
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${config.className}`} style={config.style}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}



