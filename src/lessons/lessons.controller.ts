import {
  Body,
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/createLesson.dto';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Post()
  create(@Body() lessonDto: CreateLessonDto) {
    return this.lessonsService.createLesson(lessonDto);
  }

  @Patch(':id/toggle-pay')
  togglePayLesson(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.togglePayLesson(id);
  }

  @Get('count')
  async countLessons(
    @Query('period') period: 'month' | 'total',
    @Query('teacherId') teacherId: string,
  ) {
    const teacherIdParsed = parseInt(teacherId, 10);
    if (isNaN(teacherIdParsed)) {
      throw new Error('Некорректный ID учителя');
    }

    return this.lessonsService.countLessons(period, teacherIdParsed);
  }

  @Get(':id')
  getLessonById(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.getLessonById(id);
  }
}
