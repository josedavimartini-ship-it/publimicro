"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showHandle?: boolean;
  maxHeight?: string;
  snapPoints?: number[];
  closeOnBackdropClick?: boolean;
}

/**
 * Mobile-optimized Bottom Sheet component
 * 
 * Features:
 * - Smooth slide-up animation
 * - Backdrop with blur effect
 * - Swipe-down to close gesture
 * - Scroll lock when open
 * - Accessible with keyboard support
 * - Portal rendering (renders at body level)
 * 
 * @example
 * <BottomSheet isOpen={open} onClose={() => setOpen(false)} title="Filters">
 *   <div>Your content here</div>
 * </BottomSheet>
 */
export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  showHandle = true,
  maxHeight = "90vh",
  closeOnBackdropClick = true,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  // Focus management - focus first interactive element when opened
  useEffect(() => {
    if (isOpen && sheetRef.current) {
      const focusableElements = sheetRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        setTimeout(() => firstElement.focus(), 100);
      }
    }
  }, [isOpen]);

  // Keyboard support - ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Touch gesture handlers for swipe-down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = 0;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;

    const currentY = e.touches[0].clientY;
    const diffY = currentY - startYRef.current;

    // Only allow dragging down, not up
    if (diffY > 0) {
      currentYRef.current = diffY;
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${diffY}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;

    // If dragged down more than 100px, close the sheet
    if (currentYRef.current > 100) {
      onClose();
    }

    // Reset transform
    if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }

    currentYRef.current = 0;
  };

  if (!isOpen) return null;

  const content = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-[101] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-t-3xl shadow-2xl animate-slide-up"
        style={{ maxHeight }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "bottom-sheet-title" : undefined}
      >
        {/* Drag Handle */}
        {showHandle && (
          <div
            className="pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-1.5 bg-[#3a3a3a] rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a1a]">
            <h2
              id="bottom-sheet-title"
              className="text-xl font-bold text-[#E6C98B]"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2a2a1a] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#A8C97F]"
              aria-label="Fechar"
            >
              <X className="w-6 h-6 text-[#8B9B6E]" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: "calc(90vh - 120px)" }}>
          <div className="px-6 py-6">{children}</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.32, 0.72, 0, 1);
        }
      `}</style>
    </>
  );

  // Use portal to render at body level (avoids z-index issues)
  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
