import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { WhatsappSenderService } from '../whatsapp/whatsapp-sender.service';
import * as fs from 'fs';
import * as path from 'path';
import Redis from 'ioredis';

const UPLOAD_DIR = '/data/uploads/profiles';

/**
 * Profile Controller — GET and PATCH for user profile completion.
 *
 * GET  /api/auth/profile       → fetch user + isComplete
 * PATCH /api/auth/profile      → partial update + recalculate isComplete
 *
 * All endpoints require JWT (JwtAuthGuard).
 * Does NOT modify any existing auth endpoints.
 */
@Controller('auth/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  private redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappSender: WhatsappSenderService,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
    });
    this.redis.connect().catch((err) =>
      this.logger.error('Redis connection failed for ProfileController', err),
    );
  }

  // ─── GET /api/auth/profile ──────────────────────────────────────────────

  @Get()
  async getProfile(@Req() req: any) {
    const userid = BigInt(req.user.sub);

    const user = await this.prisma.user.findUnique({
      where: { userid },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      user: this.serializeUser(user),
      isComplete: this.checkComplete(user),
    };
  }

  // ─── PATCH /api/auth/profile ────────────────────────────────────────────

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Req() req: any, @Body() body: any) {
    const userid = BigInt(req.user.sub);

    // Verify user exists
    const existing = await this.prisma.user.findUnique({
      where: { userid },
      select: { userid: true },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    // Build update data — only include fields that are provided
    const data: Record<string, any> = {};

    // String fields
    if (body.fname !== undefined) data.fname = String(body.fname).trim();
    if (body.lname !== undefined) data.lname = String(body.lname).trim();
    if (body.qualification !== undefined)
      data.qualification = body.qualification ? String(body.qualification).trim() : null;
    if (body.experience !== undefined)
      data.experience = body.experience ? String(body.experience).trim() : null;
    if (body.pincode !== undefined)
      data.pincode = body.pincode ? String(body.pincode).trim() : null;
    if (body.countryCode !== undefined)
      data.countryCode = body.countryCode ? String(body.countryCode).trim().toUpperCase() : null;

    // UserType: BO, CL, GW, SA, AD
    if (body.usertype !== undefined) {
      const validTypes = ['BO', 'CL', 'GW', 'SA', 'AD'];
      if (body.usertype && !validTypes.includes(body.usertype)) {
        throw new BadRequestException(
          `Invalid usertype "${body.usertype}". Must be one of: BO, CL, GW.`,
        );
      }
      data.usertype = body.usertype || 'GW';
    }

    // Gender enum: M, F, T, O
    if (body.gender !== undefined) {
      const validGenders = ['M', 'F', 'T', 'O'];
      if (body.gender && !validGenders.includes(body.gender)) {
        throw new BadRequestException(
          `Invalid gender "${body.gender}". Must be one of: M, F, T, O.`,
        );
      }
      data.gender = body.gender || null;
    }

    // Date of birth — expects ISO date string or YYYY-MM-DD
    if (body.dob !== undefined) {
      if (body.dob) {
        const parsed = new Date(body.dob);
        if (isNaN(parsed.getTime())) {
          throw new BadRequestException('Invalid date of birth format.');
        }
        data.dob = parsed;
      } else {
        data.dob = null;
      }
    }

    // Language IDs — array of integers
    if (body.langid !== undefined) {
      if (!Array.isArray(body.langid)) {
        throw new BadRequestException('langid must be an array of integers.');
      }
      data.langid = body.langid.map((id: any) => parseInt(id, 10)).filter((n: number) => !isNaN(n));
    }

    // Integer foreign keys
    if (body.stateid !== undefined)
      data.stateid = body.stateid ? parseInt(body.stateid, 10) : null;
    if (body.districtid !== undefined)
      data.districtid = body.districtid ? parseInt(body.districtid, 10) : null;
    if (body.placeid !== undefined)
      data.placeid = body.placeid ? parseInt(body.placeid, 10) : null;

    // Email (direct update without OTP — OTP verified separately)
    if (body.email !== undefined)
      data.email = body.email ? String(body.email).trim().toLowerCase() : null;

    // Phone (direct update without OTP — OTP verified separately)
    if (body.phone !== undefined)
      data.phone = body.phone ? String(body.phone).trim() : null;

    // Prevent empty update
    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No valid fields provided for update.');
    }

    this.logger.log(`Updating profile for user ${userid}: ${Object.keys(data).join(', ')}`);

    const updated = await this.prisma.user.update({
      where: { userid },
      data,
    });

    return {
      success: true,
      user: this.serializeUser(updated),
      isComplete: this.checkComplete(updated),
    };
  }

  // ─── POST /api/auth/profile/photo ───────────────────────────────────────

  @Post('photo')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('photo', {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req: any, file: any, cb: any) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new BadRequestException('Only image files are allowed.'), false);
      }
      cb(null, true);
    },
  }))
  async uploadPhoto(@Req() req: any, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No photo file provided.');
    }

    const userid = req.user.sub;
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const filename = `${userid}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Ensure upload directory exists
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });

    // Write file to disk
    fs.writeFileSync(filepath, file.buffer);

    // Update user pic field in DB
    const picUrl = `/uploads/profiles/${filename}`;
    await this.prisma.user.update({
      where: { userid: BigInt(userid) },
      data: { pic: picUrl },
    });

    this.logger.log(`Photo uploaded for user ${userid}: ${picUrl}`);

    return {
      success: true,
      pic: picUrl,
    };
  }

  // ─── POST /api/auth/profile/send-otp ─────────────────────────────────────

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendProfileOtp(@Req() req: any, @Body() body: any) {
    const userid = req.user.sub;
    const { type, value } = body;

    if (!type || !['mobile', 'email'].includes(type)) {
      throw new BadRequestException('type must be "mobile" or "email".');
    }
    if (!value || !String(value).trim()) {
      throw new BadRequestException('value is required.');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `otp:profile:${userid}:${type}`;

    // Store in Redis with 120s TTL
    await this.redis.set(redisKey, otp, 'EX', 120);

    if (type === 'mobile') {
      // Send OTP via WhatsApp
      const phone = String(value).trim().replace(/\D/g, '');
      const message = `Your Saubh verification code is: ${otp}\nValid for 2 minutes. Do not share.`;
      this.whatsappSender.sendMessage(phone, message).catch((err) =>
        this.logger.error(`Failed to send profile OTP to ${phone}`, err),
      );
    } else {
      // Email OTP — TODO: integrate email service
      this.logger.log(`[EMAIL OTP] ${type} OTP for user ${userid}: ${otp}`);
    }

    return { success: true, sent: true, expiresIn: 120 };
  }

  // ─── POST /api/auth/profile/verify-otp ───────────────────────────────────

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyProfileOtp(@Req() req: any, @Body() body: any) {
    const userid = req.user.sub;
    const { type, value, otp } = body;

    if (!type || !['mobile', 'email'].includes(type)) {
      throw new BadRequestException('type must be "mobile" or "email".');
    }
    if (!value || !String(value).trim()) {
      throw new BadRequestException('value is required.');
    }
    if (!otp || !String(otp).trim()) {
      throw new BadRequestException('otp is required.');
    }

    const redisKey = `otp:profile:${userid}:${type}`;
    const stored = await this.redis.get(redisKey);

    if (!stored || stored !== String(otp).trim()) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    // OTP valid — delete key and update user field
    await this.redis.del(redisKey);

    const updateData: Record<string, any> = {};
    if (type === 'mobile') {
      updateData.phone = String(value).trim();
    } else {
      updateData.email = String(value).trim().toLowerCase();
    }

    await this.prisma.user.update({
      where: { userid: BigInt(userid) },
      data: updateData,
    });

    this.logger.log(`Profile ${type} verified for user ${userid}: ${value}`);

    return { success: true, verified: true };
  }

  // ─── Helpers ────────────────────────────────────────────────────────────

  /**
   * Check if all required profile fields are filled.
   * Required (16 fields): fname, lname, email, phone, pic, gender, dob,
   *   langid(>0), qualification, experience, usertype,
   *   countryCode, stateid, districtid, pincode, placeid
   */
  private checkComplete(user: any): boolean {
    return !!(
      user.fname &&
      user.lname &&
      user.email &&
      user.phone &&
      user.pic &&
      user.gender &&
      user.dob &&
      user.langid &&
      user.langid.length > 0 &&
      user.qualification &&
      user.experience &&
      user.usertype &&
      user.countryCode &&
      user.stateid &&
      user.districtid &&
      user.pincode &&
      user.placeid
    );
  }

  /**
   * Serialize user for JSON response.
   * BigInt fields → string. Excludes sensitive fields.
   */
  private serializeUser(user: any) {
    return {
      userid: user.userid.toString(),
      whatsapp: user.whatsapp,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      phone: user.phone,
      pic: user.pic,
      gender: user.gender,
      dob: user.dob,
      langid: user.langid,
      qualification: user.qualification,
      experience: user.experience,
      usertype: user.usertype,
      countryCode: user.countryCode,
      stateid: user.stateid,
      districtid: user.districtid,
      pincode: user.pincode,
      placeid: user.placeid ? user.placeid.toString() : null,
      verified: user.verified,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
