"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import { componentPresets, textShadowStyles } from "../darkTheme";

// ============================================
// Typography Components
// ============================================

interface HeadingProps {
  children: ReactNode;
  className?: string;
  raised?: boolean;
}

export function H1({ children, className = "", raised = true }: HeadingProps) {
  return (
    <h1
      className={`${componentPresets.h1} ${className}`}
      style={raised ? textShadowStyles.raised : undefined}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className = "", raised = true }: HeadingProps) {
  return (
    <h2
      className={`${componentPresets.h2} ${className}`}
      style={raised ? textShadowStyles.raised : undefined}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className = "", raised = false }: HeadingProps) {
  return (
    <h3
      className={`${componentPresets.h3} ${className}`}
      style={raised ? textShadowStyles.raised : undefined}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className = "", raised = false }: HeadingProps) {
  return (
    <h4
      className={`${componentPresets.h4} ${className}`}
      style={raised ? textShadowStyles.raised : undefined}
    >
      {children}
    </h4>
  );
}

// ============================================
// Button Components
// ============================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
  className?: string;
}

export function DarkButton({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: componentPresets.buttonPrimary,
    secondary: componentPresets.buttonSecondary,
    ghost: componentPresets.buttonGhost,
  };

  return (
    <button
      className={`${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ============================================
// Card Components
// ============================================

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function DarkCard({ children, className = "", hoverable = false, onClick }: CardProps) {
  return (
    <div
      className={`${componentPresets.section} ${hoverable ? "hover:border-[#4a4a4a] hover:shadow-xl transition-all cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export function DarkModal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm`}>
      <div className={`bg-[#1b1b1b] border border-[#3a3a3a] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`}>
        {children}
      </div>
    </div>
  );
}

// ============================================
// Form Components
// ============================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function DarkInput({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className={componentPresets.formField}>
      {label && <label className={componentPresets.label}>{label}</label>}
      <input
        className={`${componentPresets.inputField} ${error ? "border-[#c86f4f]" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-[#c86f4f] text-sm mt-1">{error}</p>}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function DarkTextarea({ label, error, className = "", ...props }: TextAreaProps) {
  return (
    <div className={componentPresets.formField}>
      {label && <label className={componentPresets.label}>{label}</label>}
      <textarea
        className={`${componentPresets.inputField} ${error ? "border-[#c86f4f]" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-[#c86f4f] text-sm mt-1">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function DarkSelect({ label, error, options, className = "", ...props }: SelectProps) {
  return (
    <div className={componentPresets.formField}>
      {label && <label className={componentPresets.label}>{label}</label>}
      <select
        className={`${componentPresets.inputField} ${error ? "border-[#c86f4f]" : ""} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[#c86f4f] text-sm mt-1">{error}</p>}
    </div>
  );
}

// ============================================
// Badge/Status Components
// ============================================

interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "error" | "info";
  className?: string;
}

export function DarkBadge({ children, variant = "info", className = "" }: BadgeProps) {
  const variantClasses = {
    success: componentPresets.badgeSuccess,
    warning: componentPresets.badgeWarning,
    error: componentPresets.badgeError,
    info: componentPresets.badgeInfo,
  };

  return (
    <span className={`${componentPresets.badge} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ============================================
// Loading Spinner
// ============================================

export function DarkSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`${componentPresets.spinner} ${className}`} aria-label="Loading" />
  );
}

// ============================================
// Link Component
// ============================================

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  subtle?: boolean;
}

export function DarkLink({ children, subtle = false, className = "", ...props }: LinkProps) {
  return (
    <a
      className={`${subtle ? componentPresets.linkSubtle : componentPresets.link} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
