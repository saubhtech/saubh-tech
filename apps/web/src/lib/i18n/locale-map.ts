/**
 * Locale mapping utilities for locale-in-URL routing.
 *
 * Maps between:
 *   - Plain language codes ('hi', 'bn', etc.) used by translation files
 *   - URL locale codes ('hi-in', 'bn-in', etc.) used in URL routing
 *   - Accept-Language headers ('hi', 'hi-IN', 'bn-BD', etc.)
 *   - Cloudflare cf-ipcountry codes ('IN', 'BD', 'NP', etc.)
 */

// ─── URL locale codes (23 Indian locales) ───────────────────────────

const SUPPORTED_LOCALES_SET = new Set([
  'en-in', 'hi-in', 'bn-in', 'ta-in', 'te-in', 'mr-in',
  'gu-in', 'kn-in', 'ml-in', 'pa-in', 'or-in', 'as-in',
  'ur-in', 'ks-in', 'sd-in', 'sa-in', 'ne-in', 'mai-in',
  'kok-in', 'mni-in', 'doi-in', 'sat-in', 'brx-in',
]);

const DEFAULT_LOCALE = 'en-in';

// ─── Lang code → URL locale ─────────────────────────────────────────
// Maps every supported language code to its URL locale.
// Indian languages get their own locale; international languages
// fall back to 'en-in' (no international URL locales yet).

const LANG_TO_LOCALE: Record<string, string> = {
  // Indian languages → {lang}-in
  en:  'en-in',
  hi:  'hi-in',
  bn:  'bn-in',
  ta:  'ta-in',
  te:  'te-in',
  mr:  'mr-in',
  gu:  'gu-in',
  kn:  'kn-in',
  ml:  'ml-in',
  pa:  'pa-in',
  or:  'or-in',
  as:  'as-in',
  ur:  'ur-in',
  ks:  'ks-in',
  sd:  'sd-in',
  sa:  'sa-in',
  ne:  'ne-in',
  mai: 'mai-in',
  kok: 'kok-in',
  mni: 'mni-in',
  doi: 'doi-in',
  sat: 'sat-in',
  brx: 'brx-in',
  // International languages → en-in (no dedicated URL locale yet)
  ar:  'en-in',
  zh:  'en-in',
  fr:  'en-in',
  de:  'en-in',
  ja:  'en-in',
  ko:  'en-in',
  pt:  'en-in',
  ru:  'en-in',
  es:  'en-in',
  th:  'en-in',
  vi:  'en-in',
  id:  'en-in',
  ms:  'en-in',
  tr:  'en-in',
  pl:  'en-in',
};

// ─── URL locale → lang code ─────────────────────────────────────────
// Strips the '-in' suffix to get the translation file key.

const LOCALE_TO_LANG: Record<string, string> = {};
for (const [lang, locale] of Object.entries(LANG_TO_LOCALE)) {
  // Only map Indian locales back (avoid overwriting with 'en' from intl)
  if (locale !== 'en-in' || lang === 'en') {
    LOCALE_TO_LANG[locale] = lang;
  }
}

// ─── Cloudflare cf-ipcountry → URL locale ───────────────────────────
// Fast first-pass geo-detection without hitting any API.
// India defaults to Hindi; regional languages are detected via
// Accept-Language in the proxy before this fallback is reached.

const CF_COUNTRY_TO_LOCALE: Record<string, string> = {
  IN: 'hi-in',   // India → Hindi (regional users detected via Accept-Language)
  BD: 'bn-in',   // Bangladesh → Bengali
  NP: 'ne-in',   // Nepal → Nepali
  PK: 'ur-in',   // Pakistan → Urdu
  LK: 'ta-in',   // Sri Lanka → Tamil
  // International countries → en-in (no intl URL locales)
  US: 'en-in', GB: 'en-in', AU: 'en-in', CA: 'en-in',
  SA: 'en-in', AE: 'en-in', EG: 'en-in', QA: 'en-in',
  CN: 'en-in', TW: 'en-in', HK: 'en-in', JP: 'en-in',
  KR: 'en-in', TH: 'en-in', VN: 'en-in', ID: 'en-in',
  MY: 'en-in', FR: 'en-in', DE: 'en-in', ES: 'en-in',
  MX: 'en-in', BR: 'en-in', PT: 'en-in', RU: 'en-in',
  TR: 'en-in', PL: 'en-in',
};

// ─── Public API ─────────────────────────────────────────────────────

/** Check if a string is a valid URL locale */
export function isValidLocale(locale: string): boolean {
  return SUPPORTED_LOCALES_SET.has(locale);
}

/** Convert a plain language code to a URL locale */
export function langToLocale(lang: string): string {
  return LANG_TO_LOCALE[lang] ?? DEFAULT_LOCALE;
}

/** Convert a URL locale to a plain language code (for translation lookup) */
export function localeToLang(locale: string): string {
  return LOCALE_TO_LANG[locale] ?? 'en';
}

/**
 * Parse Accept-Language header and return the best matching URL locale.
 * E.g. "hi-IN,hi;q=0.9,en;q=0.8" → "hi-in"
 */
export function localeFromAcceptLanguage(header: string | null): string | null {
  if (!header) return null;

  const parts = header.split(',').map((p) => {
    const [tag, qStr] = p.trim().split(';q=');
    return { tag: tag.trim().toLowerCase(), q: qStr ? parseFloat(qStr) : 1.0 };
  });
  parts.sort((a, b) => b.q - a.q);

  for (const { tag } of parts) {
    const primary = tag.split('-')[0];
    const mapped = LANG_TO_LOCALE[primary];
    if (mapped && SUPPORTED_LOCALES_SET.has(mapped)) {
      return mapped;
    }
  }
  return null;
}

/**
 * Map Cloudflare cf-ipcountry header to a URL locale.
 * Returns null for unknown countries or Tor/private (XX, T1).
 */
export function localeFromCountry(countryCode: string | null): string | null {
  if (!countryCode || countryCode === 'XX' || countryCode === 'T1') return null;
  return CF_COUNTRY_TO_LOCALE[countryCode.toUpperCase()] ?? null;
}

export { DEFAULT_LOCALE, SUPPORTED_LOCALES_SET };
