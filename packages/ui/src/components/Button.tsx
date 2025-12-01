import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props 
}: ButtonProps) {
  // Base styles with accessibility focus states
  const base = clsx(
    "inline-flex items-center justify-center font-medium transition-all",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "min-h-[44px]" // WCAG 2.5.5 touch target size
  );
  
  // Variant styles with proper contrast
  const variants = {
    primary: clsx(
      "bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] text-[#0a0a0a]",
      "hover:from-[#E6C98B] hover:to-[#D4AF37]",
      "focus-visible:ring-[#D4AF37]",
      "active:scale-[0.98]"
    ),
    secondary: clsx(
      "bg-gradient-to-r from-[#6B7F5C] to-[#8B9B6E] text-white",
      "hover:from-[#7A8F6B] hover:to-[#9BAB7E]",
      "focus-visible:ring-[#8B9B6E]",
      "active:scale-[0.98]"
    ),
    outline: clsx(
      "border-2 border-[#D4A574] text-[#D4A574] bg-transparent",
      "hover:bg-[#D4A574]/10",
      "focus-visible:ring-[#D4A574]"
    ),
    ghost: clsx(
      "text-[#D4A574] bg-transparent",
      "hover:bg-[#D4A574]/10",
      "focus-visible:ring-[#D4A574]"
    ),
    danger: clsx(
      "bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white",
      "hover:from-[#ef4444] hover:to-[#dc2626]",
      "focus-visible:ring-red-500",
      "active:scale-[0.98]"
    ),
  };

  // Size styles
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-base rounded-xl gap-2",
    lg: "px-6 py-3.5 text-lg rounded-xl gap-2.5",
  };

  return (
    <button 
      className={clsx(base, variants[variant], sizes[size], className)} 
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="sr-only">Carregando...</span>
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
          {children}
          {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
