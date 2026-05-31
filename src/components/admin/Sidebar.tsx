'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeSwitcher } from '@/components/admin/ThemeSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

export function Sidebar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { t, lang, setLanguage } = useTranslation();

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Logout request failed');
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error('Logout error occurred:', error);
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { label: t('sidebar.dashboard'), href: '/admin' },
    { label: t('sidebar.categories'), href: '/admin/categories' },
    { label: t('sidebar.items'), href: '/admin/items' },
    { label: t('sidebar.faqs'), href: '/admin/faqs' },
    { label: t('sidebar.settings'), href: '/admin/settings' },
  ];

  return (
    <aside className="w-72 fixed inset-y-0 left-0 border-r border-neutral-300 dark:border-brand-100/10 bg-neutral-50 dark:bg-brand-950 flex flex-col z-20 transition-[background-color,border-color] duration-200 select-none">
      <div className="p-8 border-b border-neutral-300 dark:border-brand-100/10 transition-colors duration-200">
        <h2 className="text-xs tracking-[0.3em] font-bold text-neutral-700 dark:text-brand-100/40 uppercase">{t('sidebar.core')}</h2>
      </div>
      
      <nav className="flex-1 py-8 flex flex-col space-y-2 px-4 overflow-y-auto">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className="px-6 py-4 text-sm tracking-wide font-bold text-neutral-800 dark:text-brand-100/70 hover:text-black dark:hover:text-brand-100 hover:bg-neutral-200 dark:hover:bg-brand-100/5 rounded-premium-sm transition-[color,background-color,transform] duration-[100ms] ease-out active:scale-[0.98]"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Persistent Bottom Action Panel */}
      <div className="p-4 border-t border-neutral-300 dark:border-brand-100/10 flex flex-col space-y-2 bg-neutral-100/30 dark:bg-brand-950/40 transition-colors duration-200">
        <div className="flex items-center justify-between space-x-2">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center py-2.5 text-[11px] tracking-[0.2em] font-bold uppercase text-neutral-800 dark:text-brand-100/70 hover:text-black dark:hover:text-brand-100 hover:bg-neutral-200 dark:hover:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 rounded-premium-sm transition-[color,background-color,transform] duration-[100ms] ease-out active:scale-[0.97] select-none"
          >
            {t('sidebar.viewSite')}
          </Link>

          {/* Sleek EN | DE Toggle Switcher */}
          <div className="flex items-center border border-neutral-450 dark:border-brand-100/10 bg-white dark:bg-brand-950 p-0.5 rounded-premium-sm">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-[9px] tracking-wider uppercase font-bold transition-[color,background-color,transform] duration-[100ms] ease-out active:scale-[0.97] cursor-pointer rounded ${
                lang === 'en'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                  : 'text-neutral-500 hover:text-black dark:text-brand-100/40 dark:hover:text-brand-100 hover:bg-neutral-100 dark:hover:bg-brand-100/5'
              }`}
            >
              EN
            </button>
            <span className="text-[9px] text-neutral-350 dark:text-brand-100/25 px-0.5 font-bold select-none">|</span>
            <button
              onClick={() => setLanguage('de')}
              className={`px-2 py-1 text-[9px] tracking-wider uppercase font-bold transition-[color,background-color,transform] duration-[100ms] ease-out active:scale-[0.97] cursor-pointer rounded ${
                lang === 'de'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                  : 'text-neutral-500 hover:text-black dark:text-brand-100/40 dark:hover:text-brand-100 hover:bg-neutral-100 dark:hover:bg-brand-100/5'
              }`}
            >
              DE
            </button>
          </div>

          <ThemeSwitcher />
        </div>
        <button
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center py-3 text-[11px] tracking-[0.2em] font-bold uppercase text-red-600 hover:bg-red-50 dark:text-red-400/80 dark:hover:text-red-400 dark:hover:bg-red-500/10 border border-red-500/30 dark:border-red-500/20 rounded-premium-sm transition-[color,background-color,transform] duration-[100ms] ease-out active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          {isLoggingOut ? 'Signing Out...' : t('sidebar.signOut')}
        </button>
      </div>

      <div className="p-8 border-t border-neutral-300 dark:border-brand-100/10 transition-colors duration-200">
        <div className="flex items-center space-x-4">
          <div className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.15)] dark:shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-[background-color,box-shadow] duration-200" />
          <span className="text-xs text-neutral-800 dark:text-brand-100/40 tracking-[0.2em] uppercase font-bold">{t('sidebar.operational')}</span>
        </div>
      </div>
    </aside>
  );
}
