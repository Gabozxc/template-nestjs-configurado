import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtGuardService } from './../auth/guard/';
import { userRequestJWTValidate } from './dto';
import { GetUser } from '../auth/decorator/';
@UseGuards(JwtGuardService)
@Controller('user')
export class UserController {
  @Get('test')
  getMe(@GetUser() user: userRequestJWTValidate) {
    return user;
  }
}
