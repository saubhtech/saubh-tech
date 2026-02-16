'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import en from './strings/en';
import { LANGUAGES, DEFAULT_LANG, SUPPORTED_CODES, getLang, type LangDef } from './languages';

// Cast en to Record<string, string> for dynamic key lookups
const enBase: Record<string, string> = en;

// ─── Types ───
interface TranslationCtx {
  /** Current language code */
  lang: string;
  /** Current language definition */
  langDef: LangDef;
  /** Translate a key → localized string */
  t: (key: string) => string;
  /** Switch language */
  setLang: (code: string) => void;
  /** Whether translations are loading */
  loading: boolean;
  /** All supported languages */
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

// ─── Saubh-lang API URL ───
const LANG_API = process.env.NEXT_PUBLIC_LANG_API_URL || '/api/lang';

// ─── In-memory translation cache ───
const translationCache = new Map<string, Record<string, string>>();

// ─── Provider ───
export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<string>(DEFAULT_LANG);
  const [strings, setStrings] = useState<Record<string, string>>(enBase);
  const [loading, setLoading] = useState(false);

  // ─── Detect initial language (runs once on mount) ───
  useEffect(() => {
    // Priority: 1. URL ?lang= param  2. Cookie  3. Geo-detect cookie set by middleware
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const cookieLang = getCookie('saubh-lang');

    const detected = urlLang || cookieLang || DEFAULT_LANG;
    const valid = SUPPORTED_CODES.includes(detected) ? detected : DEFAULT_LANG;

    if (valid !== DEFAULT_LANG) {
      setLangState(valid);
      loadTranslations(valid);
    }
  }, []);

  // ─── Load translations from saubh-lang API ───
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

    setLoading(true);

    try {
      const res = await fetch(`${LANG_API}/page`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: '/', target: code, format: 'json' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.strings && typeof data.strings === 'object') {
          // Merge with English base (so missing keys fall back to English)
          const merged = { ...enBase, ...data.strings };
          translationCache.set(code, merged);
          setStrings(merged);
        } else {
          // API returned OK but no strings — fall back to English
          setStrings(enBase);
        }
      } else {
        // API error — fall back to English
        console.warn(`[i18n] Translation API returned ${res.status} for ${code}, using English`);
        setStrings(enBase);
      }
    } catch {
      // API unreachable — fall back to English
      console.warn(`[i18n] Translation API unreachable for ${code}, using English`);
      setStrings(enBase);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Switch language (called from Navbar dropdown) ───
  const setLang = useCallback(
    (code: string) => {
      if (!SUPPORTED_CODES.includes(code)) return;
      setLangState(code);
      setCookie('saubh-lang', code);

      // Update URL without reload (remove ?lang= if present, add new one)
      const url = new URL(window.location.href);
      if (code === DEFAULT_LANG) {
        url.searchParams.delete('lang');
      } else {
        url.searchParams.set('lang', code);
      }
      window.history.replaceState({}, '', url.toString());

      // Update <html lang="..."> and dir
      const langDef = getLang(code);
      document.documentElement.lang = code;
      document.documentElement.dir = langDef?.dir || 'ltr';

      // Load translations
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
