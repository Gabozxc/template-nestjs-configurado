import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthDto, LoginAuthDto } from './dto';
@Injectable({})
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  test(): string {
    return 'test';
  }
  async signin(user: LoginAuthDto) {
    try {
      const userLogin = await this.prisma.users.findUnique({
        where: {
          email: user.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
        },
      });
      if (!userLogin) {
        throw new ForbiddenException('El correo no existe.');
      }
      const isPasswordValid = await argon2.verify(
        userLogin.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new ForbiddenException('La contraseña es incorrecta.');
      }
      return this.signToken(userLogin.id, userLogin.email);
    } catch (err) {
      return err;
    }
  }
  async signup(dto: CreateAuthDto) {
    try {
      const hash = await argon2.hash(dto.password);
      const userLogin = await this.prisma.users.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      return this.signToken(userLogin.id, userLogin.email);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('El correo ya existe.');
        }
      }
      return err;
    }
  }
  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const access_token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '15m',
    });
    return {
      access_token,
    };
  }
}
