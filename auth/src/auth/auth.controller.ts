// import { Body, Controller, Post, HttpCode, HttpStatus, BadRequestException, InternalServerErrorException, UseInterceptors } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { RpcException, MessagePattern } from '@nestjs/microservices';
// import { Public } from './public';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Public()
  // @Post('signup')
  @MessagePattern({ cmd: 'signup' })
  async signUp(signInDto: SignInDto) {
    try {
      return await this.authService.signUp(signInDto);
    } catch (e) {
      if (/name.*already exists/.test(e.detail)) {
        throw new RpcException('Username exists');
      }
      throw new RpcException('Service error');
    }
  }

  // @Public()
  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  @MessagePattern({ cmd: 'signin' })
  async signIn(signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @MessagePattern({ cmd: 'check' })
  async verify({ jwtToken }: { jwtToken: string }) {
    console.log('verify');
    return this.authService.verify(jwtToken);
  }
}
