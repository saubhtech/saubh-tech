'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { localeToLang, langToLocale, isValidLocale } from '@/lib/i18n/locale-map';
import { LANGUAGES } from '@/lib/i18n/languages';

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;expires=${d.toUTCString()};SameSite=Lax`;
}

/**
 * Persistent language banner — always visible on all pages.
 * Shows current language with inline dropdown to switch instantly.
 */
export default function LocaleBanner() {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (bannerRef.current && !bannerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  if (!mounted) return null;

  const lang = localeToLang(locale);
  const langDef = LANGUAGES.find((l) => l.code === lang);
  const displayName = langDef
    ? `${langDef.name}${langDef.name !== langDef.english ? ` (${langDef.english})` : ''}`
    : lang;

  const selectableLanguages = LANGUAGES.filter((l) => isValidLocale(langToLocale(l.code)));

  const handleLanguageChange = (langCode: string) => {
    const newLocale = langToLocale(langCode);
    if (!isValidLocale(newLocale)) return;
    const pathAfterLocale = pathname.replace(/^\/[^/]+/, '');
    const newPath = `/${newLocale}${pathAfterLocale}`;
    setCookie('saubh-lang', langCode, 365);
    setDropdownOpen(false);
    window.location.href = newPath;
  };

  return (
    <div
      ref={bannerRef}
      role="status"
      aria-live="polite"
      dir="ltr"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
        background: 'rgba(15,18,25,0.95)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(109,179,63,0.3)',
        padding: '10px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '10px', flexWrap: 'wrap',
        fontFamily: 'system-ui,sans-serif', fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.85)',
      }}
    >
      <span>\u{1F310} <strong style={{ color: '#fff' }}>{displayName}</strong></span>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-label="Change language"
          aria-expanded={dropdownOpen}
          style={{
            color: '#6db33f', background: 'rgba(109,179,63,0.12)',
            border: '1px solid rgba(109,179,63,0.25)', borderRadius: '6px',
            padding: '4px 12px', fontWeight: 600, fontSize: '0.82rem',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Change \u25BE
        </button>

        {dropdownOpen && (
          <div style={{
            position: 'absolute', bottom: '100%', left: '50%',
            transform: 'translateX(-50%)', marginBottom: '8px',
            background: 'rgba(15,18,25,0.98)',
            border: '1px solid rgba(109,179,63,0.3)', borderRadius: '12px',
            padding: '8px 0', maxHeight: '320px', overflowY: 'auto',
            width: '240px', boxShadow: '0 -8px 32px rgba(0,0,0,0.5)', zIndex: 10000,
          }}>
            {selectableLanguages.map((l) => {
              const isActive = l.code === lang;
              return (
                <button
                  key={l.code}
                  onClick={() => handleLanguageChange(l.code)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '8px 16px',
                    background: isActive ? 'rgba(109,179,63,0.15)' : 'transparent',
                    border: 'none', color: isActive ? '#6db33f' : 'rgba(255,255,255,0.8)',
                    fontWeight: isActive ? 700 : 400, fontSize: '0.85rem',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  }}
                >
                  <span>{l.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{l.english}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
