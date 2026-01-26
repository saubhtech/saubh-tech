import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

const OTP_EXPIRY = 600; // 10 minutes in seconds
const MAX_ATTEMPTS = 3;

export const otpService = {
  /**
   * Store OTP in Redis
   */
  async storeOTP(phoneNumber: string, otp: string): Promise<void> {
    const key = `otp:${phoneNumber}`;
    const attemptsKey = `otp:attempts:${phoneNumber}`;
    
    await redis.setex(key, OTP_EXPIRY, otp);
    await redis.setex(attemptsKey, OTP_EXPIRY, MAX_ATTEMPTS.toString());
    
    console.log(`OTP stored for ${phoneNumber}`);
  },

  /**
   * Verify OTP
   */
  async verifyOTP(phoneNumber: string, otp: string): Promise<boolean> {
    const key = `otp:${phoneNumber}`;
    const attemptsKey = `otp:attempts:${phoneNumber}`;
    
    const storedOTP = await redis.get(key);
    const remainingAttempts = await redis.get(attemptsKey);
    
    if (!storedOTP) {
      return false; // OTP expired or not found
    }
    
    if (!remainingAttempts || parseInt(remainingAttempts) <= 0) {
      return false; // No attempts left
    }
    
    // Decrement attempts
    await redis.decr(attemptsKey);
    
    if (storedOTP === otp) {
      // OTP is correct, delete it
      await redis.del(key);
      await redis.del(attemptsKey);
      return true;
    }
    
    return false;
  },

  /**
   * Get remaining OTP attempts
   */
  async getRemainingAttempts(phoneNumber: string): Promise<number> {
    const attemptsKey = `otp:attempts:${phoneNumber}`;
    const attempts = await redis.get(attemptsKey);
    return attempts ? parseInt(attempts) : 0;
  },

  /**
   * Delete OTP (for cleanup)
   */
  async deleteOTP(phoneNumber: string): Promise<void> {
    const key = `otp:${phoneNumber}`;
    const attemptsKey = `otp:attempts:${phoneNumber}`;
    
    await redis.del(key);
    await redis.del(attemptsKey);
  },
};

export default redis;