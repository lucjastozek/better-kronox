import { DateTime } from "luxon";
import { useState, useEffect, useRef } from "react";

interface Style {
  top: string;
  left: string;
  width: string;
  height: string;
}

interface EventProps {
  startDate: string;
  endDate: string;
  topic: string;
  teachers: string[];
  locations: string[];
  course: string;
  style: Style;
  width: number;
}

export default function Event({
  startDate,
  endDate,
  topic,
  teachers,
  locations,
  style,
  course,
  width,
}: EventProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

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
  return (
    <>
      <div
        className={`event ${showOverlay ? "event-active" : ""}`}
        style={style}
        onClick={() => {
          if (showOverlay === true) {
            setShowOverlay(false);
          } else if (width > 900) {
            setShowOverlay(true);
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (width > 900) {
              setShowOverlay(!showOverlay);
            }
          }
        }}
        aria-expanded={showOverlay}
        aria-haspopup="dialog"
      >
        <div>
          <h2
            style={{
              WebkitLineClamp:
                parseInt(style.height.split("px")[0]) < 70
                  ? 1
                  : parseInt(style.height.split("px")[0]) < 100
                    ? 2
                    : 3,
            }}
          >
            {topic}
          </h2>
          <h3>
            {DateTime.fromISO(startDate).toFormat("HH:mm")} -{" "}
            {DateTime.fromISO(endDate).toFormat("HH:mm")}
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

      {showOverlay && (
        <div
          className={`overlay-backdrop ${showOverlay ? "overlay-backdrop-show" : ""}`}
          onClick={() => setShowOverlay(false)}
        />
      )}

      <div
        className="overlayContainer"
        style={{
          top: style.top,
          left: style.left,
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
              <h2 id="overlay-title">{topic}</h2>
              <h3>{course}</h3>
              <h3>
                {DateTime.fromISO(startDate).toFormat("cccc, dd MMMM yyyy  ⋅ ")}
                {DateTime.fromISO(startDate).toFormat("HH:mm")} -{" "}
                {DateTime.fromISO(endDate).toFormat("HH:mm")}
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
            {teachers[0] !== null && (
              <div className="overlay-section">
                <h4>Teachers</h4>
                {teachers.map((teacher, i) => (
                  <p key={i}>👤 {teacher}</p>
                ))}
              </div>
            )}
            {locations[0] !== "" && (
              <div className="overlay-section">
                <h4>Locations</h4>
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
