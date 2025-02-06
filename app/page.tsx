"use client";
import Event from "@/components/Event";
import ICalEvent from "@/utils/interfaces/ICalEvent";
import axios from "axios";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

export default function Home() {
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
    <main>
      {events.length < 1 && <h1>Loading...</h1>}
      {events.map((event, i) => (
        <Event
          key={i}
          teachers={event.signature}
          topic={event.topic}
          startHour={DateTime.fromISO(event.start).toFormat("HH:mm")}
          endHour={DateTime.fromISO(event.end).toFormat("HH:mm")}
        />
      ))}
    </main>
  );
}
