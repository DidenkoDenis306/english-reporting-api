import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}
  @Post()
  create(@Body() studentDto: CreateStudentDto) {
    return this.studentsService.createStudent(studentDto);
  }

  @Get()
  getAll() {
    return this.studentsService.getAllStudents();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.studentsService.getStudent(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.studentsService.getStudent(id);
  }
}
