import { notFound } from 'next/navigation';
import { isValidLocale, localeToLang } from '@/lib/i18n/locale-map';
import { LocaleHydrator } from './locale-hydrator';
import LocaleBanner from '@/components/LocaleBanner';

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

  return (
    <>
      <LocaleHydrator lang={lang} dir={dir as 'ltr' | 'rtl'} />
      {children}
      <LocaleBanner />
    </>
  );
}
