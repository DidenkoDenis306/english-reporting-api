import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Student } from '../students/students.model';

interface LessonCreationAttrs {
  studentId: number;
  lessonDate: Date;
  lessonNumber: number;
}

@Table({ tableName: 'lessons' })
export class Lesson extends Model<Lesson, LessonCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  lessonDate: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  lessonNumber: number;

  @ForeignKey(() => Student)
  @Column
  studentId: number;

  @BelongsTo(() => Student)
  student: Student;
}
