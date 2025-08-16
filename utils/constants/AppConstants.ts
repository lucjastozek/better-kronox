export const UI_CONSTANTS = {
  MOBILE_BREAKPOINT: 900,
  WORKING_HOURS: {
    START: 8,
    END: 18,
    TOTAL_HOURS: 10,
  },
  WEEKDAYS: {
    MONDAY: 1,
    FRIDAY: 5,
    WEEKEND_START: 6,
  },
  EVENT_HEIGHT_THRESHOLDS: {
    SMALL: 70,
    MEDIUM: 100,
    LARGE: 150,
  },
  EVENT_WIDTH_MULTIPLIER: 0.95,
  CALENDAR: {
    TOTAL_MONTH_CELLS: 42,
    DAYS_IN_WEEK: 7,
  },
};

export const VIEW_TYPES = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
};

export const KEYBOARD_SHORTCUTS = {
  NEXT: ["n", "ArrowRight"],
  PREVIOUS: ["p", "ArrowLeft"],
  TODAY: ["t"],
  DAY_VIEW: ["d"],
  WEEK_VIEW: ["w"],
  MONTH_VIEW: ["m"],
  ESCAPE: "Escape",
  ENTER: "Enter",
  SPACE: " ",
};

export type ViewType = (typeof VIEW_TYPES)[keyof typeof VIEW_TYPES];
