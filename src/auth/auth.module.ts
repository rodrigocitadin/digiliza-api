import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt/dist';
import { jwtConstants } from './constants';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    PrismaService,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "7d" }
    })
  ]
})
export class AuthModule { }
