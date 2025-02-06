interface EventProps {
  startHour: string;
  endHour: string;
  topic: string;
  teachers: string[];
}

export default function Event({
  startHour,
  endHour,
  topic,
  teachers,
}: EventProps) {
  return (
    <div className="event">
      <div>
        <h2>{topic}</h2>
        <h3>
          {startHour} - {endHour}
        </h3>
      </div>
      <div>
        {teachers.map((teacher, i) => (
          <p key={i}>👤 {teacher}</p>
        ))}
      </div>
    </div>
  );
}
