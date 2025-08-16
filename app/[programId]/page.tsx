"use client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../page.module.css";

import CalendarHeader from "@/components/CalendarHeader/CalendarHeader";
import TimetableView from "@/components/TimetableView/TimetableView";
import EventList from "@/components/EventList/EventList";
import LoadingIndicator from "@/components/LoadingIndicator/LoadingIndicator";

import { ViewType, VIEW_TYPES } from "@/utils/constants/AppConstants";
import { getProgramById } from "@/utils/constants/Programs";
import { useResponsiveLayout } from "@/utils/hooks/useResponsiveLayout";
import { useEvents } from "@/utils/hooks/useEvents";
import { useKeyboardNavigation } from "@/utils/hooks/useKeyboardNavigation";
import { getNextWorkingDay } from "@/utils/dateHelpers";
import { filterEventsByView } from "@/utils/eventHelpers";

export default function ProgramPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.programId as string;

  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [currentView, setCurrentView] = useState<ViewType>(VIEW_TYPES.DAY);
  const [cellSize, setCellSize] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const { isMobile } = useResponsiveLayout();
  const { events, isLoading } = useEvents(programId);

  const program = getProgramById(programId);

  useEffect(() => {
    if (!program) {
      router.push("/");
    }
  }, [program, router]);

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
    if (isMobile && view === VIEW_TYPES.WEEK) {
      return;
    }
    setCurrentView(view);
  };

  const handleDayClick = (date: DateTime) => {
    setCurrentDate(date);
    setCurrentView(VIEW_TYPES.DAY);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  useKeyboardNavigation({
    onNext: handleNext,
    onPrevious: handlePrevious,
    onToday: handleToday,
    onDayView: () => setCurrentView(VIEW_TYPES.DAY),
    onWeekView: () => !isMobile && setCurrentView(VIEW_TYPES.WEEK),
    onMonthView: () => setCurrentView(VIEW_TYPES.MONTH),
  });

  const filteredEvents = filterEventsByView(events, currentDate, currentView);

  useEffect(() => {
    if (isMobile) {
      setCurrentView(VIEW_TYPES.DAY);
    } else {
      setCurrentView(VIEW_TYPES.WEEK);
    }
    navigateToWorkingDay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  if (!program) {
    return (
      <main className={styles.main}>
        <div className={styles.welcomeContainer}>
          <h1 className={styles.welcomeTitle}>Program Not Found</h1>
          <p className={styles.welcomeDescription}>
            The requested program could not be found.
          </p>
          <button className={styles.backButton} onClick={handleBackToHome}>
            ← Back to home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <CalendarHeader
        currentDate={currentDate}
        currentView={currentView}
        showMobile={isMobile}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onViewChange={handleViewChange}
        programDisplayName={program.displayName}
      />

      <TimetableView
        currentDate={currentDate}
        currentView={currentView}
        events={events}
        onCellSizeChange={setCellSize}
        onDayClick={handleDayClick}
      />

      {isLoading && <LoadingIndicator />}

      <EventList
        events={filteredEvents}
        currentView={currentView}
        cellSize={cellSize}
      />
    </main>
  );
}
