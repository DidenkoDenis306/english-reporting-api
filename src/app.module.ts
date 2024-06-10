import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentsModule } from './students/students.module';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { Student } from './students/students.model';
import { LessonsService } from './lessons/lessons.service';
import { LessonsController } from './lessons/lessons.controller';
import { LessonsModule } from './lessons/lessons.module';
import { Lesson } from './lessons/lessons.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Student, Lesson],
      autoLoadModels: true,
    }),
    StudentsModule,
    LessonsModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class AppModule {}
