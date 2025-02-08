import { useState } from "react";

interface Style {
  top: string;
  left: string;
  width: string;
  height: string;
}

interface EventProps {
  startHour: string;
  endHour: string;
  topic: string;
  teachers: string[];
  locations: string[];
  course: string;
  style: Style;
  width: number;
}

export default function Event({
  startHour,
  endHour,
  topic,
  teachers,
  locations,
  style,
  course,
  width,
}: EventProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  return (
    <>
      <div
        className="event"
        style={style}
        onMouseOver={() => width > 768 && setShowOverlay(true)}
        onMouseLeave={() => width > 768 && setShowOverlay(false)}
        onClick={() => {
          if (width < 768) {
            setShowOverlay((prev) => !prev);
            setTimeout(() => {
              setShowOverlay(false);
            }, 3000);
          }
        }}
      >
        <div>
          <h2>{topic}</h2>
          <h3>
            {startHour} - {endHour}
          </h3>
        </div>
        {parseInt(style.height.split("px")[0]) > 150 && (
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
        )}
      </div>
      <div
        className="overlayContainer"
        style={{ top: style.top, left: style.left }}
      >
        <div
          className="overlay"
          style={{ maxHeight: showOverlay ? "100%" : "0px" }}
        >
          <div>
            <h2>{topic}</h2>
            <h3>{course}</h3>
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
      </div>
    </>
  );
}
