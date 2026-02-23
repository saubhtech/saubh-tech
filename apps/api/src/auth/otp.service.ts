import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a 4-digit OTP for the given WhatsApp number.
   * Stores passcode + passcode_expiry (NOW + 2 minutes) in public.user table.
   * Throws NotFoundException if the WhatsApp number is not registered.
   */
  async generateOTP(whatsapp: string): Promise<string> {
    // Generate 4-digit numeric code (0000–9999, zero-padded)
    const code = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    const expiry = new Date(Date.now() + 2 * 60 * 1000); // NOW + 2 minutes

    const result = await this.prisma.user.updateMany({
      where: { whatsapp },
      data: {
        passcode: code,
        passcodeExpiry: expiry,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException(
        `User with WhatsApp number ${whatsapp} not found. Please register first.`,
      );
    }

    return code;
  }

  /**
   * Verify OTP for the given WhatsApp number.
   * If valid: clears passcode + passcode_expiry, returns true.
   * If invalid or expired: returns false (never throws).
   */
  async verifyOTP(whatsapp: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { whatsapp },
      select: { userid: true, passcode: true, passcodeExpiry: true },
    });

    if (!user) return false;
    if (!user.passcode || !user.passcodeExpiry) return false;
    if (user.passcode !== code) return false;
    if (user.passcodeExpiry < new Date()) return false;

    // OTP valid — clear passcode fields
    await this.prisma.user.update({
      where: { whatsapp },
      data: {
        passcode: null,
        passcodeExpiry: null,
      },
    });

    return true;
  }
}
