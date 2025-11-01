import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  children: React.ReactNode;
}

export function Button({ children, variant = "default", ...props }: ButtonProps) {
  const base = "px-4 py-2 rounded-md font-medium transition";
  const variants = {
    default: "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] hover:from-[#FF8C42] hover:to-[#FF6B35]",
    outline: "border-2 border-[#D4A574] text-[#D4A574] hover:bg-[#D4A574]/10"
  };

  return (
    <button className={clsx(base, variants[variant])} {...props}>
      {children}
    </button>
  );
}
