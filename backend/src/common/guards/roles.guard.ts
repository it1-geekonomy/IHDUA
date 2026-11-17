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

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(reflector: Reflector) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. If public route (marked with @Public()), allow immediately without auth/role check
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

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

    // 3. ADMIN role has unrestricted access across all endpoints
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // 4. Check explicit @Roles(...) decorator on method or controller class
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(user.role);
      if (!hasRole) {
        throw new ForbiddenException(
          `Access denied: role '${user.role}' does not have permission to access this resource`,
        );
      }
      return true;
    }

    // 5. Default access policy for unannotated protected endpoints:
    // Any authenticated user (ADMIN or CONTENT) is permitted to access general CMS modules
    // (Blogs & Stories, Our Impact, Content & Legal, Newsletter Subscribers, /auth/me).
    return true;
  }
}
