import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { TableModule } from './table/table.module';

@Module({
  imports: [UserModule, PrismaModule, TableModule],
})
export class AppModule {}
