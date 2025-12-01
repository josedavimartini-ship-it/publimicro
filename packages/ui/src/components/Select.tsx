import React from "react";
import clsx from "clsx";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  hideLabel?: boolean;
}

export function Select({ 
  label,
  options, 
  error, 
  helperText,
  size = "md",
  fullWidth = false,
  hideLabel = false,
  id,
  className = "",
  required,
  disabled,
  ...props 
}: SelectProps) {
  // Generate unique ID if not provided
  const selectId = id || `select-${label?.toLowerCase().replace(/\s/g, '-') || Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  // Size variants
  const sizes = {
    sm: "py-2 px-3 text-sm min-h-[40px]",
    md: "py-3 px-4 text-base min-h-[48px]",
    lg: "py-4 px-5 text-lg min-h-[56px]",
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
          htmlFor={selectId} 
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
      
      {/* Select wrapper */}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          disabled={disabled}
          required={required}
          className={clsx(
            // Base styles
            "w-full bg-[#1a1a1a] border rounded-lg text-[#E6C98B] appearance-none cursor-pointer",
            "pr-10", // Space for chevron icon
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
        >
          {options.map((opt) => (
            <option 
              key={opt.value} 
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Chevron icon */}
        <svg 
          className={clsx(
            "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none",
            error ? "text-red-400" : "text-[#9ca3af]"
          )}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
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
