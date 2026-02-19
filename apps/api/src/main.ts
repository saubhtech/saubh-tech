import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─── Global prefix ──────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ─── CORS ───────────────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  });

  // ─── Validation ─────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ─── Rate limiting ──────────────────────────────────────────────────
  // TODO: Add @nestjs/throttler in Phase 2
  // import { ThrottlerGuard } from '@nestjs/throttler';
  // app.useGlobalGuards(new ThrottlerGuard());

  // ─── Start ──────────────────────────────────────────────────────────
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}/api`);
}

bootstrap();
