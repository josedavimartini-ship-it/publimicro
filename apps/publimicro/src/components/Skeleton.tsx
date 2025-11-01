import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular" | "card";
  width?: string;
  height?: string;
  count?: number;
}

export function Skeleton({ 
  className = "", 
  variant = "rectangular",
  width,
  height,
  count = 1 
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-[#2a2a1a]";
  
  const variantClasses = {
    text: "h-4 rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
    card: "rounded-2xl"
  };

  const style = {
    width: width || undefined,
    height: height || undefined
  };

  const skeletonElement = (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={className}>
          {skeletonElement}
        </div>
      ))}
    </>
  );
}

// Preset skeleton patterns
export function PropertyCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden animate-pulse">
      <Skeleton variant="rectangular" className="w-full h-64" />
      <div className="p-6 space-y-3">
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-1/2 h-4" />
        <Skeleton variant="text" className="w-2/3 h-4" />
        <div className="flex items-center justify-between mt-4">
          <Skeleton variant="text" className="w-1/3 h-8" />
          <Skeleton variant="circular" className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-xl p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-1/2 h-4" />
          <Skeleton variant="text" className="w-3/4 h-8" />
        </div>
        <Skeleton variant="circular" className="w-12 h-12" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b border-[#2a2a1a]">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton variant="text" className="w-full" />
        </td>
      ))}
    </tr>
  );
}

export function MapSkeleton() {
  return (
    <div className="w-full h-[600px] bg-[#1a1a1a] rounded-2xl flex items-center justify-center animate-pulse">
      <div className="text-center">
        <Skeleton variant="circular" className="w-16 h-16 mx-auto mb-4" />
        <Skeleton variant="text" className="w-48 h-6 mx-auto" />
      </div>
    </div>
  );
}
