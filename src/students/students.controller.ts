import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { Filter } from './enums/filters.enum';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}
  @Post()
  create(@Body() studentDto: CreateStudentDto) {
    return this.studentsService.createStudent(studentDto);
  }

  @Get('teacher/:teacherId')
  getAll(@Param('teacherId') teacherId: number) {
    return this.studentsService.getAllStudents(teacherId);
  }

  @Get(':id')
  getOne(@Param('id') id: number, @Query('filter') filter?: Filter) {
    return this.studentsService.getStudentById(id, filter);
  }

  @Get(':id/debt')
  getDebt(@Param('id') id: number) {
    return this.studentsService.getStudentDebt(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.studentsService.deleteStudent(id);
  }
}
