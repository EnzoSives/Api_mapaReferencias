import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { Request } from 'express';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    /* El siguiente método es la parte central del guardia de
    autenticación. AuthGuard implementa la interfaz CanActivate de NestJS.
    Esta función es llamada automáticamente por NestJS antes de permitir el
    acceso a una ruta protegida. */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }
    /* Este es un método privado utilizado por canActivate para extraer
el token de autorización del encabezado "Authorization" de la solicitud
HTTP. Si el encabezado de autorización no está presente o no contiene
el formato adecuado, este método devuelve undefined.*/
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ??
            [];
        return type === 'Bearer' ? token : undefined;
    }
}