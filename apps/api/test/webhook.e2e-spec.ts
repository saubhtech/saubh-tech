import request from 'supertest';
import { getApp, closeApp } from './helpers/app.helper';
import { INestApplication } from '@nestjs/common';

describe('Webhook (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await getApp();
  });

  afterAll(async () => {
    await closeApp();
  });

  // ─── Test 1: POST with body returns 200 ─────────────────────────────
  it('POST /api/webhooks/telephony/providerX returns 200', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/webhooks/telephony/providerX')
      .set('x-signature', 'test-sig-abc123')
      .send({ event: 'call.completed', callId: 'test-call-1' })
      .expect(200);

    expect(res.body).toHaveProperty('received', true);
  });

  // ─── Test 2: Missing signature still returns 200 (stub) ─────────────
  it('missing x-signature header still returns 200 (stub — real verify later)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/webhooks/telephony/providerX')
      .send({ event: 'call.initiated', callId: 'test-call-2' })
      .expect(200);

    expect(res.body).toHaveProperty('received', true);
  });
});
