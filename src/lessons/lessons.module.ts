import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService, PrismaService],
  imports: [],
})
export class LessonsModule {}
