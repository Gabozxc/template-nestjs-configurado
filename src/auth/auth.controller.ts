import { AuthService } from './auth.service';
import { Controller, Post, Body } from '@nestjs/common';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() user: AuthDto) {
    return this.authService.signup(user);
  }
  @Post('signin')
  signin() {
    return this.authService.login();
  }
}
