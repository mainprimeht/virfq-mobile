import { translations, Locale, TranslationKey } from './translations';

let currentLocale: Locale = 'vi';

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const translation = translations[currentLocale][key] || translations.vi[key] || key;
  
  if (!params) return translation;
  
  return Object.entries(params).reduce((result, [param, value]) => {
    return result.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
  }, translation);
}

export { translations };
export type { Locale, TranslationKey };
