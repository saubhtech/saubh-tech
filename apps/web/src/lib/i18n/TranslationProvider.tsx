'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import en from './strings/en';
import { LANGUAGES, DEFAULT_LANG, SUPPORTED_CODES, getLang, type LangDef } from './languages';

// Widen en's 'as const' literal type for dynamic key lookups
const enBase: Record<string, string> = en;

// ─── Types ───
interface TranslationCtx {
  lang: string;
  langDef: LangDef;
  t: (key: string) => string;
  setLang: (code: string) => void;
  loading: boolean;
  languages: typeof LANGUAGES;
}

const TranslationContext = createContext<TranslationCtx | null>(null);

// ─── Cookie helpers ───
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;expires=${d.toUTCString()};SameSite=Lax`;
}

// ─── In-memory translation cache ───
const translationCache = new Map<string, Record<string, string>>();

// ─── Language Loaders (explicit, Turbopack-safe) ───
// Each loader creates a separate webpack chunk via code-splitting.
// ⚠️ ADDING A NEW LANGUAGE? Just add its loader line here.
type LangLoader = () => Promise<{ default: Record<string, string> }>;

const LANG_LOADERS: Record<string, LangLoader> = {
  // ─── Active Languages (13 total) ───
  hi: () => import('./strings/hi'),
  bn: () => import('./strings/bn'),
  te: () => import('./strings/te'),
  mr: () => import('./strings/mr'),
  ta: () => import('./strings/ta'),
  gu: () => import('./strings/gu'),
  kn: () => import('./strings/kn'),
  ml: () => import('./strings/ml'),
  pa: () => import('./strings/pa'),
  or: () => import('./strings/or'),
  as: () => import('./strings/as'),
  ur: () => import('./strings/ur'),
  // ─── Pending Languages (add loader when .ts file is pushed) ───
  ne: () => import('./strings/ne'),
  sa: () => import('./strings/sa'),
  mai: () => import('./strings/mai'),
  kok: () => import('./strings/kok'),
  doi: () => import('./strings/doi'),
  sd: () => import('./strings/sd'),
  ks: () => import('./strings/ks'),
  brx: () => import('./strings/brx'),
  sat: () => import('./strings/sat'),
  mni: () => import('./strings/mni'),
  ar: () => import('./strings/ar'),
  zh: () => import('./strings/zh'),
  fr: () => import('./strings/fr'),
  de: () => import('./strings/de'),
  ja: () => import('./strings/ja'),
  ko: () => import('./strings/ko'),
  pt: () => import('./strings/pt'),
  ru: () => import('./strings/ru'),
  es: () => import('./strings/es'),
  th: () => import('./strings/th'),
  vi: () => import('./strings/vi'),
  id: () => import('./strings/id'),
  ms: () => import('./strings/ms'),
  tr: () => import('./strings/tr'),
};

// ─── Provider ───
export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<string>(DEFAULT_LANG);
  const [strings, setStrings] = useState<Record<string, string>>(enBase);
  const [loading, setLoading] = useState(false);

  // ─── Load translations via dynamic import ───
  const loadTranslations = useCallback(async (code: string) => {
    if (code === 'en') {
      setStrings(enBase);
      setLoading(false);
      return;
    }

    // Check in-memory cache first
    if (translationCache.has(code)) {
      setStrings(translationCache.get(code)!);
      return;
    }

    const loader = LANG_LOADERS[code];
    if (!loader) {
      console.warn(`[i18n] No loader for '${code}', using English`);
      setStrings(enBase);
      return;
    }

    setLoading(true);

    try {
      const mod = await loader();
      const langStrings = mod.default as Record<string, string>;
      // Merge with English base (missing keys fall back to English)
      const merged = { ...enBase, ...langStrings };
      translationCache.set(code, merged);
      setStrings(merged);
    } catch (err) {
      console.warn(`[i18n] Failed to load '${code}', using English`, err);
      setStrings(enBase);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Detect initial language (runs once on mount) ───
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const cookieLang = getCookie('saubh-lang');

    const detected = urlLang || cookieLang || DEFAULT_LANG;
    const valid = SUPPORTED_CODES.includes(detected) ? detected : DEFAULT_LANG;

    if (valid !== DEFAULT_LANG) {
      setLangState(valid);
      loadTranslations(valid);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Switch language ───
  const setLang = useCallback(
    (code: string) => {
      if (!SUPPORTED_CODES.includes(code)) return;
      setLangState(code);
      setCookie('saubh-lang', code);

      const url = new URL(window.location.href);
      if (code === DEFAULT_LANG) {
        url.searchParams.delete('lang');
      } else {
        url.searchParams.set('lang', code);
      }
      window.history.replaceState({}, '', url.toString());

      const langDef = getLang(code);
      document.documentElement.lang = code;
      document.documentElement.dir = langDef?.dir || 'ltr';

      loadTranslations(code);
    },
    [loadTranslations]
  );

  // ─── Translation function ───
  const t = useCallback(
    (key: string): string => {
      return strings[key] || enBase[key] || key;
    },
    [strings]
  );

  const langDef = getLang(lang) || getLang(DEFAULT_LANG)!;

  return (
    <TranslationContext.Provider value={{ lang, langDef, t, setLang, loading, languages: LANGUAGES }}>
      {children}
    </TranslationContext.Provider>
  );
}

// ─── Hook ───
export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within <TranslationProvider>');
  }
  return ctx;
}
