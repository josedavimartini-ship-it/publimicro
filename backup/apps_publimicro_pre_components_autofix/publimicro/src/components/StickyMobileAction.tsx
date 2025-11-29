"use client";

import { ReactNode } from "react";

interface StickyMobileActionProps {
  children: ReactNode;
  position?: "bottom" | "top";
  hideOnDesktop?: boolean;
  className?: string;
}

/**
 * Sticky Action Button Bar for Mobile
 * 
 * Features:
 * - Fixed position on mobile
 * - Auto-hides on desktop (optional)
 * - Safe area padding (notch support)
 * - Smooth shadow effect
 * - Z-index management
 * 
 * @example
 * <StickyMobileAction>
 *   <button>Contact Owner</button>
 *   <button>Schedule Visit</button>
 * </StickyMobileAction>
 */
export default function StickyMobileAction({
  children,
  position = "bottom",
  hideOnDesktop = true,
  className = "",
}: StickyMobileActionProps) {
  const positionClasses =
    position === "bottom"
      ? "bottom-0 pb-safe"
      : "top-0 pt-safe";

  const hideClass = hideOnDesktop ? "md:hidden" : "";

  return (
    <div
      className={`fixed left-0 right-0 z-50 ${positionClasses} ${hideClass} ${className}`}
    >
      {/* Shadow gradient */}
      {position === "bottom" && (
        <div className="absolute bottom-full left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      )}
      {position === "top" && (
        <div className="absolute top-full left-0 right-0 h-8 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      )}

      {/* Content Container */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-t border-[#2a2a1a] backdrop-blur-lg">
        <div className="px-4 py-3 flex gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Pre-built Primary Action Button
 * Optimized for common use cases
 */
interface ActionButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
}

export function ActionButton({
  onClick,
  children,
  variant = "primary",
  icon,
  fullWidth = true,
  disabled = false,
}: ActionButtonProps) {
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white hover:from-[#8B9B6E] hover:to-[#0A5F62] disabled:from-[#3a3a3a] disabled:to-[#2a2a2a] disabled:text-[#676767]",
    secondary:
      "bg-gradient-to-r from-[#E6C98B] to-[#B7791F] text-[#0a0a0a] hover:from-[#D4A574] hover:to-[#A6681E] disabled:from-[#3a3a3a] disabled:to-[#2a2a2a] disabled:text-[#676767]",
    outline:
      "border-2 border-[#A8C97F] text-[#A8C97F] hover:bg-[#A8C97F]/10 disabled:border-[#3a3a3a] disabled:text-[#676767]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${fullWidth ? "flex-1" : ""}
        px-6 py-4 rounded-xl font-bold text-base
        transition-all duration-200
        hover:scale-105 active:scale-95
        disabled:cursor-not-allowed disabled:hover:scale-100
        focus:outline-none focus:ring-4 focus:ring-[#A8C97F]/30
        flex items-center justify-center gap-2
        ${variantClasses[variant]}
      `}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
}
