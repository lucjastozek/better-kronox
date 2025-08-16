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
}

interface EventWithPosition extends ICalEvent {
  column: number;
  totalColumns: number;
}

export default function EventList({
  events,
  currentView,
  cellSize,
}: EventListProps) {
  const eventsOverlap = (event1: ICalEvent, event2: ICalEvent): boolean => {
    const start1 = DateTime.fromISO(event1.start);
    const end1 = DateTime.fromISO(event1.end);
    const start2 = DateTime.fromISO(event2.start);
    const end2 = DateTime.fromISO(event2.end);

    return start1 < end2 && start2 < end1;
  };

  const groupEventsByDay = (): { [key: string]: ICalEvent[] } => {
    const groups: { [key: string]: ICalEvent[] } = {};

    events.forEach((event) => {
      const dayKey =
        currentView === VIEW_TYPES.WEEK
          ? DateTime.fromISO(event.start).weekday.toString()
          : "single-day";

      if (!groups[dayKey]) {
        groups[dayKey] = [];
      }
      groups[dayKey].push(event);
    });

    return groups;
  };

  const calculateEventLayout = (
    dayEvents: ICalEvent[]
  ): EventWithPosition[] => {
    if (dayEvents.length === 0) return [];

    const sortedEvents = [...dayEvents].sort((a, b) => {
      const startA = DateTime.fromISO(a.start);
      const startB = DateTime.fromISO(b.start);
      return startA.toMillis() - startB.toMillis();
    });

    const columns: ICalEvent[][] = [];
    const eventPositions: Map<
      ICalEvent,
      { column: number; totalColumns: number }
    > = new Map();

    sortedEvents.forEach((event) => {
      let columnIndex = 0;
      let placed = false;

      while (!placed) {
        if (columnIndex >= columns.length) {
          columns.push([]);
        }

        const canFit = columns[columnIndex].every(
          (existingEvent) => !eventsOverlap(event, existingEvent)
        );

        if (canFit) {
          columns[columnIndex].push(event);
          placed = true;
        } else {
          columnIndex++;
        }
      }
    });

    sortedEvents.forEach((event) => {
      const overlappingEvents = sortedEvents.filter((otherEvent) =>
        eventsOverlap(event, otherEvent)
      );

      const eventStart = DateTime.fromISO(event.start).toMillis();
      const eventEnd = DateTime.fromISO(event.end).toMillis();

      const timePoints: {
        time: number;
        type: "start" | "end";
        event: ICalEvent;
      }[] = [];

      overlappingEvents.forEach((evt) => {
        const start = DateTime.fromISO(evt.start).toMillis();
        const end = DateTime.fromISO(evt.end).toMillis();
        timePoints.push({ time: start, type: "start", event: evt });
        timePoints.push({ time: end, type: "end", event: evt });
      });

      timePoints.sort((a, b) => {
        if (a.time === b.time) {
          return a.type === "end" ? -1 : 1;
        }
        return a.time - b.time;
      });

      let maxConcurrentDuringEvent = 0;
      let currentConcurrent = 0;

      timePoints.forEach((point) => {
        if (point.type === "start") {
          currentConcurrent++;
          if (point.time >= eventStart && point.time < eventEnd) {
            maxConcurrentDuringEvent = Math.max(
              maxConcurrentDuringEvent,
              currentConcurrent
            );
          }
        } else {
          if (point.time > eventStart && point.time <= eventEnd) {
            maxConcurrentDuringEvent = Math.max(
              maxConcurrentDuringEvent,
              currentConcurrent
            );
          }
          currentConcurrent--;
        }
      });

      let concurrentAtStart = 0;
      overlappingEvents.forEach((evt) => {
        const start = DateTime.fromISO(evt.start).toMillis();
        const end = DateTime.fromISO(evt.end).toMillis();
        if (start <= eventStart && end > eventStart) {
          concurrentAtStart++;
        }
      });
      maxConcurrentDuringEvent = Math.max(
        maxConcurrentDuringEvent,
        concurrentAtStart
      );

      const overlappingEventsWithColumns = overlappingEvents
        .map((evt) => ({
          event: evt,
          column: columns.findIndex((col) => col.includes(evt)),
        }))
        .sort((a, b) => a.column - b.column);

      const positionInOverlappingGroup = overlappingEventsWithColumns.findIndex(
        (item) => item.event === event
      );

      eventPositions.set(event, {
        column: positionInOverlappingGroup,
        totalColumns: maxConcurrentDuringEvent,
      });
    });

    return sortedEvents.map((event) => {
      const position = eventPositions.get(event)!;
      return {
        ...event,
        column: position.column,
        totalColumns: position.totalColumns,
      };
    });
  };

  const getEventsWithPositions = (): EventWithPosition[] => {
    const dayGroups = groupEventsByDay();
    const allEventsWithPositions: EventWithPosition[] = [];

    Object.values(dayGroups).forEach((dayEvents) => {
      const layoutedEvents = calculateEventLayout(dayEvents);
      allEventsWithPositions.push(...layoutedEvents);
    });

    return allEventsWithPositions;
  };

  const calculateEventStyle = (event: EventWithPosition) => {
    const startHour = getEventStartHour(event);
    const duration = getEventDuration(event);
    const startDateTime = DateTime.fromISO(event.start);

    const eventWidth =
      (cellSize.width * UI_CONSTANTS.EVENT_WIDTH_MULTIPLIER) /
      event.totalColumns;
    const leftOffset = eventWidth * event.column;

    const baseStyle = {
      top: `${cellSize.top + (startHour - UI_CONSTANTS.WORKING_HOURS.START) * cellSize.height}px`,
      width: `${eventWidth}px`,
      height: `${duration * cellSize.height}px`,
    };

    if (currentView === VIEW_TYPES.WEEK) {
      return {
        ...baseStyle,
        left: `${cellSize.left + (startDateTime.weekday - 1) * cellSize.width + leftOffset}px`,
      };
    }

    return {
      ...baseStyle,
      left: `${cellSize.left + leftOffset}px`,
    };
  };

  if (currentView === VIEW_TYPES.MONTH) {
    return null;
  }

  const eventsWithPositions = getEventsWithPositions();

  return (
    <>
      {eventsWithPositions.map((event, index) => (
        <Event
          key={`${event.start}-${event.end}-${event.course}-${index}`}
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
