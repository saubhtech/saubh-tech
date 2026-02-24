import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { WhatsappAuthService } from './whatsapp-auth.service';
import { normalizeWhatsApp } from './normalize-phone';

@Controller('auth/whatsapp')
export class WhatsappAuthController {
  constructor(private readonly authService: WhatsappAuthService) {}

  /**
   * POST /auth/whatsapp/register
   * Register a new user. Static passcode = last 4 digits of number.
   */
  @Post('register')
  async register(
    @Body() body: { whatsapp?: string; fname?: string; usertype?: string },
  ) {
    const { whatsapp, fname, usertype } = body;

    if (!whatsapp || !whatsapp.trim()) {
      throw new BadRequestException('WhatsApp number is required.');
    }

    if (!fname || !fname.trim()) {
      throw new BadRequestException('First name is required.');
    }

    const validTypes = ['BO', 'CL', 'GW'];
    const ut = usertype?.toUpperCase() || 'GW';

    if (!validTypes.includes(ut)) {
      throw new BadRequestException(
        `Invalid usertype "${usertype}". Must be one of: BO, CL, GW.`,
      );
    }

    const user = await this.authService.registerUser(
      normalizeWhatsApp(whatsapp),
      fname.trim(),
      ut,
    );

    return {
      success: true,
      user: this.serializeUser(user),
    };
  }

  /**
   * POST /auth/whatsapp/request-otp
   * Request OTP (Redis, 120s TTL). 404 if not registered, 429 if rate limited.
   */
  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() body: { whatsapp?: string }) {
    const { whatsapp } = body;

    if (!whatsapp || !whatsapp.trim()) {
      throw new BadRequestException('WhatsApp number is required.');
    }

    await this.authService.requestOTP(normalizeWhatsApp(whatsapp));

    return {
      success: true,
      expiresIn: 120,
    };
  }

  /**
   * POST /auth/whatsapp/verify-otp
   * Verify OTP (Redis) or static passcode (Prisma) and return JWT.
   * Accepts BOTH: { otp: "1234" } and { passcode: "1234" }
   */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() body: { whatsapp?: string; otp?: string; passcode?: string },
  ) {
    const { whatsapp } = body;
    const code = body.otp ?? body.passcode; // Frontend sends "otp", legacy sends "passcode"

    if (!whatsapp || !whatsapp.trim()) {
      throw new BadRequestException('WhatsApp number is required.');
    }

    if (!code || !code.trim()) {
      throw new BadRequestException('OTP or passcode is required.');
    }

    const result = await this.authService.loginWithOTP(
      normalizeWhatsApp(whatsapp),
      code.trim(),
    );

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

  /**
   * Serialize user for JSON response (BigInt → string).
   */
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
