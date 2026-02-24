import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || '',
  db: 0,
  lazyConnect: true,
  retryStrategy: (times) => Math.min(times * 200, 5000),
});

redis.connect().catch(err => {
  console.error('Redis connection failed:', err.message);
});

/**
 * Store OTP in Redis with 120s TTL.
 * Uses same key format as NestJS OtpService: otp:wa:{number}
 */
export async function storeOTP(whatsapp, otp) {
  try {
    await redis.set(`otp:wa:${whatsapp}`, otp, 'EX', 120);
    return true;
  } catch (err) {
    console.error('Redis storeOTP failed:', err.message);
    return false;
  }
}

/**
 * Rate limit: max 3 OTP requests per minute per number.
 * Same logic as NestJS OtpService.
 */
export async function checkRateLimit(whatsapp) {
  try {
    const key = `ratelimit:otp:${whatsapp}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60);
    return count <= 3;
  } catch (err) {
    console.error('Redis rate limit check failed:', err.message);
    return true; // allow on failure
  }
}

export default redis;
