import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/**
 * JWT Auth Guard — verifies Bearer token from Authorization header.
 * Uses raw `jsonwebtoken` (same lib as WhatsappAuthService).
 *
 * On success: sets req.user = { sub: string, whatsapp: string, usertype: string }
 * On failure: throws UnauthorizedException (401).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'changeme-not-secure';
  }

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    try {
      const payload = jwt.verify(token, this.secret) as jwt.JwtPayload;

      // Attach decoded user to request — BigInt userid as string
      req.user = {
        sub: payload.sub?.toString(),
        whatsapp: payload.whatsapp,
        usertype: payload.usertype,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
