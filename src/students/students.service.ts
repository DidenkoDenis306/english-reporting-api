import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

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

  async getStudent(studentId: number) {
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
}
