import { Injectable } from '@nestjs/common';
import { Student } from './students.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStudentDto } from './dto/create-student.dto';
import { Lesson } from '../lessons/lessons.model';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student) private studentRepository: typeof Student,
  ) {}
  async createStudent(dto: CreateStudentDto) {
    return await this.studentRepository.create(dto);
  }

  async getAllStudents() {
    return await this.studentRepository.findAll();
  }

  async getStudent(studentId: number) {
    return await this.studentRepository.findByPk(studentId, {
      include: [Lesson],
    });
  }

  async deleteStudent(studentId: number) {
    const student = await this.studentRepository.findByPk(studentId);

    await student.destroy();

    return studentId;
  }
}
