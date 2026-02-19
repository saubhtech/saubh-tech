// ─── Saubh.Tech Platform — Prisma Seed ──────────────────────────────────────
// Seeds: 1 business, 1 user, 1 membership
// Run: pnpm --filter @saubhtech/api prisma:seed
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient, UserRole } from '@prisma/client';

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

  // 2. Create user
  const user = await prisma.user.upsert({
    where: { email: 'admin@saubh.tech' },
    update: {},
    create: {
      email: 'admin@saubh.tech',
      preferredLocale: 'en',
    },
  });
  console.log(`  ✓ User: ${user.email} (${user.id})`);

  // 3. Create membership (owner)
  const membership = await prisma.userMembership.upsert({
    where: {
      userId_businessId_clientId: {
        userId: user.id,
        businessId: business.id,
        clientId: '',
      },
    },
    update: {},
    create: {
      userId: user.id,
      businessId: business.id,
      role: UserRole.OWNER,
    },
  });
  console.log(`  ✓ Membership: ${membership.role} (${membership.id})`);

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
