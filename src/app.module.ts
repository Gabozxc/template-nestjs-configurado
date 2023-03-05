import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { WarehouseModule } from './warehouse/warehouse.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, WarehouseModule, PrismaModule],
})
export class AppModule {}
