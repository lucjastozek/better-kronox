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
import TimetableMonth from "@/components/TimetableMonth/TimetableMonth";

export default function Home() {
  const [day, setDay] = useState(DateTime.now());
  const [view, setView] = useState<"day" | "week" | "month">("day");
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
    if (view === "month") {
      setDay((prev) => prev.plus({ months: 1 }));
    } else if (view === "week") {
      setDay((prev) => prev.plus({ weeks: 1 }));
    } else {
      setDay((prev) => prev.plus({ days: 1 }));
    }
  };

  const handlePrevClick = () => {
    if (view === "month") {
      setDay((prev) => prev.minus({ months: 1 }));
    } else if (view === "week") {
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
      } else if (e.key === "d") {
        setView("day");
      } else if (e.key === "w") {
        setView("week");
      } else if (e.key === "m") {
        setView("month");
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  return (
    <main className={styles.main}>
      <header className="header">
        <button className="todayButton" onClick={handleTodayClick}>
          Today
        </button>
        <h1>
          {view === "month" && <>{day.toFormat("LLLL yyyy")}</>}
          {view === "week" && (
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
          )}
          {view === "day" && <>{day.toFormat("dd LLLL")}</>}
        </h1>
        <div className="buttons">
          {width > 900 && (
            <Select
              value={view}
              onChange={(e) =>
                setView(e.target.value as "day" | "week" | "month")
              }
              size="small"
              sx={{
                color: "var(--foreground)",
                border: "0.1rem solid rgba(var(--foreground), 0.2)",
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
              <MenuItem
                value="day"
                sx={{
                  fontSize:
                    "clamp(0.9rem, 0.15rem + 0.87vw, 2.25rem) !important",
                }}
              >
                Day
              </MenuItem>
              <MenuItem
                value="week"
                sx={{
                  fontSize:
                    "clamp(0.9rem, 0.15rem + 0.87vw, 2.25rem) !important",
                }}
              >
                Week
              </MenuItem>
              <MenuItem
                value="month"
                sx={{
                  fontSize:
                    "clamp(0.9rem, 0.15rem + 0.87vw, 2.25rem) !important",
                }}
              >
                Month
              </MenuItem>
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
      {view === "month" && (
        <TimetableMonth date={day} setCellSize={setCellSize} events={events} />
      )}
      {events.length < 1 && <h1 className="loading">Loading...</h1>}
      {view !== "month" &&
        events
          .filter((event) => {
            if (view === "week") {
              return (
                DateTime.fromISO(event.start).weekNumber === day.weekNumber
              );
            } else {
              return (
                DateTime.fromISO(event.start).toFormat("yyyy MM dd") ===
                day.toFormat("yyyy MM dd")
              );
            }
          })
          .map((event, i) => {
            if (view === "week") {
              return (
                <Event
                  key={i}
                  width={width}
                  course={event.course}
                  teachers={event.signature}
                  topic={event.topic}
                  startDate={event.start}
                  endDate={event.end}
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
                  startDate={event.start}
                  endDate={event.end}
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
