import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: {
    sub: string;
    email: string;
    iat: number;
    exp: number;
  }) {
    // valide return value in @Req() req: Request
    // we can return a user object or a user id using prisma in the request
    const user = await this.prismaService.users.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    const userLogin = {
      id: user.id,
      email: user.email,
      name: user.name,
      exp: payload.exp,
    };
    return userLogin;
  }
}
