import styles from "@/components/TimetableWeek/timetable-week.module.css";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

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
}

export default function TimetableWeek({
  date,
  locale = "en",
  setCellSize,
}: TimetableProps) {
  const gridRef = useRef<HTMLDivElement>(null);

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
  const startDate = date.minus({ days: date.weekday - 1 });

  return (
    <div className={styles.grid} ref={gridRef}>
      <div className={styles.weekNames}>
        {Array.from({ length: 5 }, (_, i) => (
          <div
            className={`${styles.weekName} ${i + 1 === DateTime.now().weekday && styles.highlight}`}
            key={i}
          >
            <p>{startDate.plus({ days: i }).day}</p>
            <h2>
              {startDate.plus({ days: i }).setLocale(locale).weekdayShort}
            </h2>
          </div>
        ))}
      </div>
      <div className={styles.times}>
        <h2>08:00</h2>
        <h2>09:00</h2>
        <h2>10:00</h2>
        <h2>11:00</h2>
        <h2>12:00</h2>
        <h2>13:00</h2>
        <h2>14:00</h2>
        <h2>15:00</h2>
        <h2>16:00</h2>
        <h2>17:00</h2>
      </div>
      <div className={styles.content}>
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className={`${(i % 5) + 1 === DateTime.now().weekday && styles.highlight} ${i === 0 && "firstCell"}`}
          />
        ))}
      </div>
    </div>
  );
}
