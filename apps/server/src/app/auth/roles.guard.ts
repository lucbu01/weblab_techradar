import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user ?? {};

    const roles: string[] = Array.isArray(user.roles) ? user.roles : [];

    return requiredRoles.some((r) => roles.includes(r));
  }
}
