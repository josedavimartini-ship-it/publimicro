import React from "react";
import clsx from "clsx";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  hideLabel?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

export function Input({ 
  label,
  error, 
  helperText,
  size = "md",
  fullWidth = false,
  hideLabel = false,
  leftIcon,
  rightIcon,
  onRightIconClick,
  id,
  className = "",
  required,
  disabled,
  type = "text",
  ...props 
}: InputProps) {
  // Generate unique ID if not provided
  const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-') || Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  // Size variants
  const sizes = {
    sm: "py-2 text-sm min-h-[40px]",
    md: "py-3 text-base min-h-[48px]",
    lg: "py-4 text-lg min-h-[56px]",
  };

  // Calculate aria-describedby
  const describedBy = [
    error ? errorId : null,
    helperText && !error ? helperId : null,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx("relative", fullWidth && "w-full")}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId} 
          className={clsx(
            "block text-sm font-medium text-[#D4A574] mb-2",
            hideLabel && "sr-only"
          )}
        >
          {label}
          {required && (
            <span className="text-red-400 ml-1" aria-hidden="true">*</span>
          )}
          {required && (
            <span className="sr-only"> (obrigatório)</span>
          )}
        </label>
      )}
      
      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
            aria-hidden="true"
          >
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          disabled={disabled}
          required={required}
          className={clsx(
            // Base styles
            "w-full bg-[#1a1a1a] border rounded-lg text-[#E6C98B]",
            "placeholder-[#9ca3af]", // Accessible placeholder (5.3:1 contrast)
            // Padding based on icons
            leftIcon ? "pl-10" : "pl-4",
            rightIcon ? "pr-10" : "pr-4",
            // Focus states (WCAG 2.4.7)
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
            // Error state
            error ? "border-red-500 focus-visible:ring-red-400" : "border-[#3a3a3a]",
            // Hover state
            !disabled && "hover:border-[#4a4a4a]",
            // Disabled state
            disabled && "opacity-50 cursor-not-allowed bg-[#151515]",
            // Size
            sizes[size],
            // Custom classes
            className
          )}
          {...props}
        />
        
        {/* Right icon / button */}
        {rightIcon && (
          onRightIconClick ? (
            <button
              type="button"
              onClick={onRightIconClick}
              disabled={disabled}
              className={clsx(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "p-1 rounded-md",
                "text-[#9ca3af] hover:text-[#D4A574]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]",
                "transition-colors",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              aria-label="Ação do campo"
            >
              {rightIcon}
            </button>
          ) : (
            <div 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p 
          id={errorId} 
          className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5" 
          role="alert"
          aria-live="polite"
        >
          <svg 
            className="w-4 h-4 flex-shrink-0" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
      
      {/* Helper text */}
      {helperText && !error && (
        <p 
          id={helperId} 
          className="mt-1.5 text-sm text-[#9ca3af]"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

// Password input with visibility toggle
export function PasswordInput(props: Omit<InputProps, 'type' | 'rightIcon' | 'onRightIconClick'>) {
  const [showPassword, setShowPassword] = React.useState(false);
  
  return (
    <Input
      {...props}
      type={showPassword ? "text" : "password"}
      rightIcon={
        showPassword ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )
      }
      onRightIconClick={() => setShowPassword(!showPassword)}
    />
  );
}
