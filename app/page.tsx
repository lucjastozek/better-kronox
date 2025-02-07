"use client";
import { DateTime } from "luxon";
import Event from "@/components/Event/Event";
import ICalEvent from "@/utils/interfaces/ICalEvent";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Timetable from "@/components/Timetable/Timetable";

export default function Home() {
  const day = DateTime.now().plus({ days: 0 });
  const [cellSize, setCellSize] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [events, setEvents] = useState<ICalEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = (await axios.get("/api/schedule")).data;

        setEvents(data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className={styles.main}>
      <Timetable date={day} setCellSize={setCellSize} />
      {events.length < 1 && <h1 className="loading">Loading...</h1>}
      {events
        .filter(
          (event) => DateTime.fromISO(event.start).weekNumber === day.weekNumber
        )
        .map((event, i) => (
          <Event
            key={i}
            teachers={event.signature}
            topic={event.topic}
            startHour={DateTime.fromISO(event.start).toFormat("HH:mm")}
            endHour={DateTime.fromISO(event.end).toFormat("HH:mm")}
            locations={event.locations}
            style={{
              top: `${cellSize.top + (DateTime.fromISO(event.start).hour - 8 + DateTime.fromISO(event.start).minute / 60) * cellSize.height}px`,
              left: `${cellSize.left + (DateTime.fromISO(event.start).weekday - 1) * cellSize.width}px`,
              width: `${cellSize.width * 0.95}px`,
              height: `${(DateTime.fromISO(event.end).hour + DateTime.fromISO(event.end).minute / 60 - DateTime.fromISO(event.start).hour - DateTime.fromISO(event.start).minute / 60) * cellSize.height}px`,
            }}
          />
        ))}
    </main>
  );
}
