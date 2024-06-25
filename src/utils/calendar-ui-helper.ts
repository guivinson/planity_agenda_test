import { CalendarEvent, CalendarEventTransformed } from "@/model/calendar-event";

export const TIME_TICK = 5;

export function findEventColumn(calendar: number[][], event: CalendarEventTransformed): number {
  let startingRowIndex = timeStringToIndex(event.start);
  return calendar[startingRowIndex].findIndex(id => id === event.id);
}

export function findEventWidth(events: CalendarEventTransformed[], calendar: number[][], event: CalendarEventTransformed, alreadyCheckedEvents: number[] = []): number {
  let startingRowIndex = timeStringToIndex(event.start);
  let maxEventsInRow = 0;
  let conflictingEvents = new Set<number>();
  for (let rowIndex = startingRowIndex; rowIndex < startingRowIndex + (event.duration / TIME_TICK); rowIndex++) {
    maxEventsInRow = Math.max(maxEventsInRow, calendar[rowIndex].length)
    calendar[rowIndex].forEach(conflictingEvents.add, conflictingEvents)
  }

  // check width constraints of overlapping events to make sure the current event isn't too large
  alreadyCheckedEvents.push(event.id);
  conflictingEvents.forEach((eventId) => {
    if (alreadyCheckedEvents.indexOf(eventId) === -1) {
      let event = events.find((event) => eventId === event.id)
      if (event) {
        maxEventsInRow = Math.max(maxEventsInRow, findEventWidth(events, calendar, event, alreadyCheckedEvents))
      }
    }
  })
  return maxEventsInRow;
}

export function toGrid(events: CalendarEventTransformed[]): number[][] {
  const calendar: number[][] = [];
  for (let i = 0; i < 24 * 60 / TIME_TICK; i++) {
    calendar.push([]);
  }

  events.forEach((event) => {
    addEventInCalendar(event, calendar);
  })
  console.log(calendar);
  return calendar;
}

function addEventInCalendar(event: CalendarEventTransformed, calendar: number[][]) {
  const startingIndex = timeStringToIndex(event.start);
  const columnIndex = findFirstColumnAvailable(startingIndex, event.duration / TIME_TICK, calendar);
  putEventInCalendar(calendar, startingIndex, columnIndex, event.duration / TIME_TICK, event.id);
}

export function timeStringToIndex(timeString: string): number {
  const [startingHours, startingMinutes] = timeString.split(':');
  return (parseInt(startingHours) * 60 + parseInt(startingMinutes)) / TIME_TICK;
}

function findFirstColumnAvailable(startingIndex: number, duration: number, calendar: number[][]) {
  let testedColumn = 0;
  let isColumnAvailable = false;
  while (!isColumnAvailable) {
    isColumnAvailable = true;
    for (let calendarIndex = startingIndex; calendarIndex < startingIndex + duration; calendarIndex++) {
      if (calendar[calendarIndex][testedColumn] !== undefined) {
        testedColumn++;
        isColumnAvailable = false;
        break;
      }
    }
  }
  return testedColumn;
}

function putEventInCalendar(calendar: number[][], startingIndex: number, column: number, duration: number, eventId: number) {
  for (let calendarIndex = startingIndex; calendarIndex < startingIndex + duration; calendarIndex++) {
    calendar[calendarIndex][column] = eventId;
  }
}



export function transformEvents(events: CalendarEvent[]): CalendarEventTransformed[] {
  return events.map(event => transformEvent(event));
}

export function transformEvent(event: CalendarEvent): CalendarEventTransformed {
  const startTime = new Date(`0000-01-01T${event.start}:00`);
  const endTime = new Date(startTime.getTime() + event.duration * 60 * 1000);
  return {
    ...event,
    startDate: startTime,
    endDate: endTime,
  };
}

export function getMaxOverlappingEvents(
  events: CalendarEventTransformed[],
  selectedEvent: CalendarEventTransformed
): number {
  // Filter out the selected event to avoid self-comparison
  const otherEvents = events.filter(event => event.id !== selectedEvent.id);

  // Helper function to check if two events overlap
  const eventsOverlap = (event1: CalendarEventTransformed, event2: CalendarEventTransformed): boolean => {
    return event1.startDate < event2.endDate && event1.endDate > event2.startDate;
  };

  // Calculate overlapping events for the selected event
  let overlapCount = 0;
  for (const event of otherEvents) {
    if (eventsOverlap(selectedEvent, event)) {
      overlapCount++;
    }
  }

  return overlapCount;
}

export function getNumberOfOverlappingEvents(events: CalendarEventTransformed[], selectedEvent: CalendarEventTransformed) {
  let overlaps = 0;

  for (const event of events) {
    // Skip the selected event itself
    if (event.id === selectedEvent.id) continue;

    // Check for overlap using start and end Date objects
    if (isTimeRangeOverlapping(selectedEvent.startDate, selectedEvent.endDate, event.startDate, event.endDate)) {
      overlaps++;
    }
  }

  return overlaps;
}

function isTimeRangeOverlapping(startTime1: Date, endTime1: Date, startTime2: Date, endTime2: Date) {
  // Check for overlap using logical operators
  return (startTime1 < endTime2 && endTime1 > startTime2);
}
