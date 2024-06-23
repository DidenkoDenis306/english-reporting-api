export class CreateStudentDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly age?: number;
  readonly teacherId: number;
  readonly lessonsCount: number;
  readonly lastLessonDate: Date;
  readonly price: number;
  readonly currency: 'USD' | 'UAH';
  readonly isPrivate: boolean;
}
