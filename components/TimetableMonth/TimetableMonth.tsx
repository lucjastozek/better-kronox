/* eslint-disable react-hooks/rules-of-hooks */
import styles from "@/components/TimetableMonth/timetable-month.module.css";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ICalEvent from "@/utils/interfaces/ICalEvent";
import { isToday } from "@/utils/dateHelpers";

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

  const handleEventClick = (event: ICalEvent) => {
    setSelectedEvent(event);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setSelectedEvent(null);
  };

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

  const dayNames = Array.from({ length: 5 }, (_, dayIndex) => {
    const dayName = DateTime.local(2024, 1, 1)
      .plus({ days: dayIndex })
      .setLocale(locale).weekdayShort;
    return dayName ? dayName.toUpperCase() : "";
  });

  const cells = [];

  const firstMonday = DateTime.local(year, month, 1);
  let startDate = firstMonday;

  while (startDate.weekday !== 1) {
    startDate = startDate.minus({ days: 1 });
  }

  for (let week = 0; week < 5; week++) {
    for (let day = 0; day < 5; day++) {
      const cellDate = startDate.plus({ days: week * 7 + day });
      const isCurrentMonth = cellDate.month === month;
      const dayEvents = events.filter((event) =>
        DateTime.fromISO(event.start).hasSame(cellDate, "day")
      );
      const isCurrentDay = isToday(cellDate);

      cells.push(
        <div
          key={`${cellDate.year}-${cellDate.month}-${cellDate.day}`}
          className={`${styles.cell} ${!isCurrentMonth ? styles.otherMonth : ""} ${cellDate.day === 1 && isCurrentMonth ? "firstCell" : ""} ${isCurrentDay ? styles.today : ""}`}
        >
          <h3 className={styles.dayNumber}>{cellDate.day}</h3>
          <div className={styles.events}>
            {dayEvents.map((eventItem, eventIndex) => (
              <div
                key={eventIndex}
                className={styles.event}
                onClick={() => handleEventClick(eventItem)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleEventClick(eventItem);
                  }
                }}
              >
                <span className={styles.timeContainer}>
                  <span className={styles.dot}></span>
                  <span className={styles.time}>
                    {DateTime.fromISO(eventItem.start).toFormat("HH:mm")}
                  </span>
                </span>
                <p>{eventItem.topic}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
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
          onClick={closeOverlay}
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
                onClick={closeOverlay}
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
