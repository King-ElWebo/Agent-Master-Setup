'use client';

import React from 'react';
import { KpiCard } from '@/components/admin/KpiCard';
import { ActivityLogTable, ActivityLog } from '@/components/admin/ActivityLogTable';
import { useTranslation } from '@/hooks/useTranslation';

interface DashboardCockpitClientProps {
  activeItemsCount: number;
  activeFaqsCount: number;
  logs: ActivityLog[];
}

export function DashboardCockpitClient({ activeItemsCount, activeFaqsCount, logs }: DashboardCockpitClientProps) {
  const { t } = useTranslation();

  return (
    <>
      <header className="mb-12 select-none">
        <h1 className="text-3xl font-light tracking-tight text-black dark:text-brand-100 mb-2 transition-colors duration-200">
          {t('dashboard.title')}
        </h1>
        <p className="text-sm tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 uppercase transition-colors duration-200 font-bold">
          {t('dashboard.subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <KpiCard title={t('dashboard.kpiItems')} value={activeItemsCount} />
        <KpiCard title={t('dashboard.kpiFaqs')} value={activeFaqsCount} />
        <KpiCard title={t('dashboard.kpiInfra')} value="100%" status="active" />
      </div>

      <section>
        <h2 className="text-xs tracking-[0.2em] text-neutral-700 dark:text-brand-100/50 uppercase mb-6 font-bold select-none">
          {t('dashboard.activityLog')}
        </h2>
        <ActivityLogTable logs={logs} />
      </section>
    </>
  );
}
