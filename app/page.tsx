"use client";
import { DateTime } from "luxon";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Event from "@/components/Event/Event";
import ICalEvent from "@/utils/interfaces/ICalEvent";
import axios from "axios";
import { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import styles from "./page.module.css";
import TimetableDay from "@/components/TimetableDay/TimetableDay";
import TimetableWeek from "@/components/TimetableWeek/TimetableWeek";

export default function Home() {
  const [day, setDay] = useState(DateTime.now());
  const [view, setView] = useState<"day" | "week">("day");
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
    if (window.innerWidth <= 900) {
      setView("day");
    } else {
      setView("week");
    }
  }
  useEffect(() => {
    setWidth(window.innerWidth);
    if (window.innerWidth <= 900) {
      setView("day");
    } else {
      setView("week");
    }

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
    if (width > 900) {
      setDay((prev) => prev.plus({ weeks: 1 }));
    } else {
      setDay((prev) => prev.plus({ days: 1 }));
    }
  };

  const handlePrevClick = () => {
    if (width > 900) {
      setDay((prev) => prev.minus({ weeks: 1 }));
    } else {
      setDay((prev) => prev.minus({ days: 1 }));
    }
  };

  const handleTodayClick = () => {
    setDay(DateTime.now());
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "n" || e.key === "ArrowRight") {
        handleNextClick();
      } else if (e.key === "p" || e.key === "ArrowLeft") {
        handlePrevClick();
      } else if (e.key === "t") {
        handleTodayClick();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={styles.main}>
      <header className="header">
        <button className="todayButton" onClick={handleTodayClick}>
          Today
        </button>
        <h1>
          {width > 900 ? (
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
        <div className="buttons">
          {width > 900 && (
            <Select
              value={view}
              onChange={(e) => setView(e.target.value as "day" | "week")}
              size="small"
              sx={{
                background: "rgba(var(--white), 0.9)",
                color: "rgb(var(--black))",
                borderRadius: "clamp(0.6rem, 0.7vw, 1.7rem)",
                marginRight: "1rem",
                fontWeight: "600",
                fontSize: "clamp(1.1rem, 0.05rem + 1.2vw, 3rem) !important",
                paddingBlock:
                  "clamp(0.6rem - 8.5px, 0.7vw - 8.5px, 1.7rem - 8.5px) !important",
                paddingRight:
                  "clamp(1rem - 32px, 0.17rem + 0.97vw - 32px, 2.5rem - 32px) !important",
                paddingLeft:
                  "clamp(1rem - 14px, 0.17rem + 0.97vw - 14px, 2.5rem - 14px) !important",
                fontFamily: "Arial, sans-serif",
                height: "100%",
              }}
            >
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
            </Select>
          )}
          <button className="iconButton" onClick={handlePrevClick}>
            <NavigateBeforeIcon />
          </button>
          <button className="iconButton" onClick={handleNextClick}>
            <NavigateNextIcon />
          </button>
        </div>
      </header>
      {view === "day" && <TimetableDay date={day} setCellSize={setCellSize} />}
      {view === "week" && (
        <TimetableWeek date={day} setCellSize={setCellSize} />
      )}
      {events.length < 1 && <h1 className="loading">Loading...</h1>}
      {events
        .filter((event) => {
          if (width > 900) {
            return DateTime.fromISO(event.start).weekNumber === day.weekNumber;
          } else {
            return (
              DateTime.fromISO(event.start).toFormat("yyyy MM dd") ===
              day.toFormat("yyyy MM dd")
            );
          }
        })
        .map((event, i) => {
          if (width > 900) {
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
