import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─── CORS ───────────────────────────────────────────────────────────
  const origins = process.env.CORS_ORIGINS?.split(',') ?? [
    'http://localhost:3000',
    'http://localhost:3003',
  ];

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  // ─── Socket.io adapter (attached to same HTTP server) ──────────────
  app.useWebSocketAdapter(new IoAdapter(app));

  // ─── Start ──────────────────────────────────────────────────────────
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`🔌 Realtime gateway running on http://localhost:${port}`);
}

bootstrap();
