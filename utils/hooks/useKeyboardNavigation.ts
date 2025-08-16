import { useEffect } from "react";

interface KeyboardHandlers {
  onNext?: () => void;
  onPrevious?: () => void;
  onToday?: () => void;
  onDayView?: () => void;
  onWeekView?: () => void;
  onMonthView?: () => void;
  onEscape?: () => void;
}

export const useKeyboardNavigation = (handlers: KeyboardHandlers) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      switch (key) {
        case "n":
        case "ArrowRight":
          handlers.onNext?.();
          break;
        case "p":
        case "ArrowLeft":
          handlers.onPrevious?.();
          break;
        case "t":
          handlers.onToday?.();
          break;
        case "d":
          handlers.onDayView?.();
          break;
        case "w":
          handlers.onWeekView?.();
          break;
        case "m":
          handlers.onMonthView?.();
          break;
        case "Escape":
          handlers.onEscape?.();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
};
