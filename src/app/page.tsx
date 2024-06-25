'use client';
import DailyCalendar from "@/component/calendar/daily/daily-calendar";
import { CalendarEventTransformed } from "@/model/calendar-event";
import { toGrid, transformEvents } from "@/utils/calendar-ui-helper";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [events, setEvents] = useState<CalendarEventTransformed[]>();
  const [eventGrid, setEventGrid] = useState<number[][]>();

  useEffect(() => {
    fetch('mock/input.json')
      .then(res => res.json()
        .then(events => {
          setEvents(transformEvents(events));
          const grid: number[][] = toGrid(events);
          setEventGrid(grid);
        }));
  }, [])

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        {(events && eventGrid) &&
          <DailyCalendar events={events} eventGrid={eventGrid} />
        }
      </div>
    </main>
  );
}
