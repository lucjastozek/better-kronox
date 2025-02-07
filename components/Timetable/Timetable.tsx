import styles from "@/components/Timetable/timetable.module.css";

export default function Timetable() {
  const day = 24;
  return (
    <div className={styles.grid}>
      <div className={styles.weekNames}>
        <div className={styles.weekName}>
          <p>{day}</p>
          <h2>Mon</h2>
        </div>
        <div className={styles.weekName}>
          <p>{day + 1}</p>
          <h2>Tue</h2>
        </div>
        <div className={styles.weekName}>
          <p>{day + 2}</p>
          <h2>Wed</h2>
        </div>
        <div className={styles.weekName}>
          <p>{day + 3}</p>
          <h2>Thu</h2>
        </div>
        <div className={styles.weekName}>
          <p>{day + 4}</p>
          <h2>Fri</h2>
        </div>
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
          <div key={i} />
        ))}
      </div>
    </div>
  );
}
