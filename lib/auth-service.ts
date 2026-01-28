// lib/auth-service.ts
import Redis from 'ioredis';
import crypto from 'crypto';

const redis = new Redis(process.env.REDIS_URL!);

export const authService = {
  generatePassword(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  },

  validatePhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  },

  hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  },

  async storePassword(phoneNumber: string, password: string): Promise<void> {
    const hashedPassword = this.hashPassword(password);
    const key = `user:${phoneNumber}:password`;
    await redis.setex(key, 60 * 60 * 24 * 90, hashedPassword);
  },

  async verifyPassword(phoneNumber: string, password: string): Promise<boolean> {
    const key = `user:${phoneNumber}:password`;
    const storedHash = await redis.get(key);
    
    if (!storedHash) return false;
    
    const inputHash = this.hashPassword(password);
    return storedHash === inputHash;
  },

  async deletePassword(phoneNumber: string): Promise<void> {
    const key = `user:${phoneNumber}:password`;
    await redis.del(key);
  },

  async checkLoginAttempts(phoneNumber: string): Promise<boolean> {
    const key = `login:attempts:${phoneNumber}`;
    const attempts = await redis.get(key);
    return !attempts || parseInt(attempts) < 5;
  },

  async incrementLoginAttempts(phoneNumber: string): Promise<void> {
    const key = `login:attempts:${phoneNumber}`;
    const attempts = await redis.get(key);
    await redis.setex(key, 60 * 15, (parseInt(attempts || '0') + 1).toString());
  },

  async clearLoginAttempts(phoneNumber: string): Promise<void> {
    const key = `login:attempts:${phoneNumber}`;
    await redis.del(key);
  }
};