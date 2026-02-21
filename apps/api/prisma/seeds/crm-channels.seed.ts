// ─── CRM Channel Seed — Two WhatsApp Channels ──────────────────────────────
// Run: cd apps/api && pnpm exec ts-node prisma/seeds/crm-channels.seed.ts
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const channels = [
    {
      name: 'Saubh SIM',
      phone: '+918800607598',
      type: 'EVOLUTION',
      instanceName: 'saubh-sim',
      isActive: true,
    },
    {
      name: 'Saubh Business',
      phone: '+918130960040',
      type: 'WABA',
      instanceName: null,
      isActive: true,
    },
  ];

  for (const ch of channels) {
    const result = await prisma.waChannel.upsert({
      where: { phone: ch.phone },
      update: { name: ch.name, type: ch.type, instanceName: ch.instanceName, isActive: ch.isActive },
      create: ch,
    });
    console.log(`✓ ${result.name} (${result.phone}) → ${result.type} [${result.id}]`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
