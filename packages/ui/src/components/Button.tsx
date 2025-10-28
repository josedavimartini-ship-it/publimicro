import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  children: React.ReactNode;
}

export function Button({ children, variant = "default", ...props }: ButtonProps) {
  const base = "px-4 py-2 rounded-md font-medium transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100"
  };

  return (
    <button className={clsx(base, variants[variant])} {...props}>
      {children}
    </button>
  );
}
