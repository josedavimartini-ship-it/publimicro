"use client";

import { useState, useEffect, useRef } from "react";
import { X, Home, Search, Map, TrendingUp, Heart, CheckCircle } from "lucide-react";
import Link from "next/link";
import FocusLock from "react-focus-lock";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Check if user has seen the welcome modal
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    
    if (!hasSeenWelcome) {
      // Store currently focused element
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      // Show modal after 1 second delay
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenWelcome", "true");
    
    // Return focus to previously focused element
    if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      icon: <Home className="w-16 h-16 text-[#A8C97F]" />,
      title: "Bem-vindo ao PubliMicro! 🎉",
      description: "Sua plataforma completa para encontrar e negociar propriedades rurais e urbanas. Vamos fazer um tour rápido?",
      highlight: "Marketplace confiável desde 2024"
    },
    {
      icon: <Search className="w-16 h-16 text-[#D4A574]" />,
      title: "Busca Inteligente",
      description: "Use nossa busca avançada com filtros de preço, área, localização e muito mais. Encontre exatamente o que procura.",
      highlight: "Resultados instantâneos com autocomplete"
    },
    {
      icon: <Map className="w-16 h-16 text-[#8B9B6E]" />,
      title: "Explore por Categoria",
      description: "Navegue por PubliProper (imóveis), PubliMotors (veículos), PubliMachina (máquinas) e muito mais.",
      highlight: "8 categorias especializadas"
    },
    {
      icon: <TrendingUp className="w-16 h-16 text-[#6A1B9A]" />,
      title: "Sistema de Lances",
      description: "Faça lances em propriedades, acompanhe ofertas concorrentes e receba notificações em tempo real.",
      highlight: "Lances transparentes e seguros"
    },
    {
      icon: <Heart className="w-16 h-16 text-[#B7791F]" />,
      title: "Organize seus Favoritos",
      description: "Salve propriedades favoritas, compare até 3 ao mesmo tempo e organize em pastas personalizadas.",
      highlight: "Sincronizado em todos os dispositivos"
    },
    {
      icon: <CheckCircle className="w-16 h-16 text-[#8B9B6E]" />,
      title: "Pronto para Começar!",
      description: "Explore propriedades exclusivas, faça lances estratégicos e encontre seu próximo investimento.",
      highlight: "Suporte disponível via WhatsApp"
    }
  ];

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <FocusLock returnFocus>
        <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-3xl shadow-2xl animate-scale-in">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-[#959595] hover:text-[#A8C97F] transition-colors rounded-full hover:bg-[#2a2a1a]"
            aria-label="Fechar tour de boas-vindas"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#2a2a1a] rounded-full">
              {step.icon}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] to-[#B7791F] mb-4">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-[#8B9B6E] text-lg mb-4 leading-relaxed">
            {step.description}
          </p>

          {/* Highlight */}
          <div className="inline-block px-6 py-2 bg-[#B7791F]/20 border border-[#B7791F] rounded-full mb-8">
            <span className="text-[#E6C98B] font-semibold text-sm">
              ✨ {step.highlight}
            </span>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-[#A8C97F] w-8"
                    : index < currentStep
                    ? "bg-[#B7791F]"
                    : "bg-[#2a2a1a]"
                }`}
                aria-label={`Ir para passo ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-center">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border-2 border-[#E6C98B] text-[#E6C98B] font-semibold rounded-full hover:bg-[#E6C98B]/10 transition-all"
                aria-label="Voltar ao passo anterior"
              >
                Anterior
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg"
              aria-label={currentStep === steps.length - 1 ? "Finalizar tour" : "Ir para próximo passo"}
            >
              {currentStep === steps.length - 1 ? "Começar!" : "Próximo"}
            </button>

            {currentStep === 0 && (
              <button
                onClick={handleClose}
                className="px-6 py-3 text-[#959595] hover:text-[#E6C98B] font-semibold transition-colors"
                aria-label="Pular tour de boas-vindas"
              >
                Pular Tour
              </button>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-[#A8C97F]/10 rounded-full blur-3xl" />
        <div className="absolute -z-10 bottom-0 left-0 w-64 h-64 bg-[#0D7377]/10 rounded-full blur-3xl" />
      </div>
      </FocusLock>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
