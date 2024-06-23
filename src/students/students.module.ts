import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, PrismaService],
  imports: [],
})
export class StudentsModule {}
