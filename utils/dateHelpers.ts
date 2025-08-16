import { DateTime } from "luxon";
import { UI_CONSTANTS } from "@/utils/constants/AppConstants";

export const isWeekend = (date: DateTime): boolean => {
  return date.weekday > UI_CONSTANTS.WEEKDAYS.FRIDAY;
};

export const getNextWorkingDay = (date: DateTime): DateTime => {
  if (isWeekend(date)) {
    return date.plus({
      days: UI_CONSTANTS.WEEKDAYS.WEEKEND_START + 2 - date.weekday,
    });
  }
  return date;
};

export const getWeekRange = (
  date: DateTime
): { start: DateTime; end: DateTime } => {
  const start = date.minus({ days: date.weekday - 1 });
  const end = date.minus({ days: date.weekday - UI_CONSTANTS.WEEKDAYS.FRIDAY });
  return { start, end };
};

export const formatWeekRange = (date: DateTime, locale = "en"): string => {
  const { start, end } = getWeekRange(date);
  return `${start.setLocale(locale).toFormat("DDD")} - ${end.setLocale(locale).toFormat("DDD")}`;
};

export const isToday = (date: DateTime): boolean => {
  return date.hasSame(DateTime.now(), "day");
};

export const isSameWeek = (date1: DateTime, date2: DateTime): boolean => {
  return date1.weekNumber === date2.weekNumber && date1.year === date2.year;
};

export const isSameDay = (date1: DateTime, date2: DateTime): boolean => {
  return date1.hasSame(date2, "day");
};
