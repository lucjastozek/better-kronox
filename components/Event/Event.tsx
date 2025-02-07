interface EventProps {
  startHour: string;
  endHour: string;
  topic: string;
  teachers: string[];
  locations: string[];
  style: object;
}

export default function Event({
  startHour,
  endHour,
  topic,
  teachers,
  locations,
  style,
}: EventProps) {
  return (
    <div className="event" style={style}>
      <div>
        <h2>{topic}</h2>
        <h3>
          {startHour} - {endHour}
        </h3>
      </div>
      <div>
        {teachers[0] !== null && (
          <div>
            {teachers.map((teacher, i) => (
              <p key={i}>👤 {teacher}</p>
            ))}
          </div>
        )}
        {locations[0] !== "" && (
          <div>
            {locations.map((location, i) => (
              <p key={i}>🏫 {location}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
