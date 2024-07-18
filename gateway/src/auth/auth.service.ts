import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private usersClient: ClientProxy) {}

  async signUp(signInDto: SignInDto) {
    return this.usersClient.send({ cmd: 'signup' }, signInDto);
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    return this.usersClient.send({ cmd: 'signin' }, signInDto);
  }
}
