'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { localeToLang } from '@/lib/i18n/locale-map';
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
 * Shows a dismissable banner confirming the auto-detected language.
 * Hidden once the user clicks "OK" (sets saubh_locale_ack cookie).
 * Accessible: role="status", keyboard-dismissable.
 */
export default function LocaleBanner() {
  const { locale } = useParams<{ locale: string }>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if ack cookie is not set
    if (!getCookie(COOKIE_ACK)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setCookie(COOKIE_ACK, '1', 365);
    setVisible(false);
  };

  if (!visible) return null;

  const lang = localeToLang(locale);
  const langDef = LANGUAGES.find((l) => l.code === lang);
  const displayName = langDef ? `${langDef.name} (${langDef.name !== langDef.english ? langDef.english : langDef.name})` : lang;

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

      <Link
        href={`/${locale}/language`}
        style={{
          color: '#6db33f',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          fontWeight: 600,
        }}
      >
        Change
      </Link>

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
