"use client";
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
        <div key={i}>
          <h1>{event.topic}</h1>
          <h2>
            {DateTime.fromISO(event.start).toFormat("HH:mm")} -{" "}
            {DateTime.fromISO(event.end).toFormat("HH:mm")}
          </h2>
          <h3>{event.course}</h3>
          <div>
            {event.signature.map((sign, j) => (
              <p key={j}>{sign}</p>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
