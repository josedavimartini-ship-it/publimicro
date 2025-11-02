"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, TrendingUp } from "lucide-react";

type ToastType = "success" | "error" | "info" | "bid";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
  showBidNotification: (propertyName: string, amount: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(7);
      const newToast = { ...toast, id };
      
      setToasts((prev) => [...prev, newToast]);

      const duration = toast.duration || 5000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const showBidNotification = useCallback(
    (propertyName: string, amount: number) => {
      showToast({
        type: "bid",
        title: "Novo Lance!",
        message: `Lance de R$ ${amount.toLocaleString("pt-BR")} em ${propertyName}`,
        duration: 7000
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, showBidNotification }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onRemove
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-[#A8C97F]" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case "bid":
        return <TrendingUp className="w-5 h-5 text-[#B7791F]" />;
      default:
        return <Info className="w-5 h-5 text-[#E6C98B]" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-[#A8C97F]";
      case "error":
        return "border-red-400";
      case "bid":
        return "border-[#B7791F]";
      default:
        return "border-[#E6C98B]";
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`flex items-start gap-3 px-4 py-3 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] border-2 ${getBorderColor()} rounded-xl shadow-2xl backdrop-blur-md animate-slide-in-right`}
    >
      <div className="flex-shrink-0 mt-0.5" aria-hidden="true">{getIcon()}</div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-[#E6C98B] font-bold text-sm">{toast.title}</h4>
        {toast.message && (
          <p className="text-[#A8C97F] text-sm mt-1">{toast.message}</p>
        )}
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-[#959595] hover:text-[#E6C98B] transition-colors"
        aria-label="Fechar notificação"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

// Add to globals.css:
// @keyframes slide-in-right {
//   from {
//     transform: translateX(100%);
//     opacity: 0;
//   }
//   to {
//     transform: translateX(0);
//     opacity: 1;
//   }
// }
// .animate-slide-in-right {
//   animation: slide-in-right 0.3s ease-out;
// }
