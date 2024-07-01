import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

enum Filter {
  Year = 'year',
  Month = 'month',
  Week = 'week',
}

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

    await this.cacheManager.del('all-students');
    await this.cacheManager.set(`student-${student.id}`, student, 600);

    return student;
  }

  async getAllStudents() {
    const cachedStudents = await this.cacheManager.get('all-students');

    if (cachedStudents) {
      return cachedStudents;
    }

    console.log('work');

    const students = await this.prisma.student.findMany();
    await this.cacheManager.set('all-students', students, 600);

    return students;
  }

  async getStudent(studentId: number, filter?: Filter) {
    const cachedStudent = await this.cacheManager.get(`student-${studentId}`);

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

    await this.cacheManager.set(`student-${studentId}`, student, 600);

    return student;
  }

  async deleteStudent(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (student) {
      await this.prisma.student.delete({
        where: { id: studentId },
      });
      await this.cacheManager.del(`student-${studentId}`);

      return studentId;
    }

    return null;
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
