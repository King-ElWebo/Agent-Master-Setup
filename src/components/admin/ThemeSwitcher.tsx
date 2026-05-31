'use client';

import React, { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Read theme state on client mount
  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 border border-neutral-400 dark:border-brand-100/10 rounded-premium-sm bg-white dark:bg-brand-100/[0.02]" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle visual theme"
      className="w-9 h-9 flex items-center justify-center border border-neutral-450 hover:border-black dark:border-brand-100/10 bg-white dark:bg-brand-100/5 dark:hover:border-white/30 rounded-premium-sm transition-[border-color,background-color,transform] duration-[100ms] ease-out active:scale-[0.93] cursor-pointer group select-none relative overflow-hidden"
    >
      <div className="w-4 h-4 relative">
        {/* Sun Icon (shown in Light Mode) */}
        <svg
          className={`absolute inset-0 w-4 h-4 text-black dark:text-brand-100 transition-[transform,opacity] duration-[200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
            isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.0}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>

        {/* Moon Icon (shown in Dark Mode) */}
        <svg
          className={`absolute inset-0 w-4 h-4 text-black dark:text-brand-100 transition-[transform,opacity] duration-[200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
            isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.0}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
    </button>
  );
}
