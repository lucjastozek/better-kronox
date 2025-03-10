"use client";
/* eslint-disable @next/next/no-img-element */
import { DateTime } from "luxon";
import Event from "@/components/Event/Event";
import ICalEvent from "@/utils/interfaces/ICalEvent";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Timetable from "@/components/Timetable/Timetable";
import TimetableMobile from "@/components/TimetableMobile/TimetableMobile";

export default function Home() {
  const [day, setDay] = useState(DateTime.now());
  const [prefersDarkTheme, setPrefersDarkTheme] = useState(false);
  const [cellSize, setCellSize] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [events, setEvents] = useState<ICalEvent[]>([]);
  const [width, setWidth] = useState<number>(1200);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    setWidth(window.innerWidth);

    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  useEffect(() => {
    if (
      day.toFormat("yyyy MM dd") === DateTime.now().toFormat("yyyy MM dd") &&
      day.weekday > 5
    ) {
      setDay((prev) => prev.plus({ days: 8 - day.weekday }));
    }
  }, [day, day.weekday]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setPrefersDarkTheme(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersDarkTheme(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

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

  const handleNextClick = () => {
    if (width > 768) {
      setDay((prev) => prev.plus({ weeks: 1 }));
    } else {
      setDay((prev) => prev.plus({ days: 1 }));
    }
  };

  const handlePrevClick = () => {
    if (width > 768) {
      setDay((prev) => prev.minus({ weeks: 1 }));
    } else {
      setDay((prev) => prev.minus({ days: 1 }));
    }
  };

  const handleTodayClick = () => {
    setDay(DateTime.now());
  };

  console.log(width);

  return (
    <main className={styles.main}>
      <div className="header">
        <button className="todayButton" onClick={handleTodayClick}>
          Today
        </button>
        <h1>
          {width > 768 ? (
            <>
              <span>Week {day.weekNumber}: </span>
              {day
                .minus({ days: day.weekday - 1 })
                .setLocale("en")
                .toFormat("DDD")}{" "}
              -{" "}
              {day
                .minus({ days: day.weekday - 5 })
                .setLocale("en")
                .toFormat("DDD")}
            </>
          ) : (
            <span>{day.toFormat("dd LLLL")}</span>
          )}
        </h1>
        {prefersDarkTheme ? (
          <div className="buttons">
            <button className="iconButton" onClick={handlePrevClick}>
              <img src="./arrow_left_light.svg" alt="previous week" />
            </button>
            <button className="iconButton" onClick={handleNextClick}>
              <img src="./arrow_right_light.svg" alt="next week" />{" "}
            </button>
          </div>
        ) : (
          <div className="buttons">
            <button className="iconButton" onClick={handlePrevClick}>
              <img src="./arrow_left_dark.svg" alt="previous week" />{" "}
            </button>

            <button className="iconButton" onClick={handleNextClick}>
              <img src="./arrow_right_dark.svg" alt="next week" />{" "}
            </button>
          </div>
        )}
      </div>
      {width <= 768 ? (
        <TimetableMobile date={day} setCellSize={setCellSize} />
      ) : (
        <Timetable date={day} setCellSize={setCellSize} />
      )}
      {events.length < 1 && <h1 className="loading">Loading...</h1>}
      {events
        .filter((event) => {
          if (width > 768) {
            return DateTime.fromISO(event.start).weekNumber === day.weekNumber;
          } else {
            return (
              DateTime.fromISO(event.start).toFormat("yyyy MM dd") ===
              day.toFormat("yyyy MM dd")
            );
          }
        })
        .map((event, i) => {
          if (width > 768) {
            return (
              <Event
                key={i}
                width={width}
                course={event.course}
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
            );
          } else {
            return (
              <Event
                key={i}
                width={width}
                course={event.course}
                teachers={event.signature}
                topic={event.topic}
                startHour={DateTime.fromISO(event.start).toFormat("HH:mm")}
                endHour={DateTime.fromISO(event.end).toFormat("HH:mm")}
                locations={event.locations}
                style={{
                  top: `${cellSize.top + (DateTime.fromISO(event.start).hour - 8 + DateTime.fromISO(event.start).minute / 60) * cellSize.height}px`,
                  left: `${cellSize.left}px`,
                  width: `${cellSize.width * 0.95}px`,
                  height: `${(DateTime.fromISO(event.end).hour + DateTime.fromISO(event.end).minute / 60 - DateTime.fromISO(event.start).hour - DateTime.fromISO(event.start).minute / 60) * cellSize.height}px`,
                }}
              />
            );
          }
        })}
    </main>
  );
}
