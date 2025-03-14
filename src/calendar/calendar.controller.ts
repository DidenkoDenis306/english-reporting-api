import { Controller, Get, Query } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Get()
  getCalendarData(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('hiddenStudents') hiddenStudents: string, // Новый параметр
  ) {
    const startDateParsed = new Date(startDate);
    const endDateParsed = new Date(endDate);

    // Парсим параметр hiddenStudents в массив чисел
    const hiddenStudentIds = hiddenStudents
      ? hiddenStudents
          .split(',')
          .map((id) => parseInt(id, 10))
          .filter((id) => !isNaN(id))
      : [];

    return this.calendarService.getLessonsCalendar(
      startDateParsed,
      endDateParsed,
      'UTC',
      hiddenStudentIds,
    );
  }
}
