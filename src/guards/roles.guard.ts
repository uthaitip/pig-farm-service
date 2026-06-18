import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { JwtPayload } from 'src/libraries/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) return true;

    const res = context.switchToHttp().getResponse();
    const user = res.locals?.user as JwtPayload | undefined;

    if (!user?.roleCode) {
      throw new ForbiddenException('ไม่มีสิทธิ์เข้าถึง');
    }
    if (!requiredRoles.includes(user.roleCode)) {
      throw new ForbiddenException('ไม่มีสิทธิ์เข้าถึง');
    }
    return true;
  }
}
