import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string): Promise<Omit<User, "password"> | null> {
    const user = await this.userService.findToLogin(email);

    const matchPassword = await bcrypt.compare(password, user.password);

    if (user && matchPassword) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }
}
