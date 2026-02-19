// Shared constants for Saubh.Tech platform

/** RTL language codes */
export const RTL_LANGS = new Set(['ur', 'ar', 'sd', 'ks']);

/** Supported locale codes (37 languages) */
export const SUPPORTED_LOCALES = [
  'en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa',
  'or', 'as', 'mai', 'sa', 'kok', 'doi', 'mni', 'sat', 'ur',
  'ks', 'sd', 'ne', 'ar', 'fr', 'de', 'es', 'pt', 'ru', 'ja',
  'ko', 'zh', 'th', 'vi', 'id', 'ms', 'tr', 'pl',
] as const;

/** Type for supported locale codes */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** Total number of supported languages */
export const TOTAL_LANGUAGES = SUPPORTED_LOCALES.length;

/** Total number of translation keys */
export const TOTAL_KEYS = 212;

/** Application metadata */
export const APP_NAME = 'Saubh.Tech';
export const APP_DESCRIPTION = 'Phygital Gig Marketplace';
export const APP_DOMAIN = 'saubh.tech';
