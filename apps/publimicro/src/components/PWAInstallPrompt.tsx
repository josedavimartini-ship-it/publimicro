"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if prompt was dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSince = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        return; // Don't show again for 7 days
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 10 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 10000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome: _outcome } = await deferredPrompt.userChoice;
    
    // console.log(`PWA install ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-slide-up">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#A8C97F] rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#6B7F5C]/20 rounded-xl flex-shrink-0">
            <Download className="w-6 h-6 text-[#6B7F5C]" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[#C9A87C] font-bold text-lg mb-2">
              Instalar PubliMicro
            </h3>
            <p className="text-[#8B9B6E] text-sm mb-4">
              Instale nosso app para acesso rápido, notificações de lances e uso offline!
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] text-[#D4C4A8] font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-[#B8A890] hover:text-[#C9A87C] transition-colors"
              >
                Agora não
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-[#B8A890] hover:text-[#C9A87C] transition-colors flex-shrink-0"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Add to globals.css:
// @keyframes slide-up {
//   from {
//     transform: translateY(100%);
//     opacity: 0;
//   }
//   to {
//     transform: translateY(0);
//     opacity: 1;
//   }
// }
// .animate-slide-up {
//   animation: slide-up 0.3s ease-out;
// }






















