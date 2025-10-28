import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl shadow-md bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}
