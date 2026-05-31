'use client';

import React, { createContext, useState, useEffect } from 'react';
import en from '@/dictionaries/en.json';
import de from '@/dictionaries/de.json';

export type Language = 'en' | 'de';

const dictionaries = {
  en,
  de,
};

interface TranslationContextType {
  t: (key: string) => string;
  lang: Language;
  setLanguage: (lang: Language) => void;
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved === 'en' || saved === 'de') {
      setLangState(saved);
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('language', newLang);
  };

  // Recursive nested path resolver for dictionary keys
  const t = (key: string): string => {
    const dictionary = dictionaries[lang] as any;
    const parts = key.split('.');
    let current = dictionary;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return key;
      }
    }

    if (typeof current === 'string') {
      return current;
    }
    return key;
  };

  return (
    <TranslationContext.Provider value={{ t, lang, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}
