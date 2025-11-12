"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { WhatsAppLink } from "@publimicro/ui";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#B7791F]/40 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-[#B7791F]/20 rounded-full">
                <AlertTriangle className="w-16 h-16 text-[#B7791F]" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-[#E6C98B] mb-4">
              Ops! Algo deu errado
            </h1>

            <p className="text-[#8B9B6E] mb-6 leading-relaxed">
              Encontramos um problema inesperado. Não se preocupe, nossos dados
              estão seguros e nossa equipe foi notificada.
            </p>

            {this.state.error && process.env.NODE_ENV === "development" && (
              <div className="mb-6 p-4 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-left">
                <p className="text-xs font-mono text-red-400 mb-2">
                  {this.state.error.message}
                </p>
                <p className="text-xs font-mono text-[#676767] overflow-auto max-h-40">
                  {this.state.error.stack}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white font-bold rounded-full hover:from-[#0D7377] hover:to-[#A8C97F] transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Recarregar Página
              </button>

              <a
                href="/"
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#E6C98B] text-[#E6C98B] font-bold rounded-full hover:bg-[#E6C98B]/10 transition-all"
              >
                <Home className="w-5 h-5" />
                Voltar ao Início
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-[#2a2a1a]">
              <p className="text-sm text-[#676767]">
                Precisa de ajuda?{" "}
                <WhatsAppLink
                  number="5534992610004"
                  className="text-[#A8C97F] hover:underline"
                  aria-label="Entre em contato pelo WhatsApp"
                >
                  Entre em contato conosco
                </WhatsAppLink>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple wrapper component for easy use
export default function ErrorBoundaryWrapper({
  children,
  fallback,
}: ErrorBoundaryProps) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
