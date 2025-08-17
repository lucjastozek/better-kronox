import { DateTime } from "luxon";
import { useState, useEffect, useRef } from "react";
import { UI_CONSTANTS } from "@/utils/constants/AppConstants";

interface EventProps {
  startDate: string;
  endDate: string;
  topic: string;
  teachers: string[];
  locations: string[];
  course: string;
  style: EventStyle;
  additionalStyles: AdditionalStyles;
}

interface AdditionalStyles {
  p: {
    fontSize: string;
  };
}

interface EventStyle {
  top: string;
  left: string;
  width: string;
  height: string;
}

export default function Event({
  startDate,
  endDate,
  topic,
  teachers,
  locations,
  style,
  course,
  additionalStyles,
}: EventProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const getEventHeight = () => parseInt(style.height.split("px")[0]);
  const shouldShowDetails = () =>
    getEventHeight() > UI_CONSTANTS.EVENT_HEIGHT_THRESHOLDS.LARGE;
  const getTopicLineClamp = () => {
    const height = getEventHeight();
    if (height < UI_CONSTANTS.EVENT_HEIGHT_THRESHOLDS.SMALL) return 1;
    if (height < UI_CONSTANTS.EVENT_HEIGHT_THRESHOLDS.MEDIUM) return 2;
    return 3;
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setShowOverlay(!showOverlay);
    }
  };

  const hasTeachers = () =>
    teachers && teachers.length > 0 && teachers[0] !== null;
  const hasLocations = () =>
    locations && locations.length > 0 && locations[0] !== "";

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
        onClick={toggleOverlay}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-expanded={showOverlay}
        aria-haspopup="dialog"
      >
        <div>
          <h2
            style={{
              WebkitLineClamp: getTopicLineClamp(),
            }}
          >
            {topic}
          </h2>
          <h3>
            {DateTime.fromISO(startDate).toFormat("HH:mm")} -{" "}
            {DateTime.fromISO(endDate).toFormat("HH:mm")}
          </h3>
        </div>
        {shouldShowDetails() && (
          <div>
            {hasTeachers() && (
              <div>
                {teachers.map((teacher, index) => (
                  <p key={index} style={additionalStyles.p}>
                    👤 {teacher}
                  </p>
                ))}
              </div>
            )}
            {hasLocations() && (
              <div>
                {locations.map((location, index) => (
                  <p key={index} style={additionalStyles.p}>
                    🏫 {location}
                  </p>
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
            {hasTeachers() && (
              <div className="overlay-section">
                <h4>Teachers</h4>
                {teachers.map((teacher, index) => (
                  <p key={index}>👤 {teacher}</p>
                ))}
              </div>
            )}
            {hasLocations() && (
              <div className="overlay-section">
                <h4>Locations</h4>
                {locations.map((location, index) => (
                  <p key={index}>🏫 {location}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
