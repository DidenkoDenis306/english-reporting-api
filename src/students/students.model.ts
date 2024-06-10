import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Lesson } from '../lessons/lessons.model';

interface StudenCreationAttrs {
  firstName: string;
  lastName: string;
  age?: number;
  lessonsCount: number;
  lastLessonDate: Date;
  price: number;
  currency: 'USD' | 'UAH';
  isPrivate: boolean;
}

@Table({ tableName: 'students' })
export class Student extends Model<Student, StudenCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  age: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  lessonsCount: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastLessonDate: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency: 'UAH' | 'USD';

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isPrivate: boolean;

  @HasMany(() => Lesson)
  lessons: Lesson[];
}
