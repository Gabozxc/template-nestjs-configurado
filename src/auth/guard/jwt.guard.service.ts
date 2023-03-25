import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuardService extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
