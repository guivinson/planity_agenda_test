import { CalendarEventTransformed } from '@/model/calendar-event';
import { TIME_TICK, findEventColumn, findEventWidth, timeStringToIndex } from '@/utils/calendar-ui-helper';

type Props = {
  events: CalendarEventTransformed[],
  eventGrid: number[][],
}

export const DailyCalendar: React.FC<Props> = ({
  events, eventGrid
}) => {
  return (
    <div>
      {events
        .map((event, i) => {
          const eventWidth = findEventWidth(events, eventGrid, event);
          const eventHeight = event.duration / TIME_TICK;
          const eventRowIndex = timeStringToIndex(event.start);
          const eventColumnIndex = findEventColumn(eventGrid, event);
          return (
            <div key={i}>
              <div style={{
                position: "absolute",
                top: `${eventRowIndex / eventGrid.length * 100.0}%`,
                left: `${eventColumnIndex / eventWidth * 100.0}%`,
                width: `${1 / eventWidth * 100.0}%`, backgroundColor: `#${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}`,
                height: `${eventHeight / eventGrid.length * 100.0}%`
              }}>
                {event.id} {event.start} {event.duration}min
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default DailyCalendar;