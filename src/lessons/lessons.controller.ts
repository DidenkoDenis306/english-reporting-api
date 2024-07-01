import { Body, Controller, Post } from '@nestjs/common';
import { CreateLessonDto } from './dto/createLesson.dto';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Post()
  create(@Body() lessonDto: CreateLessonDto) {
    return this.lessonsService.createLesson(lessonDto);
  }
}
