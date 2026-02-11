import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Locale } from '../types/locale';

const LOCALE_STORAGE_KEY = 'rio-ai-locale';
const PAGE_TITLES: Record<Locale, string> = {
  'pt-BR': 'IPLANRIO - Família de Modelos Rio 2.0',
  'en-US': 'IPLANRIO - Rio AI Model Family',
};

const isLocale = (value: string): value is Locale => value === 'pt-BR' || value === 'en-US';

const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') {
    return 'pt-BR';
  }

  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (savedLocale && isLocale(savedLocale)) {
    return savedLocale;
  }

  return window.navigator.language.toLowerCase().startsWith('en') ? 'en-US' : 'pt-BR';
};

interface LocaleContextValue {
  locale: Locale;
  isEnglish: boolean;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => getInitialLocale());

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = PAGE_TITLES[locale];
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      isEnglish: locale === 'en-US',
      toggleLocale: () => setLocale((prev) => (prev === 'pt-BR' ? 'en-US' : 'pt-BR')),
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};
