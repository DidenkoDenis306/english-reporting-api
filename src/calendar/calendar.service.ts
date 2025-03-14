import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getLessonsCalendar(
    startDate: Date,
    endDate: Date,
    timezone = 'UTC',
    hiddenStudentIds: number[] = [],
  ) {
    const startOfDay = moment.tz(startDate, timezone).startOf('day').toDate();
    const endOfDay = moment.tz(endDate, timezone).endOf('day').toDate();

    // TODO: add cashing
    const lessons = await this.prisma.lesson.findMany({
      where: {
        lessonDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        students: true,
      },
    });

    const calendar: Record<string, Record<string, number>> = {};

    // console.log('lessons', lessons);

    lessons.forEach((lesson) => {
      if (hiddenStudentIds.includes(lesson.students.id)) {
        return; // Пропускаем этот урок
      }

      const dateKey = moment
        .utc(lesson.lessonDate)
        .tz(timezone)
        .startOf('day')
        .add(1, 'day')
        .format('YYYY-MM-DD');

      const studentName = `${lesson.students?.firstName || 'Unknown'} ${lesson.students?.lastName}`;

      if (!calendar[dateKey]) {
        calendar[dateKey] = {};
      }

      if (!calendar[dateKey][studentName]) {
        calendar[dateKey][studentName] = 0;
      }

      calendar[dateKey][studentName] += 1;
    });

    return calendar;
  }
}
