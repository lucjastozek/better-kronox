import styles from "@/components/TimetableMonth/timetable-month.module.css";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ICalEvent from "@/utils/interfaces/ICalEvent";

interface TimetableProps {
  date: DateTime;
  locale?: "en" | "sv";
  setCellSize: Dispatch<
    SetStateAction<{
      top: number;
      left: number;
      width: number;
      height: number;
    }>
  >;
  events?: ICalEvent[];
}

export default function TimetableMonth({
  date,
  locale = "en",
  setCellSize,
  events = [],
}: TimetableProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ICalEvent | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        setShowOverlay(false);
      }
    };

    if (showOverlay) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showOverlay]);

  // Close overlay on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowOverlay(false);
      }
    };

    if (showOverlay) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showOverlay]);

  const handleEventClick = (event: ICalEvent) => {
    setSelectedEvent(event);
    setShowOverlay(true);
  };

  const updateCellInfo = () => {
    if (gridRef.current) {
      const firstCell = gridRef.current.querySelector(".firstCell");
      if (firstCell) {
        const rect = firstCell.getBoundingClientRect();
        setCellSize({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    }
  };

  useEffect(() => {
    updateCellInfo();
    window.addEventListener("resize", updateCellInfo);
    return () => window.removeEventListener("resize", updateCellInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const year = date.year;
  const month = date.month;
  const daysInMonth = date.daysInMonth || 31;
  const firstDayOfWeek = (DateTime.local(year, month, 1).weekday + 6) % 7;

  const dayNames = Array.from({ length: 7 }, (_, i) => {
    const dayName = DateTime.local(2024, 1, 1)
      .plus({ days: i })
      .setLocale(locale).weekdayShort;
    return dayName ? dayName.toUpperCase() : "";
  });

  const cells = [];

  // previous month's days
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevMonthDay = DateTime.local(year, month, 1).minus({
      days: firstDayOfWeek - i,
    });
    const cellDate = prevMonthDay;
    const dayEvents = events.filter((e) =>
      DateTime.fromISO(e.start).hasSame(cellDate, "day")
    );
    cells.push(
      <div
        key={`prev-${prevMonthDay.day}`}
        className={`${styles.cell} ${styles.otherMonth}`}
      >
        <div className={styles.dayNumber}>{prevMonthDay.day}</div>
        <div className={styles.events}>
          {dayEvents.map((ev, idx) => (
            <div
              key={idx}
              className={styles.event}
              onClick={() => handleEventClick(ev)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleEventClick(ev);
                }
              }}
            >
              <span className={styles.dot}></span>
              <span className={styles.time}>
                {DateTime.fromISO(ev.start).toFormat("HH:mm")}
              </span>{" "}
              {ev.topic}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = DateTime.local(year, month, day);
    const dayEvents = events.filter((e) =>
      DateTime.fromISO(e.start).hasSame(cellDate, "day")
    );
    const isToday = cellDate.hasSame(DateTime.now(), "day");
    cells.push(
      <div
        key={day}
        className={`${styles.cell} ${day === 1 ? "firstCell" : ""} ${isToday ? styles.today : ""}`}
      >
        <h3 className={styles.dayNumber}>{day}</h3>
        <div className={styles.events}>
          {dayEvents.map((ev, idx) => (
            <div
              key={idx}
              className={styles.event}
              onClick={() => handleEventClick(ev)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleEventClick(ev);
                }
              }}
            >
              <span className={styles.timeContainer}>
                <span className={styles.dot}></span>
                <span className={styles.time}>
                  {DateTime.fromISO(ev.start).toFormat("HH:mm")}
                </span>
              </span>
              <p>{ev.topic}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalCells = 42;
  const remainingCells = totalCells - cells.length;
  for (let day = 1; day <= remainingCells; day++) {
    const nextMonthDay = DateTime.local(year, month, daysInMonth).plus({
      days: day,
    });
    const cellDate = nextMonthDay;
    const dayEvents = events.filter((e) =>
      DateTime.fromISO(e.start).hasSame(cellDate, "day")
    );
    cells.push(
      <div
        key={`next-${nextMonthDay.day}`}
        className={`${styles.cell} ${styles.otherMonth}`}
      >
        <h3 className={styles.dayNumber}>{nextMonthDay.day}</h3>
        <div className={styles.events}>
          {dayEvents.map((ev, idx) => (
            <div
              key={idx}
              className={styles.event}
              onClick={() => handleEventClick(ev)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleEventClick(ev);
                }
              }}
            >
              <span className={styles.timeContainer}>
                <span className={styles.dot}></span>
                <span className={styles.time}>
                  {DateTime.fromISO(ev.start).toFormat("HH:mm")}
                </span>
              </span>
              <p>{ev.topic}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.monthContainer} ref={gridRef}>
        <div className={styles.header}>
          {dayNames.map((day) => (
            <h2 key={day} className={`${styles.headerCell}`}>
              {day}
            </h2>
          ))}
        </div>
        <div className={styles.grid}>{cells}</div>
      </div>

      {showOverlay && (
        <div
          className={`overlay-backdrop ${showOverlay ? "overlay-backdrop-show" : ""}`}
          onClick={() => setShowOverlay(false)}
        />
      )}

      {showOverlay && selectedEvent && (
        <div
          className="overlayContainer"
          style={{
            visibility: showOverlay ? "visible" : "hidden",
          }}
        >
          <div
            ref={overlayRef}
            className={`overlay ${showOverlay ? "overlay-show" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="overlay-title"
          >
            <div className="overlay-header">
              <div>
                <h2 id="overlay-title">{selectedEvent.topic}</h2>
                <h3>{selectedEvent.course}</h3>
                <h3>
                  {DateTime.fromISO(selectedEvent.start).toFormat(
                    "cccc, dd MMMM yyyy ⋅ "
                  )}
                  {DateTime.fromISO(selectedEvent.start).toFormat("HH:mm")} -{" "}
                  {DateTime.fromISO(selectedEvent.end).toFormat("HH:mm")}
                </h3>
              </div>
              <button
                className="overlay-close"
                onClick={() => setShowOverlay(false)}
                aria-label="Close overlay"
              >
                ✕
              </button>
            </div>

            <div className="overlay-content">
              {selectedEvent.signature &&
                selectedEvent.signature.length > 0 &&
                selectedEvent.signature[0] !== null && (
                  <div className="overlay-section">
                    <h4>Teachers</h4>
                    {selectedEvent.signature.map(
                      (teacher: string, i: number) => (
                        <p key={i}>👤 {teacher}</p>
                      )
                    )}
                  </div>
                )}
              {selectedEvent.locations &&
                selectedEvent.locations.length > 0 &&
                selectedEvent.locations[0] !== "" && (
                  <div className="overlay-section">
                    <h4>Locations</h4>
                    {selectedEvent.locations.map(
                      (location: string, i: number) => (
                        <p key={i}>🏫 {location}</p>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
