import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signInDto: SignInDto) {
    console.log('signup');
    return this.usersService.create(signInDto);
  }

  async signIn({ name, password }: SignInDto): Promise<any> {
    const user = await this.usersService.findOne(name);

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verify(jwtToken: string) {
    return this.jwtService.verifyAsync(jwtToken, {
      secret: process.env.JWT_SECRET,
    });
  }
}
