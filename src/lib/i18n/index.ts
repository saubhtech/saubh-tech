// ─── i18n Module Barrel Export ───
export { TranslationProvider, useTranslation } from './TranslationProvider';
export { LANGUAGES, LANG_MAP, getLang, DEFAULT_LANG, SUPPORTED_CODES, detectFromAcceptLanguage } from './languages';
export type { LangDef } from './languages';
export { default as enStrings } from './strings/en';
