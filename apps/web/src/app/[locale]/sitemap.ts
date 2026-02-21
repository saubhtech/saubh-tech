import type { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@saubhtech/shared';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://saubh.tech';

// Public pages that exist for every locale
const PAGES = [
  { path: '',          changeFrequency: 'weekly'  as const, priority: 1.0 },
  { path: '/language', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/login',    changeFrequency: 'monthly' as const, priority: 0.5 },
];

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function sitemap({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<MetadataRoute.Sitemap> {
  const { locale } = await params;

  return PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
