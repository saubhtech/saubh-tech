import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { WhatsappAuthService } from './whatsapp-auth.service';
import { normalizeWhatsApp } from './normalize-phone';
import { AuthRateLimitGuard } from './rate-limit.guard';

@Controller('auth/whatsapp')
@UseGuards(AuthRateLimitGuard)
export class WhatsappAuthController {
  private readonly logger = new Logger(WhatsappAuthController.name);

  constructor(private readonly authService: WhatsappAuthService) {}

  /**
   * POST /auth/whatsapp/register
   *
   * New user: creates account, sends welcome with static passcode.
   * Existing user: generates OTP, sends welcome-back message.
   * Both sends are awaited — returns error if WhatsApp delivery fails.
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

    try {
      const { user, isNew } = await this.authService.registerUser(normalized, safeName, ut);

      return {
        success: true,
        isNew,
        user: this.serializeUser(user),
        message: isNew
          ? `Welcome ${safeName}! Check WhatsApp for your passcode.`
          : `Welcome back! Check WhatsApp for your one-time login code.`,
      };
    } catch (err: any) {
      // Re-throw NestJS HttpExceptions (rate limit, etc.)
      if (err?.status) throw err;

      // WhatsApp send failure
      this.logger.error(`Register: WhatsApp send failed for ${normalized}: ${err.message}`);
      throw new InternalServerErrorException(
        'Could not send message via WhatsApp. Please try again in a moment.',
      );
    }
  }

  /**
   * POST /auth/whatsapp/request-otp
   *
   * Generates OTP, sends via WhatsApp (awaited).
   * Returns error if user not found or WhatsApp delivery fails.
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

    try {
      await this.authService.requestOTP(normalized);

      return {
        success: true,
        expiresIn: 120,
      };
    } catch (err: any) {
      // Re-throw NestJS HttpExceptions (not found, rate limit, etc.)
      if (err?.status) throw err;

      // WhatsApp send failure
      this.logger.error(`Request OTP: WhatsApp send failed for ${normalized}: ${err.message}`);
      throw new InternalServerErrorException(
        'Could not send OTP via WhatsApp. Please try again in a moment.',
      );
    }
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
