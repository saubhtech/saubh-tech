import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// ─── BigInt JSON serialization ────────────────────────────────────────────
// Prisma returns BigInt for bigint/bigserial columns (e.g. placeid, userid).
// JSON.stringify() cannot serialize BigInt natively and throws TypeError.
// This polyfill converts BigInt to Number (safe up to 2^53) or String.
(BigInt.prototype as unknown as { toJSON: () => unknown }).toJSON = function () {
  const val = this as unknown as bigint;
  // Safe integer range: return as number for cleaner JSON
  if (val >= Number.MIN_SAFE_INTEGER && val <= Number.MAX_SAFE_INTEGER) {
    return Number(val);
  }
  // Beyond safe range: return as string
  return val.toString();
};

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
