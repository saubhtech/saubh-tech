import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { WhatsappAuthService } from './whatsapp-auth.service';

@Controller('auth/whatsapp')
export class WhatsappAuthController {
  constructor(private readonly authService: WhatsappAuthService) {}

  /**
   * POST /auth/whatsapp/register
   * Register a new user via WhatsApp number.
   * Returns 201 on new registration, 200 with existing user if already registered.
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
      whatsapp.trim(),
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
   * Request OTP for an existing user.
   * 200 on success, 404 if not registered, 429 if rate limited.
   */
  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() body: { whatsapp?: string }) {
    const { whatsapp } = body;

    if (!whatsapp || !whatsapp.trim()) {
      throw new BadRequestException('WhatsApp number is required.');
    }

    await this.authService.requestOTP(whatsapp.trim());

    return {
      success: true,
      expiresIn: 120,
    };
  }

  /**
   * POST /auth/whatsapp/verify-otp
   * Verify OTP and return JWT token.
   * 200 on success, 400 if invalid/expired OTP.
   */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() body: { whatsapp?: string; passcode?: string }) {
    const { whatsapp, passcode } = body;

    if (!whatsapp || !whatsapp.trim()) {
      throw new BadRequestException('WhatsApp number is required.');
    }

    if (!passcode || !passcode.trim()) {
      throw new BadRequestException('Passcode is required.');
    }

    const result = await this.authService.loginWithOTP(
      whatsapp.trim(),
      passcode.trim(),
    );

    if (!result) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    return {
      success: true,
      token: result.token,
      user: this.serializeUser(result.user),
    };
  }

  /**
   * POST /auth/whatsapp/logout
   * Client handles cookie deletion. Server just confirms.
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
