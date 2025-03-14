import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService, PrismaService],
})
export class CalendarModule {}
