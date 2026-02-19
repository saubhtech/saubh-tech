import { SUPPORTED_LOCALES } from '@saubhtech/shared';

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://saubh.tech';

/**
 * Generate hreflang alternate links for all supported locales.
 * Used in <head> to tell search engines about locale variants.
 *
 * @param path - Path after the locale segment (e.g. '' for homepage, '/language')
 * @returns Array of { locale, url } for each supported locale
 */
export function getHreflangLinks(path: string = ''): {
  locale: string;
  url: string;
}[] {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
    url: `${BASE_URL}/${locale}${path}`,
  }));
}

/**
 * Get the canonical URL for a specific locale + path.
 *
 * @param locale - URL locale code (e.g. 'hi-in')
 * @param path - Path after the locale segment (e.g. '' for homepage)
 * @returns Full canonical URL string
 */
export function getCanonicalUrl(locale: string, path: string = ''): string {
  return `${BASE_URL}/${locale}${path}`;
}
