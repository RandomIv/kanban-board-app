import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BoardModule } from './board/board.module';
import { CardModule } from './card/card.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot(), BoardModule, CardModule],
})
export class AppModule {}
