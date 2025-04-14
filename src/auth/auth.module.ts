import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './constants/constants';
import { JwtModule } from '@nestjs/jwt';
@Module({
imports: [UserModule,
JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1d'},
})
],
controllers: [AuthController],
providers: [AuthService],
exports: [AuthService]
})
export class AuthModule {}