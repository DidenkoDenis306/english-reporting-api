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
  async getLessonById(lessonId: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: Number(lessonId) },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async createLesson(dto: CreateLessonDto) {
    const student = await this.prisma.student.findUnique({
      where: {
        id: Number(dto.studentId),
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await this.cacheManager.del(`student-${student.id}-no-filter`);

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

  async countLessons(
    period: 'month' | 'total',
    teacherId: number,
  ): Promise<number> {
    if (period === 'total') {
      return this.prisma.lesson.count({
        where: {
          teacherId: teacherId,
        },
      });
    } else if (period === 'month') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);

      return this.prisma.lesson.count({
        where: {
          teacherId: teacherId,
          lessonDate: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      });
    }

    return 0;
  }

  async togglePayLesson(lessonId: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: Number(lessonId) },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const updatedLesson = await this.prisma.lesson.update({
      where: { id: Number(lessonId) },
      data: { payed: !lesson.payed },
    });

    await this.cacheManager.del(`student-${lesson.studentId}-no-filter`);

    return updatedLesson;
  }
}
