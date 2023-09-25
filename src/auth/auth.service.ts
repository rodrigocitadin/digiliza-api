import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<{ id: string, username: string }> {
    const user = await this.userService.findToLogin(username);

    const matchPassword = await bcrypt.compare(password, user.password);

    if (user && matchPassword) {
      const { id, email } = user;

      return { id, username: email };
    }

    return null;
  }

  async login(user: { id: string, username: string }) {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
