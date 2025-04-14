import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorador';
import { Role } from './rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Si no se requiere rol, permitir acceso
    }

    const { user } = context.switchToHttp().getRequest();

    // Verificar que el usuario esté presente y tenga roles definidos
    if (!user || !user.roles) {
      return false;  // Si no hay usuario o no tiene roles, negar el acceso
    }

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
