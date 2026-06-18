export type Locale = 'en' | 'pt' | 'es' | 'ar';

const BASE_URL = 'https://chitek.com';

/** Get the alternative locale URL for the current page */
export function getAltHref(pathname: string, targetLang: Locale): string {
  // If currently on /pt/... or /es/... or /ar/..., switch to English (root)
  const prefix = pathname.startsWith('/pt') ? '/pt' : pathname.startsWith('/es') ? '/es' : pathname.startsWith('/ar') ? '/ar' : '';
  if (prefix) {
    if (targetLang === 'en') {
      const rest = pathname.replace(prefix, '') || '/';
      return rest;
    }
    return pathname;
  }
  // If currently on English root, switch to target language
  if (targetLang === 'pt') {
    return '/pt' + (pathname === '/' ? '' : pathname);
  }
  if (targetLang === 'es') {
    return '/es' + (pathname === '/' ? '' : pathname);
  }
  if (targetLang === 'ar') {
    return '/ar' + (pathname === '/' ? '' : pathname);
  }
  return pathname;
}

/** Build alternate-language link for SEO hreflang */
export function getHreflang(lang: Locale, pathname: string): string {
  let url: string;
  if (lang === 'en') {
    url = pathname;
  } else if (lang === 'pt') {
    url = '/pt' + (pathname === '/' ? '' : pathname);
  } else if (lang === 'es') {
    url = '/es' + (pathname === '/' ? '' : pathname);
  } else {
    url = '/ar' + (pathname === '/' ? '' : pathname);
  }
  return `${BASE_URL}${url}`;
}
