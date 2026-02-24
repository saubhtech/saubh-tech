import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { WhatsappAuthService } from './whatsapp-auth.service';
import { normalizeWhatsApp } from './normalize-phone';
import { AuthRateLimitGuard } from './rate-limit.guard';

@Controller('auth/whatsapp')
@UseGuards(AuthRateLimitGuard)
export class WhatsappAuthController {
  constructor(private readonly authService: WhatsappAuthService) {}

  /**
   * POST /auth/whatsapp/register
   */
  @Post('register')
  async register(
    @Body() body: { whatsapp?: string; fname?: string; usertype?: string },
  ) {
    const { whatsapp, fname, usertype } = body;

    if (!whatsapp || !whatsapp.trim()) {
      throw new BadRequestException('WhatsApp number is required.');
    }

    // Sanitize & validate phone
    const normalized = normalizeWhatsApp(whatsapp);
    if (normalized.length < 10 || normalized.length > 15 || !/^\d+$/.test(normalized)) {
      throw new BadRequestException('Invalid WhatsApp number.');
    }

    // Sanitize name — strip HTML/script, limit length
    const rawName = (fname || '').trim();
    if (!rawName) {
      throw new BadRequestException('First name is required.');
    }
    const safeName = rawName
      .replace(/<[^>]*>/g, '')   // strip HTML tags
      .replace(/[^\p{L}\p{N}\s.\-']/gu, '') // allow letters, numbers, spaces, dots, hyphens, apostrophes
      .slice(0, 50);             // max 50 chars

    if (!safeName) {
      throw new BadRequestException('Invalid name.');
    }

    const validTypes = ['BO', 'CL', 'GW'];
    const ut = usertype?.toUpperCase() || 'GW';
    if (!validTypes.includes(ut)) {
      throw new BadRequestException(
        `Invalid usertype "${usertype}". Must be one of: BO, CL, GW.`,
      );
    }

    const user = await this.authService.registerUser(normalized, safeName, ut);

    return {
      success: true,
      user: this.serializeUser(user),
    };
  }

  /**
   * POST /auth/whatsapp/request-otp
   */
  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() body: { whatsapp?: string }) {
    const { whatsapp } = body;

    if (!whatsapp || !whatsapp.trim()) {
      throw new BadRequestException('WhatsApp number is required.');
    }

    const normalized = normalizeWhatsApp(whatsapp);
    if (normalized.length < 10 || normalized.length > 15 || !/^\d+$/.test(normalized)) {
      throw new BadRequestException('Invalid WhatsApp number.');
    }

    await this.authService.requestOTP(normalized);

    return {
      success: true,
      expiresIn: 120,
    };
  }

  /**
   * POST /auth/whatsapp/verify-otp
   */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() body: { whatsapp?: string; otp?: string; passcode?: string },
  ) {
    const { whatsapp } = body;
    const code = body.otp ?? body.passcode;

    if (!whatsapp || !whatsapp.trim()) {
      throw new BadRequestException('WhatsApp number is required.');
    }

    const normalized = normalizeWhatsApp(whatsapp);
    if (normalized.length < 10 || normalized.length > 15 || !/^\d+$/.test(normalized)) {
      throw new BadRequestException('Invalid WhatsApp number.');
    }

    if (!code || !code.trim()) {
      throw new BadRequestException('OTP or passcode is required.');
    }

    // Strict: only 4 digits allowed
    const cleanCode = code.trim();
    if (!/^\d{4}$/.test(cleanCode)) {
      throw new BadRequestException('Passcode must be exactly 4 digits.');
    }

    const result = await this.authService.loginWithOTP(normalized, cleanCode);

    if (!result) {
      throw new BadRequestException('Invalid or expired OTP/passcode.');
    }

    return {
      success: true,
      token: result.token,
      user: this.serializeUser(result.user),
    };
  }

  /**
   * POST /auth/whatsapp/logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { success: true };
  }

  private serializeUser(user: any) {
    return {
      userid: user.userid.toString(),
      whatsapp: user.whatsapp,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      usertype: user.usertype,
      status: user.status,
    };
  }
}
