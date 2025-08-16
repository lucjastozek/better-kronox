"use client";
import { DateTime } from "luxon";
import { useState } from "react";
import styles from "./page.module.css";

import CalendarHeader from "@/components/CalendarHeader/CalendarHeader";
import TimetableView from "@/components/TimetableView/TimetableView";
import EventList from "@/components/EventList/EventList";
import LoadingIndicator from "@/components/LoadingIndicator/LoadingIndicator";

import { ViewType, VIEW_TYPES } from "@/utils/constants/AppConstants";
import { useResponsiveLayout } from "@/utils/hooks/useResponsiveLayout";
import { useEvents } from "@/utils/hooks/useEvents";
import { useKeyboardNavigation } from "@/utils/hooks/useKeyboardNavigation";
import { getNextWorkingDay } from "@/utils/dateHelpers";
import { filterEventsByView } from "@/utils/eventHelpers";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [currentView, setCurrentView] = useState<ViewType>(VIEW_TYPES.DAY);
  const [cellSize, setCellSize] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const { windowWidth, isMobile } = useResponsiveLayout();
  const { events, isLoading } = useEvents();

  // auto-navigate to next working day if today is weekend
  const navigateToWorkingDay = () => {
    const nextWorkingDay = getNextWorkingDay(currentDate);
    if (!nextWorkingDay.equals(currentDate)) {
      setCurrentDate(nextWorkingDay);
    }
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      switch (currentView) {
        case VIEW_TYPES.MONTH:
          return prev.plus({ months: 1 });
        case VIEW_TYPES.WEEK:
          return prev.plus({ weeks: 1 });
        case VIEW_TYPES.DAY:
          return prev.plus({ days: 1 });
        default:
          return prev;
      }
    });
  };

  const handlePrevious = () => {
    setCurrentDate((prev) => {
      switch (currentView) {
        case VIEW_TYPES.MONTH:
          return prev.minus({ months: 1 });
        case VIEW_TYPES.WEEK:
          return prev.minus({ weeks: 1 });
        case VIEW_TYPES.DAY:
          return prev.minus({ days: 1 });
        default:
          return prev;
      }
    });
  };

  const handleToday = () => {
    setCurrentDate(DateTime.now());
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  useKeyboardNavigation({
    onNext: handleNext,
    onPrevious: handlePrevious,
    onToday: handleToday,
    onDayView: () => setCurrentView(VIEW_TYPES.DAY),
    onWeekView: () => setCurrentView(VIEW_TYPES.WEEK),
    onMonthView: () => setCurrentView(VIEW_TYPES.MONTH),
  });

  const filteredEvents = filterEventsByView(events, currentDate, currentView);

  useState(() => {
    if (isMobile) {
      setCurrentView(VIEW_TYPES.DAY);
    } else {
      setCurrentView(VIEW_TYPES.WEEK);
    }
    navigateToWorkingDay();
  });

  return (
    <main className={styles.main}>
      <CalendarHeader
        currentDate={currentDate}
        currentView={currentView}
        showMobile={isMobile}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />

      <TimetableView
        currentDate={currentDate}
        currentView={currentView}
        events={events}
        onCellSizeChange={setCellSize}
      />

      {isLoading && <LoadingIndicator />}

      <EventList
        events={filteredEvents}
        currentView={currentView}
        cellSize={cellSize}
        windowWidth={windowWidth}
      />
    </main>
  );
}
