import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedUser } from './keycloak.strategy';

// ─── Role Constants ────────────────────────────────────────────────────────
export const SUPER_ADMIN = 'SUPER_ADMIN';
export const ADMIN = 'ADMIN';
export const MASTER_DATA_MANAGER = 'MASTER_DATA_MANAGER';

// ─── @Roles() Decorator ────────────────────────────────────────────────────
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// ─── Keycloak Auth Guard (validates JWT) ───────────────────────────────────
@Injectable()
export class KeycloakAuthGuard extends AuthGuard('keycloak') {}

// ─── Roles Guard (checks roles after JWT validated) ────────────────────────
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No @Roles() decorator → allow access (JWT still required via AuthGuard)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('No roles found in token');
    }

    // SUPER_ADMIN can access everything
    if (user.roles.includes(SUPER_ADMIN)) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        `Requires one of: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
