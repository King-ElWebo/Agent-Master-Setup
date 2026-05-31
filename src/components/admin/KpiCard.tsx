import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  status?: 'normal' | 'active';
}

export function KpiCard({ title, value, status = 'normal' }: KpiCardProps) {
  return (
    <div className="p-8 border border-neutral-300 dark:border-brand-100/10 bg-white dark:bg-brand-950 hover:border-neutral-400 dark:hover:border-brand-100/30 shadow-sm transition-colors duration-[200ms] ease-out group rounded-premium-sm">
      <h3 className="text-xs tracking-[0.2em] uppercase text-neutral-700 dark:text-brand-100/50 mb-6 group-hover:text-black dark:group-hover:text-brand-100/80 transition-colors duration-[200ms] ease-out font-bold select-none">{title}</h3>
      <div className="flex items-center space-x-4">
        <span className="text-4xl font-light tracking-tight text-black dark:text-brand-100">{value}</span>
        {status === 'active' && (
          <div className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.15)] dark:shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-[background-color,box-shadow] duration-200" />
        )}
      </div>
    </div>
  );
}
