import { notFound } from 'next/navigation';
import { isValidLocale, localeToLang } from '@/lib/i18n/locale-map';
import { getHreflangLinks, getCanonicalUrl } from '@/lib/seo/hreflang';
import { LocaleHydrator } from './locale-hydrator';
import LocaleBanner from '@/components/LocaleBanner';
import FontLoader from '@/components/FontLoader';

const RTL_LANGS = new Set(['ur', 'ar', 'sd', 'ks']);

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const lang = localeToLang(locale);
  const dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr';

  // SEO: hreflang + canonical for current path
  // Note: path is '' (homepage) at layout level; page-level metadata
  // handles per-page overrides via generateMetadata.
  const hreflangLinks = getHreflangLinks('');
  const canonicalUrl = getCanonicalUrl(locale, '');

  return (
    <>
      {/* ─── SEO: hreflang alternate links ─────────────────────────── */}
      {/* Reminder: Cloudflare must NOT cache HTML (set Cache-Control
          via Caddy or Cloudflare page rule: Cache-Control: no-store) */}
      <head>
        <link rel="canonical" href={canonicalUrl} />
        {hreflangLinks.map(({ locale: loc, url }) => (
          <link key={loc} rel="alternate" hrefLang={loc} href={url} />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={getCanonicalUrl('en-in', '')}
        />
      </head>

      <LocaleHydrator lang={lang} dir={dir as 'ltr' | 'rtl'} />
      <FontLoader />
      {children}
      <LocaleBanner />
    </>
  );
}
