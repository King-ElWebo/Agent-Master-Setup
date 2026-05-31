'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  timestamp: string;
  user: string;
}

interface ActivityLogTableProps {
  logs: ActivityLog[];
}

export function ActivityLogTable({ logs }: ActivityLogTableProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full border border-neutral-300 dark:border-brand-100/10 bg-white dark:bg-brand-950 overflow-hidden transition-[background-color,border-color] duration-200 rounded-premium-sm shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-300 dark:border-brand-100/10 bg-neutral-100/50 dark:bg-brand-100/5 transition-colors duration-200">
            <th className="py-5 px-8 text-xs font-bold tracking-[0.15em] text-neutral-900 dark:text-brand-100/50 uppercase select-none">{t('table.action')}</th>
            <th className="py-5 px-8 text-xs font-bold tracking-[0.15em] text-neutral-900 dark:text-brand-100/50 uppercase select-none">{t('table.entity')}</th>
            <th className="py-5 px-8 text-xs font-bold tracking-[0.15em] text-neutral-900 dark:text-brand-100/50 uppercase select-none">{t('table.user')}</th>
            <th className="py-5 px-8 text-xs font-bold tracking-[0.15em] text-neutral-900 dark:text-brand-100/50 uppercase text-right select-none">{t('table.timestamp')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-300 dark:divide-brand-100/10 transition-colors duration-200">
          {logs.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-12 text-center text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                No activity logs available
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-100/30 dark:hover:bg-brand-100/5 transition-[background-color] duration-[100ms] ease-out">
                <td className="py-5 px-8 text-sm text-black dark:text-brand-100 font-semibold tracking-wide">{log.action}</td>
                <td className="py-5 px-8 text-sm text-neutral-800 dark:text-brand-100/70 font-medium">{log.entity}</td>
                <td className="py-5 px-8 text-sm text-neutral-800 dark:text-brand-100/70 font-medium">{log.user}</td>
                <td className="py-5 px-8 text-sm text-neutral-700 dark:text-brand-100/50 font-mono font-medium text-right">{log.timestamp}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
