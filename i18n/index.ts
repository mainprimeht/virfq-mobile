import { create } from 'zustand';
import { vi, en, type Translations } from './translations';

type Locale = 'vi' | 'en';

interface I18nState {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const translations: Record<Locale, Translations> = { vi, en };

export const useI18n = create<I18nState>((set) => ({
  locale: 'vi',
  t: vi,
  setLocale: (locale: Locale) => {
    set({ locale, t: translations[locale] });
  },
}));

export { vi, en };
export type { Translations };
