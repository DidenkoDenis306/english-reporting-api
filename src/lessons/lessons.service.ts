import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { CreateLessonDto } from './dto/createLesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createLesson(dto: CreateLessonDto) {
    const student = await this.prisma.student.findUnique({
      where: {
        id: Number(dto.studentId),
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await this.cacheManager.del(`student-${student.id}`);

    const lessonNumber = student.lessonsCount + 1;

    const lesson = await this.prisma.lesson.create({
      data: {
        studentId: dto.studentId,
        teacherId: dto.teacherId,
        lessonDate: dto.lessonDate,
        lessonNumber,
        lessonContent: dto.lessonContent,
      },
    });

    await this.prisma.student.update({
      where: { id: Number(dto.studentId) },
      data: {
        lessonsCount: lessonNumber,
        lastLessonDate: dto.lessonDate,
      },
    });

    return lesson;
  }
}
