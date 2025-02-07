import styles from "@/components/Timetable/timetable.module.css";
import { DateTime } from "luxon";

interface TimetableProps {
  date: DateTime;
  locale?: "en" | "sv";
}

export default function Timetable({ date, locale = "en" }: TimetableProps) {
  const startDate = date.minus({ days: date.weekday - 1 });

  return (
    <div className={styles.grid}>
      <div className={styles.weekNames}>
        {Array.from({ length: 5 }, (_, i) => (
          <div
            className={`${styles.weekName} ${i + 1 === date.weekday && styles.highlight}`}
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
            className={`${(i % 5) + 1 === date.weekday && styles.highlight}`}
          />
        ))}
      </div>
    </div>
  );
}
