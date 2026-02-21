// ─── Language Seed — 23 Indian Locales ──────────────────────────────────────
// Run via main seed.ts or standalone:
//   npx tsx prisma/seeds/language.seed.ts
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGES = [
  { language: 'English',        locale: 'en-in',  isRtl: false, sortOrder: 1  },
  { language: 'हिन्दी',           locale: 'hi-in',  isRtl: false, sortOrder: 2  },
  { language: 'বাংলা',           locale: 'bn-in',  isRtl: false, sortOrder: 3  },
  { language: 'தமிழ்',            locale: 'ta-in',  isRtl: false, sortOrder: 4  },
  { language: 'తెలుగు',           locale: 'te-in',  isRtl: false, sortOrder: 5  },
  { language: 'मराठी',            locale: 'mr-in',  isRtl: false, sortOrder: 6  },
  { language: 'ગુજરાતી',          locale: 'gu-in',  isRtl: false, sortOrder: 7  },
  { language: 'ಕನ್ನಡ',            locale: 'kn-in',  isRtl: false, sortOrder: 8  },
  { language: 'മലയാളം',          locale: 'ml-in',  isRtl: false, sortOrder: 9  },
  { language: 'ਪੰਜਾਬੀ',           locale: 'pa-in',  isRtl: false, sortOrder: 10 },
  { language: 'ଓଡ଼ିଆ',            locale: 'or-in',  isRtl: false, sortOrder: 11 },
  { language: 'অসমীয়া',          locale: 'as-in',  isRtl: false, sortOrder: 12 },
  { language: 'اردو',            locale: 'ur-in',  isRtl: true,  sortOrder: 13 },
  { language: 'کٲشُر',           locale: 'ks-in',  isRtl: true,  sortOrder: 14 },
  { language: 'سنڌي',            locale: 'sd-in',  isRtl: true,  sortOrder: 15 },
  { language: 'संस्कृतम्',         locale: 'sa-in',  isRtl: false, sortOrder: 16 },
  { language: 'नेपाली',           locale: 'ne-in',  isRtl: false, sortOrder: 17 },
  { language: 'मैथिली',           locale: 'mai-in', isRtl: false, sortOrder: 18 },
  { language: 'कोंकणी',           locale: 'kok-in', isRtl: false, sortOrder: 19 },
  { language: 'মণিপুরী',          locale: 'mni-in', isRtl: false, sortOrder: 20 },
  { language: 'डोगरी',            locale: 'doi-in', isRtl: false, sortOrder: 21 },
  { language: 'ᱥᱟᱱᱛᱟᱲᱤ',          locale: 'sat-in', isRtl: false, sortOrder: 22 },
  { language: 'बड़ो',             locale: 'brx-in', isRtl: false, sortOrder: 23 },
];

export async function seedLanguages() {
  console.log('🌱 Seeding languages...');

  for (const lang of LANGUAGES) {
    await prisma.language.upsert({
      where: { locale: lang.locale },
      update: {
        language: lang.language,
        isRtl: lang.isRtl,
        sortOrder: lang.sortOrder,
        isActive: true,
      },
      create: {
        language: lang.language,
        locale: lang.locale,
        isRtl: lang.isRtl,
        sortOrder: lang.sortOrder,
        isActive: true,
      },
    });
    console.log(`  ✓ ${lang.locale} — ${lang.language}`);
  }

  console.log(`✅ ${LANGUAGES.length} languages seeded.`);
}

// Allow standalone execution
if (require.main === module) {
  seedLanguages()
    .catch((e) => {
      console.error('❌ Language seed failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
