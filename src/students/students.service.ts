import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Filter } from './enums/filters.enum';

@Injectable()
export class StudentsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
  ) {}

  async createStudent(dto: CreateStudentDto) {
    const student = await this.prisma.student.create({
      data: dto,
    });

    await this.cacheManager.del(`all-students-${dto.teacherId}`);
    await this.cacheManager.set(
      `student-${student.id}-no-filter`,
      student,
      600,
    );

    return student;
  }

  async getAllStudents(teacherId: number) {
    const cacheKey = `all-students-${teacherId}`;
    const cachedStudents = await this.cacheManager.get(cacheKey);

    if (cachedStudents) {
      return cachedStudents;
    }

    const students = await this.prisma.student.findMany({
      where: {
        teacherId: Number(teacherId),
      },
    });

    await this.cacheManager.set(cacheKey, students, 600);

    return students;
  }

  async getStudentById(studentId: number, filter?: Filter) {
    const cacheKey = `student-${studentId}-${filter || 'no-filter'}`;
    const cachedStudent = await this.cacheManager.get(cacheKey);

    if (cachedStudent) {
      return cachedStudent;
    }

    const student = await this.prisma.student.findUnique({
      where: { id: Number(studentId) },
      include: { lessons: true },
    });

    if (!student) {
      throw new NotFoundException('Student doesnt exist');
    }

    if (!student.lessons) {
      student.lessons = [];
    }

    if (filter) {
      const start = this.startOfPeriod(filter);
      student.lessons = student.lessons.filter(
        (lesson) => new Date(lesson.lessonDate) >= start,
      );
    }

    student.lessons.sort(
      (a, b) =>
        new Date(a.lessonDate).getTime() - new Date(b.lessonDate).getTime(),
    );

    await this.cacheManager.set(cacheKey, student, 600);

    return student;
  }

  async deleteStudent(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: Number(studentId) },
    });

    if (student) {
      await this.prisma.student.delete({
        where: { id: Number(studentId) },
      });

      await this.cacheManager.del(`student-${studentId}`);
      // TODO: make dynamic
      await this.cacheManager.del(`all-students-1`);

      return studentId;
    }

    return null;
  }

  async getStudentDebt(
    studentId: number,
  ): Promise<{ debt: number; currency: string }> {
    const student = await this.prisma.student.findUnique({
      where: { id: Number(studentId) },
      include: { lessons: true },
    });

    if (!student) {
      throw new NotFoundException('Student does not exist');
    }

    const unpaidLessons = student.lessons.filter((lesson) => !lesson.payed);
    const debt = unpaidLessons.length * student.price;

    return {
      debt,
      currency: student.currency,
    };
  }

  private startOfPeriod(filter: Filter): Date {
    const now = new Date();
    switch (filter) {
      case Filter.Year:
        return new Date(now.getFullYear(), 0, 1);
      case Filter.Month:
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case Filter.Week:
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return startOfWeek;
      default:
        return new Date();
    }
  }
}
