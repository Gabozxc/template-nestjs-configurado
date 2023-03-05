import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthDto, LoginAuthDto } from './dto';
@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
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
      console.log(userLogin);
      const isPasswordValid = await argon2.verify(
        userLogin.password,
        user.password,
      );
      if (!isPasswordValid) {
        console.log('password incorrecto');
        throw new ForbiddenException('La contraseña es incorrecta.');
      }
      delete userLogin.password;
      return userLogin;
    } catch (err) {
      return err;
    }
  }
  async signup(dto: CreateAuthDto) {
    try {
      const hash = await argon2.hash(dto.password);
      const user = await this.prisma.users.create({
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
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('El correo ya existe.');
        }
      }
      return err;
    }
  }
}
