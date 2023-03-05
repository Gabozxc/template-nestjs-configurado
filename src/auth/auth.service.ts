import { AuthDto } from './dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  test(): string {
    return 'test';
  }
  login() {
    return 'login';
  }
  async signup(dto: AuthDto) {
    const hash = await argon2.hash(dto.password);
    const user = await this.prisma.users.create({
      data: {
        name: dto.username,
        email: dto.email,
        password: hash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return user;
  }
}
