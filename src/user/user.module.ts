import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtGuardService } from '../auth/guard';

@Module({
  controllers: [UserController],
  providers: [JwtGuardService],
})
export class UserModule {}
