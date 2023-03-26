import { AuthService } from './auth.service';
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateAuthDto, LoginAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() user: CreateAuthDto) {
    return this.authService.signup(user);
  }
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() user: LoginAuthDto) {
    return this.authService.signin(user);
  }
}
