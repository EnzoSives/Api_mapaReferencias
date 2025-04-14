import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/roles/roles.decorador';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register({ name, password, email, rol }: RegisterDto) {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('El usuario ya existe');
    }

    if (!password) {
      throw new BadRequestException('La contraseña es requerida');
    }

    return await this.userService.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      rol,
    });
  }
  async login({ name, password }: LoginDto) {
    // Busca al usuario por username en lugar de email
    const user = await this.userService.findByUsernameWithPassword(name);

    if (!user) {
      throw new UnauthorizedException('Nombre de usuario incorrecto');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    console.log(user.rol); // Verifica que el rol esté correctamente asignado

    // Incluye el rol en el payload del JWT
    const payload = { username: user.name, rol: user.rol }; // Cambiado a username
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token, // Token con el rol incluido
      username: user.name, // Nombre de usuario en lugar de email
      rol: user.rol, // Incluye explícitamente el rol en la respuesta
    };
  }

  async getUserByToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token);
      const { email } = decodedToken;
      return this.findUserByEmail(email);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async findUserByEmail(email: string) {
    return this.userService.findOneByEmail(email);
  }
}
