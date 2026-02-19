import * as request from 'supertest';
import { getApp, closeApp } from './helpers/app.helper';
import { INestApplication } from '@nestjs/common';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await getApp();
  });

  afterAll(async () => {
    await closeApp();
  });

  it('GET /api/healthz returns 200 with { status: "ok" }', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/healthz')
      .expect(200);

    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});
