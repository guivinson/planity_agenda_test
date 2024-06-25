export type CalendarEvent = {
  id: number,
  start: string,
  duration: number,
}

export type CalendarEventTransformed = CalendarEvent & {
  startDate: Date,
  endDate: Date,
}