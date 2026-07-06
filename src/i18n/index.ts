export type Locale = 'en' | 'pt' | 'es' | 'ar' | 'zh';

const BASE_URL = 'https://chitek.com';

const LOCALE_PREFIXES: Record<Locale, string> = {
  zh: '',
  en: '/en',
  es: '/es',
  ar: '/ar',
  pt: '/pt',
};

/** Detect locale and base path from a pathname */
function parsePathname(pathname: string): { locale: Locale; base: string } {
  for (const [code, prefix] of Object.entries(LOCALE_PREFIXES) as [Locale, string][]) {
    if (prefix && pathname.startsWith(prefix + '/') || pathname === prefix) {
      const base = pathname.slice(prefix.length) || '/';
      return { locale: code, base };
    }
  }
  return { locale: 'zh', base: pathname || '/' };
}

/** Get the alternative locale URL for the current page */
export function getAltHref(pathname: string, targetLang: Locale): string {
  const { base } = parsePathname(pathname);
  const prefix = LOCALE_PREFIXES[targetLang];
  if (targetLang === 'zh') return base;
  return prefix + (base === '/' ? '' : base);
}

/** Build alternate-language link for SEO hreflang */
export function getHreflang(lang: Locale, pathname: string): string {
  const { base } = parsePathname(pathname);
  const prefix = LOCALE_PREFIXES[lang];
  const path = lang === 'zh' ? base : prefix + (base === '/' ? '' : base);
  return `${BASE_URL}${path}`;
}
