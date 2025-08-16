import { DateTime } from "luxon";
import Event from "@/components/Event/Event";
import ICalEvent from "@/utils/interfaces/ICalEvent";
import {
  ViewType,
  VIEW_TYPES,
  UI_CONSTANTS,
} from "@/utils/constants/AppConstants";
import { getEventStartHour, getEventDuration } from "@/utils/eventHelpers";

interface CellSize {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface EventListProps {
  events: ICalEvent[];
  currentView: ViewType;
  cellSize: CellSize;
  windowWidth: number;
}

export default function EventList({
  events,
  currentView,
  cellSize,
  windowWidth,
}: EventListProps) {
  const calculateEventStyle = (event: ICalEvent) => {
    const startHour = getEventStartHour(event);
    const duration = getEventDuration(event);
    const startDateTime = DateTime.fromISO(event.start);

    const baseStyle = {
      top: `${cellSize.top + (startHour - UI_CONSTANTS.WORKING_HOURS.START) * cellSize.height}px`,
      width: `${cellSize.width * UI_CONSTANTS.EVENT_WIDTH_MULTIPLIER}px`,
      height: `${duration * cellSize.height}px`,
    };

    if (currentView === VIEW_TYPES.WEEK) {
      return {
        ...baseStyle,
        left: `${cellSize.left + (startDateTime.weekday - 1) * cellSize.width}px`,
      };
    }

    return {
      ...baseStyle,
      left: `${cellSize.left}px`,
    };
  };

  if (currentView === VIEW_TYPES.MONTH) {
    return null;
  }

  return (
    <>
      {events.map((event, index) => (
        <Event
          key={index}
          width={windowWidth}
          course={event.course}
          teachers={event.signature}
          topic={event.topic}
          startDate={event.start}
          endDate={event.end}
          locations={event.locations}
          style={calculateEventStyle(event)}
        />
      ))}
    </>
  );
}
