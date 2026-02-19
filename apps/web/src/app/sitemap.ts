import type { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@saubhtech/shared';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://saubh.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  // Sitemap index: one entry per locale pointing to per-locale sitemap
  return SUPPORTED_LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}/sitemap.xml`,
    lastModified: new Date(),
  }));
}
