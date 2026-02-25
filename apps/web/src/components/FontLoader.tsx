'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

/**
 * Dynamic font loader for multi-script support.
 * Loads the correct Google Noto font based on the current locale's script.
 * Renders nothing — purely side-effect.
 * 
 * Strategy: Load Noto Sans for the detected script on demand.
 * English/Latin scripts use the existing Sora + DM Sans fonts.
 * Indian and international scripts get Noto Sans variants.
 */

const LANG_TO_FONT: Record<string, { family: string; weights: string }> = {
  // Devanagari: Hindi, Marathi, Sanskrit, Nepali, Konkani, Dogri, Maithili, Bodo
  hi: { family: 'Noto+Sans+Devanagari', weights: '400;500;600;700' },
  mr: { family: 'Noto+Sans+Devanagari', weights: '400;500;600;700' },
  sa: { family: 'Noto+Sans+Devanagari', weights: '400;500;600;700' },
  ne: { family: 'Noto+Sans+Devanagari', weights: '400;500;600;700' },
  kok: { family: 'Noto+Sans+Devanagari', weights: '400;500;600;700' },
  doi: { family: 'Noto+Sans+Devanagari', weights: '400;500;600;700' },
  mai: { family: 'Noto+Sans+Devanagari', weights: '400;500;600;700' },
  brx: { family: 'Noto+Sans+Devanagari', weights: '400;500;600;700' },
  // Bengali: Bengali, Assamese, Manipuri
  bn: { family: 'Noto+Sans+Bengali', weights: '400;500;600;700' },
  as: { family: 'Noto+Sans+Bengali', weights: '400;500;600;700' },
  mni: { family: 'Noto+Sans+Bengali', weights: '400;500;600;700' },
  // Tamil
  ta: { family: 'Noto+Sans+Tamil', weights: '400;500;600;700' },
  // Telugu
  te: { family: 'Noto+Sans+Telugu', weights: '400;500;600;700' },
  // Gujarati
  gu: { family: 'Noto+Sans+Gujarati', weights: '400;500;600;700' },
  // Kannada
  kn: { family: 'Noto+Sans+Kannada', weights: '400;500;600;700' },
  // Malayalam
  ml: { family: 'Noto+Sans+Malayalam', weights: '400;500;600;700' },
  // Odia
  or: { family: 'Noto+Sans+Oriya', weights: '400;500;600;700' },
  // Gurmukhi (Punjabi)
  pa: { family: 'Noto+Sans+Gurmukhi', weights: '400;500;600;700' },
  // Arabic script: Urdu, Sindhi, Kashmiri, Arabic
  ur: { family: 'Noto+Sans+Arabic', weights: '400;500;600;700' },
  sd: { family: 'Noto+Sans+Arabic', weights: '400;500;600;700' },
  ks: { family: 'Noto+Sans+Arabic', weights: '400;500;600;700' },
  ar: { family: 'Noto+Sans+Arabic', weights: '400;500;600;700' },
  // Ol Chiki (Santali)
  sat: { family: 'Noto+Sans+Ol+Chiki', weights: '400;500;600;700' },
  // CJK
  zh: { family: 'Noto+Sans+SC', weights: '400;500;700' },
  ja: { family: 'Noto+Sans+JP', weights: '400;500;700' },
  ko: { family: 'Noto+Sans+KR', weights: '400;500;700' },
  // Thai
  th: { family: 'Noto+Sans+Thai', weights: '400;500;600;700' },
};

// CSS font-family names (without + for Google Fonts URL)
const FONT_FAMILY_NAME: Record<string, string> = {
  'Noto+Sans+Devanagari': 'Noto Sans Devanagari',
  'Noto+Sans+Bengali': 'Noto Sans Bengali',
  'Noto+Sans+Tamil': 'Noto Sans Tamil',
  'Noto+Sans+Telugu': 'Noto Sans Telugu',
  'Noto+Sans+Gujarati': 'Noto Sans Gujarati',
  'Noto+Sans+Kannada': 'Noto Sans Kannada',
  'Noto+Sans+Malayalam': 'Noto Sans Malayalam',
  'Noto+Sans+Oriya': 'Noto Sans Oriya',
  'Noto+Sans+Gurmukhi': 'Noto Sans Gurmukhi',
  'Noto+Sans+Arabic': 'Noto Sans Arabic',
  'Noto+Sans+Ol+Chiki': 'Noto Sans Ol Chiki',
  'Noto+Sans+SC': 'Noto Sans SC',
  'Noto+Sans+JP': 'Noto Sans JP',
  'Noto+Sans+KR': 'Noto Sans KR',
  'Noto+Sans+Thai': 'Noto Sans Thai',
};

export default function FontLoader() {
  const { locale } = useParams<{ locale: string }>();

  useEffect(() => {
    // Extract lang from locale (e.g., 'hi-in' → 'hi')
    const lang = (locale || 'en').split('-')[0];
    const fontDef = LANG_TO_FONT[lang];

    // English and other Latin-script languages use existing fonts
    if (!fontDef) return;

    const fontId = 'noto-font-' + lang;

    // Don't load if already present
    if (document.getElementById(fontId)) return;

    // Create link element for Google Fonts
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family='
      + fontDef.family + ':wght@' + fontDef.weights + '&display=swap';
    document.head.appendChild(link);

    // Set CSS custom property for the font
    const familyName = FONT_FAMILY_NAME[fontDef.family] || fontDef.family.replace(/\+/g, ' ');
    document.documentElement.style.setProperty('--font-script', "'" + familyName + "'");

    // Apply font to body
    document.body.style.fontFamily = "'" + familyName + "', var(--font-body)";

    return () => {
      // Cleanup: reset font when navigating away
      document.documentElement.style.removeProperty('--font-script');
      document.body.style.fontFamily = '';
    };
  }, [locale]);

  return null;
}
