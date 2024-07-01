import { IsInt, IsString, IsDate } from 'class-validator';

export class CreateLessonDto {
  @IsDate()
  lessonDate: Date;

  @IsInt()
  studentId: number;

  @IsInt()
  teacherId: number;

  @IsString()
  lessonContent: string;
}
