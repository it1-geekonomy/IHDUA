import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isObservable, lastValueFrom } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * Routes restricted to ADMIN only (not accessible to CONTENT role).
 * Evaluated against request path without query string and optional '/api' prefix.
 */
const ADMIN_ONLY_PREFIXES = [
  '/donors',
  '/donations',
  '/leads-contact',
  '/leads-volunteer',
  '/partnership-inquiries',
  '/users',
];

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(reflector: Reflector) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 1. If public route (e.g. public website visitor submissions or reads), allow without token/role check
    if (isPublic) {
      return true;
    }

    // 2. Authenticate via Passport JWT
    const guardResult = super.canActivate(context);
    const authenticated = isObservable(guardResult)
      ? await lastValueFrom(guardResult)
      : await guardResult;

    if (!authenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }

    // 3. ADMIN role has unrestricted access to all APIs
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // 4. Check explicit @Roles(...) decorator if present
    const explicitRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (explicitRoles && explicitRoles.length > 0) {
      if (!explicitRoles.includes(user.role)) {
        throw new ForbiddenException(
          `Access denied: role '${user.role}' cannot access this resource`,
        );
      }
      return true;
    }

    // 5. Default path-based role enforcement:
    // Block CONTENT role from Financials, Leads/Inquiries, and Users
    const url = request.url || request.path || '';
    const cleanPath = url.split('?')[0].replace(/^\/api/, '');

    const isRestricted = ADMIN_ONLY_PREFIXES.some(
      (prefix) => cleanPath === prefix || cleanPath.startsWith(prefix + '/'),
    );

    if (isRestricted) {
      throw new ForbiddenException(
        `Access denied: role '${user.role}' cannot access this resource`,
      );
    }

    return true;
  }
}

