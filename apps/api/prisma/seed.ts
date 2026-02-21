// ─── Saubh.Tech Platform — Prisma Seed ────────────────────────────────────────
// Seeds: 1 business, 1 user, 1 membership, 23 languages
// Run: pnpm --filter @saubhtech/api prisma:seed
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient, UserRole } from '@prisma/client';
import { seedLanguages } from './seeds/language.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create business
  const business = await prisma.business.upsert({
    where: { slug: 'saubhtech' },
    update: {},
    create: {
      name: 'Saubh.Tech',
      slug: 'saubhtech',
      isActive: true,
    },
  });
  console.log(`  ✓ Business: ${business.name} (${business.id})`);

  // 2. Create admin user (WhatsApp-based)
  const user = await prisma.user.upsert({
    where: { whatsapp: '+919999999999' },
    update: {},
    create: {
      whatsapp: '+919999999999',
      fname: 'Admin',
      email: 'admin@saubh.tech',
      status: 'A',
    },
  });
  console.log(`  ✓ User: ${user.fname} / ${user.whatsapp} (${user.userid})`);

  // 3. Create membership (owner)
  const membership = await prisma.userMembership.upsert({
    where: {
      userId_businessId_clientId: {
        userId: user.userid,
        businessId: business.id,
        clientId: '',
      },
    },
    update: {},
    create: {
      userId: user.userid,
      businessId: business.id,
      role: UserRole.OWNER,
    },
  });
  console.log(`  ✓ Membership: ${membership.role} (${membership.id})`);

  // 4. Seed master tables
  await seedLanguages();

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
