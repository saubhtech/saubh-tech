// Shared constants for Saubh.Tech platform

/** RTL language codes */
export const RTL_LANGS = new Set(['ur', 'ar', 'sd', 'ks']);

/** RTL locale codes (URL format) */
export const RTL_LOCALES = new Set(['ur-in', 'ar-in', 'ks-in', 'sd-in']);

// ─── Plain language codes (used by translation files, API) ──────────

/** Supported language codes (37 languages) */
export const SUPPORTED_LANG_CODES = [
  'en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa',
  'or', 'as', 'mai', 'sa', 'kok', 'doi', 'mni', 'sat', 'ur',
  'ks', 'sd', 'ne', 'ar', 'fr', 'de', 'es', 'pt', 'ru', 'ja',
  'ko', 'zh', 'th', 'vi', 'id', 'ms', 'tr', 'pl',
] as const;

/** Type for supported language codes */
export type SupportedLangCode = (typeof SUPPORTED_LANG_CODES)[number];

// ─── URL locale codes (used in locale-in-URL routing) ───────────────

/** Supported URL locale codes — pattern: {lang}-in */
export const SUPPORTED_LOCALES = [
  'en-in', 'hi-in', 'bn-in', 'ta-in', 'te-in', 'mr-in',
  'gu-in', 'kn-in', 'ml-in', 'pa-in', 'or-in', 'as-in',
  'ur-in', 'ks-in', 'sd-in', 'sa-in', 'ne-in', 'mai-in',
  'kok-in', 'mni-in', 'doi-in', 'sat-in', 'brx-in',
] as const;

/** Type for supported URL locale codes */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** Set for O(1) lookup */
export const SUPPORTED_LOCALES_SET = new Set<string>(SUPPORTED_LOCALES);

/** Default locale for URL routing */
export const DEFAULT_LOCALE: SupportedLocale = 'en-in';

/** Cookie name for persisted locale preference */
export const COOKIE_NAME = 'saubh_locale';

/** Cookie name for locale banner acknowledgement */
export const COOKIE_ACK_NAME = 'saubh_locale_ack';

// ─── Counts ─────────────────────────────────────────────────────────

/** Total number of supported languages */
export const TOTAL_LANGUAGES = SUPPORTED_LANG_CODES.length;

/** Total number of translation keys */
export const TOTAL_KEYS = 212;

// ─── App metadata ───────────────────────────────────────────────────

/** Application metadata */
export const APP_NAME = 'Saubh.Tech';
export const APP_DESCRIPTION = 'Phygital Gig Marketplace';
export const APP_DOMAIN = 'saubh.tech';
