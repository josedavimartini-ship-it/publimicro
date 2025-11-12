"use client";
import React, { createContext, useContext } from 'react';

type TabsContextValue = {
	value: string;
	onValueChange?: (v: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ value, onValueChange, children, className }: { value: string; onValueChange?: (v: string) => void; children: React.ReactNode; className?: string }) {
	return (
		<TabsContext.Provider value={{ value, onValueChange }}>
			<div className={className}>{children}</div>
		</TabsContext.Provider>
	);
}

export function Tab({ value, label, children }: { value: string; label?: React.ReactNode; children?: React.ReactNode }) {
	const ctx = useContext(TabsContext);
	if (!ctx) return null;
	const isActive = ctx.value === value;
	// Render label area: simple accessible button that switches tab
	return (
		<div className="w-full">
			<button
				type="button"
				onClick={() => ctx.onValueChange?.(value)}
				aria-pressed={isActive}
				className={`px-4 py-2 ${isActive ? 'font-bold' : 'text-muted'}`}
			>
				{label}
			</button>
			{isActive && <div className="mt-4">{children}</div>}
		</div>
	);
}

export default Tabs;
