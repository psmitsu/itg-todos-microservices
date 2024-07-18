import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from './public';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() signInDto: SignInDto) {
    console.log('signUp');
    try {
      return await this.authService.signUp(signInDto);
      // TODO: catch RPC error
    } catch (e) {
      if (/name.*already exists/.test(e.detail)) {
        throw new BadRequestException('Username exists');
      }
      throw new InternalServerErrorException();
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
