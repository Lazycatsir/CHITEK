export type Locale = 'en' | 'pt';

const BASE_URL = 'https://chitek.com';

/** Get the alternative locale URL for the current page */
export function getAltHref(pathname: string, targetLang: Locale): string {
  // If currently on /pt/..., switch to English (root)
  if (pathname.startsWith('/pt')) {
    if (targetLang === 'en') {
      const rest = pathname.replace('/pt', '') || '/';
      return rest;
    }
    return pathname;
  }
  // If currently on English root, switch to Portuguese
  if (targetLang === 'pt') {
    return '/pt' + (pathname === '/' ? '' : pathname);
  }
  return pathname;
}

/** Build alternate-language link for SEO hreflang */
export function getHreflang(lang: Locale, pathname: string): string {
  const url = lang === 'en' ? pathname : `/pt${pathname === '/' ? '' : pathname}`;
  return `${BASE_URL}${url}`;
}
