'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { localeToLang, langToLocale, isValidLocale } from '@/lib/i18n/locale-map';
import { LANGUAGES } from '@/lib/i18n/languages';

const COOKIE_ACK = 'saubh_locale_ack';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;expires=${d.toUTCString()};SameSite=Lax`;
}

/**
 * Shows a dismissable banner confirming the auto-detected language
 * with an inline dropdown to switch languages instantly.
 */
export default function LocaleBanner() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!getCookie(COOKIE_ACK)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setCookie(COOKIE_ACK, '1', 365);
    setVisible(false);
  };

  const handleLanguageChange = (langCode: string) => {
    const newLocale = langToLocale(langCode);
    if (!isValidLocale(newLocale)) return;

    // Replace current locale in the URL path
    const pathAfterLocale = pathname.replace(/^\/[^/]+/, '');
    const newPath = `/${newLocale}${pathAfterLocale}`;

    // Update cookie
    setCookie('saubh-lang', langCode, 365);
    // Clear ack cookie so banner reappears after language switch
    setCookie(COOKIE_ACK, '', -1);
    setDropdownOpen(false);
    window.location.href = newPath;
  };

  if (!visible) return null;

  const lang = localeToLang(locale);
  const langDef = LANGUAGES.find((l) => l.code === lang);
  const displayName = langDef
    ? `${langDef.name}${langDef.name !== langDef.english ? ` (${langDef.english})` : ''}`
    : lang;

  // Only show Indian locales in dropdown (23 languages with URL locales)
  const selectableLanguages = LANGUAGES.filter((l) => {
    const loc = langToLocale(l.code);
    return isValidLocale(loc) && loc !== 'en-in' || l.code === 'en';
  });

  return (
    <div
      role="status"
      aria-live="polite"
      dir="ltr"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(15, 18, 25, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(109, 179, 63, 0.3)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        fontFamily: 'var(--font-body, sans-serif)',
        fontSize: '0.88rem',
        color: 'rgba(255, 255, 255, 0.85)',
      }}
    >
      <span>
        <i className="fas fa-globe" style={{ color: '#6db33f', marginInlineEnd: 6 }}></i>
        Language set to <strong style={{ color: '#fff' }}>{displayName}</strong>.
      </span>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-label="Change language"
          style={{
            color: '#6db33f',
            background: 'none',
            border: 'none',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: 0,
          }}
        >
          Change ▾
        </button>

        {dropdownOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
              background: 'rgba(15, 18, 25, 0.98)',
              border: '1px solid rgba(109, 179, 63, 0.3)',
              borderRadius: '12px',
              padding: '8px 0',
              maxHeight: '320px',
              overflowY: 'auto',
              width: '240px',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
              zIndex: 10000,
            }}
          >
            {selectableLanguages.map((l) => {
              const isActive = l.code === lang;
              return (
                <button
                  key={l.code}
                  onClick={() => handleLanguageChange(l.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 16px',
                    background: isActive ? 'rgba(109, 179, 63, 0.15)' : 'transparent',
                    border: 'none',
                    color: isActive ? '#6db33f' : 'rgba(255,255,255,0.8)',
                    fontWeight: isActive ? 700 : 400,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>{l.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                    {l.english}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={dismiss}
        aria-label="Dismiss language banner"
        style={{
          background: 'rgba(109, 179, 63, 0.15)',
          border: '1px solid rgba(109, 179, 63, 0.3)',
          borderRadius: '6px',
          padding: '6px 16px',
          color: '#6db33f',
          fontWeight: 600,
          fontSize: '0.82rem',
          cursor: 'pointer',
          fontFamily: 'var(--font-display, sans-serif)',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(109, 179, 63, 0.25)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(109, 179, 63, 0.15)')}
      >
        OK
      </button>
    </div>
  );
}
