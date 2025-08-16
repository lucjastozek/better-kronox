import { DateTime } from "luxon";
import ICalEvent from "@/utils/interfaces/ICalEvent";
import { ViewType, VIEW_TYPES } from "@/utils/constants/AppConstants";
import { isSameWeek, isSameDay } from "@/utils/dateHelpers";

export const filterEventsByView = (
  events: ICalEvent[],
  date: DateTime,
  view: ViewType
): ICalEvent[] => {
  return events.filter((event) => {
    const eventDate = DateTime.fromISO(event.start);

    switch (view) {
      case VIEW_TYPES.WEEK:
        return isSameWeek(eventDate, date);
      case VIEW_TYPES.DAY:
        return isSameDay(eventDate, date);
      case VIEW_TYPES.MONTH:
        return eventDate.month === date.month && eventDate.year === date.year;
      default:
        return false;
    }
  });
};

export const filterEventsByDate = (
  events: ICalEvent[],
  targetDate: DateTime
): ICalEvent[] => {
  return events.filter((event) => {
    const eventDate = DateTime.fromISO(event.start);
    return isSameDay(eventDate, targetDate);
  });
};

export const getEventDuration = (event: ICalEvent): number => {
  const start = DateTime.fromISO(event.start);
  const end = DateTime.fromISO(event.end);
  return end.diff(start, "hours").hours;
};

export const getEventStartHour = (event: ICalEvent): number => {
  const start = DateTime.fromISO(event.start);
  return start.hour + start.minute / 60;
};

export const hasValidTeachers = (event: ICalEvent): boolean => {
  return (
    event.signature && event.signature.length > 0 && event.signature[0] !== null
  );
};

export const hasValidLocations = (event: ICalEvent): boolean => {
  return (
    event.locations && event.locations.length > 0 && event.locations[0] !== ""
  );
};
