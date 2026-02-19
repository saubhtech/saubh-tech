import request from 'supertest';
import { getApp, getPrisma, closeApp } from './helpers/app.helper';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Me (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Seed IDs (tracked for cleanup)
  let userId: string;
  let businessId: string;
  let otherBusinessId: string;
  let membershipId: string;

  beforeAll(async () => {
    app = await getApp();
    prisma = getPrisma();

    // ─── Seed test data ───────────────────────────────────────────────
    const business = await prisma.business.create({
      data: { name: 'Test Biz', slug: `test-biz-${Date.now()}` },
    });
    businessId = business.id;

    const otherBusiness = await prisma.business.create({
      data: { name: 'Other Biz', slug: `other-biz-${Date.now()}` },
    });
    otherBusinessId = otherBusiness.id;

    const user = await prisma.user.create({
      data: {
        email: `testuser-${Date.now()}@e2e.test`,
        preferredLocale: 'hi-in',
      },
    });
    userId = user.id;

    const membership = await prisma.userMembership.create({
      data: {
        userId,
        businessId,
        role: 'MEMBER',
      },
    });
    membershipId = membership.id;
  });

  afterAll(async () => {
    // ─── Cleanup seed data ────────────────────────────────────────────
    await prisma.userMembership.deleteMany({ where: { id: membershipId } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.business.deleteMany({
      where: { id: { in: [businessId, otherBusinessId] } },
    });
    await closeApp();
  });

  // ─── Test 1: GET /api/me returns preferredLocale ────────────────────
  it('GET /api/me returns preferredLocale', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/me')
      .set('x-user-id', userId)
      .set('x-business-id', businessId)
      .expect(200);

    expect(res.body).toHaveProperty('preferredLocale', 'hi-in');
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('role', 'MEMBER');
    expect(res.body.business).toHaveProperty('id', businessId);
  });

  // ─── Test 2: PATCH /api/me/preferences accepts valid locale ─────────
  it('PATCH /api/me/preferences accepts valid locale', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/me/preferences')
      .set('x-user-id', userId)
      .set('x-business-id', businessId)
      .send({ preferred_locale: 'ta-in' })
      .expect(200);

    expect(res.body).toHaveProperty('preferredLocale', 'ta-in');

    // Reset back for other tests
    await prisma.user.update({
      where: { id: userId },
      data: { preferredLocale: 'hi-in' },
    });
  });

  // ─── Test 3: PATCH /api/me/preferences rejects invalid locale ───────
  it('PATCH /api/me/preferences rejects invalid locale', async () => {
    await request(app.getHttpServer())
      .patch('/api/me/preferences')
      .set('x-user-id', userId)
      .set('x-business-id', businessId)
      .send({ preferred_locale: 'xx-zz' })
      .expect(400);
  });

  // ─── Test 4: Tenant safety — wrong businessId returns 404 ───────────
  it('wrong businessId returns 404 (tenant safety)', async () => {
    await request(app.getHttpServer())
      .get('/api/me')
      .set('x-user-id', userId)
      .set('x-business-id', otherBusinessId)
      .expect(404);
  });
});
