'use client';

import React, { useState, useEffect } from 'react';
import { SettingsGrid, SettingsData } from '@/components/admin/SettingsGrid';
import { useTranslation } from '@/hooks/useTranslation';

const INITIAL_SETTINGS: SettingsData = {
  metaTitle: 'Veloce System Architecture',
  metaDescription: 'High-performance global administrative dashboard and content management infrastructure.',
  seoKeywords: 'admin, dashboard, architecture, minimal',
  corporateEmail: 'sysadmin@veloce-core.io',
  phoneNumber: '+1 (800) 555-0199',
  openHours: 'Mon-Fri, 09:00 - 18:00 UTC',
  physicalAddress: '100 Core Data Drive\nServer Rack A\nSan Francisco, CA 94105',
  logoUrl: '/brand/veloce-logo-light.svg',
  twitterUrl: 'https://twitter.com/velocecore',
  linkedInUrl: 'https://linkedin.com/company/velocecore',
};

export default function SettingsPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<SettingsData>(INITIAL_SETTINGS);
  const [dbSettings, setDbSettings] = useState<SettingsData>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Map list to SettingsData object
            const mapped: Partial<SettingsData> = {};
            data.forEach((s: { key: string; value: string }) => {
              if (s.key in INITIAL_SETTINGS) {
                mapped[s.key as keyof SettingsData] = s.value;
              }
            });
            const merged = { ...INITIAL_SETTINGS, ...mapped };
            setSettings(merged);
            setDbSettings(merged);
          }
        }
      } catch (err) {
        console.error('Fetch Settings Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (id: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSaving(true);

    try {
      // Build transactional payload
      const payload = {
        settings: Object.entries(settings).map(([key, value]) => ({
          key,
          value,
          description: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
        })),
      };

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save settings');
      }

      setDbSettings(settings);
      setSuccessMsg(t('settings.successSync'));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(dbSettings);

  return (
    <div className="pb-40 select-none">
      {/* Header */}
      <div className="mb-12 flex justify-between items-end border-b border-neutral-300 dark:border-brand-100/10 pb-8 transition-colors duration-200">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-black dark:text-brand-100 mb-2 transition-colors duration-200">{t('settings.title')}</h1>
          <p className="text-sm tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 uppercase transition-colors duration-200 font-bold">{t('settings.subtitle')}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-950/10 dark:bg-red-950/40 border border-red-500/30 text-red-700 dark:text-red-400 text-xs p-4 mb-8 uppercase tracking-wider transition-colors duration-200 rounded font-semibold">
          Sync Error: {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-neutral-900 border border-neutral-900 dark:bg-white/5 dark:border-white/20 text-white dark:text-brand-100 text-xs p-4 mb-8 uppercase tracking-wider animate-pulse shadow rounded font-bold transition-colors duration-200">
          {successMsg}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          {[1, 2].map((s) => (
            <div key={s} className="border border-neutral-300 dark:border-brand-100/10 p-8 space-y-6 bg-white dark:bg-brand-950 transition-colors duration-200 rounded-premium-sm shadow-sm">
              <div className="h-4 bg-neutral-300 dark:bg-brand-100/15 w-1/4"></div>
              <div className="grid grid-cols-2 gap-8">
                <div className="h-10 bg-neutral-300 dark:bg-brand-100/5"></div>
                <div className="h-10 bg-neutral-300 dark:bg-brand-100/5"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SettingsGrid data={settings} onChange={handleChange} />
      )}

      {/* Fixed Action Bar */}
      <div className={`fixed bottom-0 left-72 right-0 bg-white/95 dark:bg-brand-950/95 backdrop-blur-md border-t border-neutral-300 dark:border-brand-100/10 py-6 px-12 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.02)] transition-[opacity,transform,background-color,border-color] duration-[150ms] ease-out ${
        hasUnsavedChanges ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-0'
      }`}>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full transition-[background-color,box-shadow] duration-[100ms] ${
              hasUnsavedChanges 
                ? 'bg-neutral-900 dark:bg-white animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.15)] dark:shadow-[0_0_10px_rgba(255,255,255,0.4)]' 
                : 'bg-neutral-400 dark:bg-white/40'
            }`}></div>
            <span className="text-xs text-neutral-700 dark:text-brand-100/50 tracking-[0.1em] uppercase transition-colors duration-200 font-bold">
              {hasUnsavedChanges ? t('settings.unsavedChanges') : t('settings.synced')}
            </span>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`px-8 py-4 text-xs tracking-[0.15em] uppercase font-bold transition-[background-color,color,transform] duration-[100ms] ease-out border-none shadow-sm rounded ${
              hasUnsavedChanges
                ? 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-brand-100 dark:text-brand-950 dark:hover:bg-white active:scale-[0.97] cursor-pointer'
                : 'bg-neutral-100 text-neutral-500 border border-neutral-300 dark:bg-brand-100/5 dark:text-brand-100/30 dark:border-brand-100/10 cursor-not-allowed'
            }`}
          >
            {isSaving ? t('settings.saving') : t('settings.saveButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
