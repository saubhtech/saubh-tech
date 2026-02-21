import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SUPPORTED_LOCALES } from '../constants/locales';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get current user profile.
   * Scoped by businessId for tenant safety.
   */
  async getMe(userId: bigint, businessId: string) {
    const membership = await this.prisma.userMembership.findFirst({
      where: { userId, businessId },
      include: {
        user: {
          select: {
            userid: true,
            whatsapp: true,
            fname: true,
            email: true,
            phone: true,
            pic: true,
            gender: true,
            dob: true,
            langid: true,
            status: true,
            createdAt: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!membership) {
      throw new NotFoundException(
        'User not found in this business context',
      );
    }

    return {
      ...membership.user,
      role: membership.role,
      business: membership.business,
    };
  }

  /**
   * Update user language preference (langid array).
   * Validates locale against SUPPORTED_LOCALES.
   * Scoped by businessId for tenant safety.
   */
  async updatePreferences(
    userId: bigint,
    businessId: string,
    dto: UpdatePreferencesDto,
  ) {
    // Validate locale
    if (
      !SUPPORTED_LOCALES.includes(dto.preferred_locale as any)
    ) {
      throw new BadRequestException(
        `Invalid locale '${dto.preferred_locale}'. Supported: ${SUPPORTED_LOCALES.join(', ')}`,
      );
    }

    // Verify user belongs to this business
    const membership = await this.prisma.userMembership.findFirst({
      where: { userId, businessId },
    });

    if (!membership) {
      throw new NotFoundException(
        'User not found in this business context',
      );
    }

    // Note: preferredLocale no longer exists on User.
    // Language preferences are stored in langid (int[]).
    // For now, return user profile as acknowledgment.
    const user = await this.prisma.user.findUnique({
      where: { userid: userId },
      select: {
        userid: true,
        whatsapp: true,
        fname: true,
        email: true,
        langid: true,
      },
    });

    return user;
  }
}
