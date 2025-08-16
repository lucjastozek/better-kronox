import { DateTime } from "luxon";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ViewType, VIEW_TYPES } from "@/utils/constants/AppConstants";
import { formatWeekRange } from "@/utils/dateHelpers";

interface CalendarHeaderProps {
  currentDate: DateTime;
  currentView: ViewType;
  showMobile: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: ViewType) => void;
}

export default function CalendarHeader({
  currentDate,
  currentView,
  showMobile,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
}: CalendarHeaderProps) {
  const getHeaderTitle = (): string => {
    switch (currentView) {
      case VIEW_TYPES.MONTH:
        return currentDate.toFormat("LLLL yyyy");
      case VIEW_TYPES.WEEK:
        return `Week ${currentDate.weekNumber}: ${formatWeekRange(currentDate)}`;
      case VIEW_TYPES.DAY:
        return currentDate.toFormat("dd LLLL");
      default:
        return "";
    }
  };

  return (
    <header className="header">
      <button className="todayButton" onClick={onToday}>
        Today
      </button>

      <h1>{getHeaderTitle()}</h1>

      <div className="buttons">
        {!showMobile && (
          <Select
            value={currentView}
            onChange={(e) => onViewChange(e.target.value as ViewType)}
            size="small"
            sx={{
              color: "var(--foreground)",
              border: "0.1rem solid rgba(var(--foreground), 0.2)",
              borderRadius: "clamp(0.6rem, 0.7vw, 1.7rem)",
              marginRight: "1rem",
              fontWeight: "600",
              fontSize: "clamp(1.1rem, 0.05rem + 1.2vw, 3rem) !important",
              paddingBlock:
                "clamp(0.6rem - 8.5px, 0.7vw - 8.5px, 1.7rem - 8.5px) !important",
              paddingRight:
                "clamp(1rem - 32px, 0.17rem + 0.97vw - 32px, 2.5rem - 32px) !important",
              paddingLeft:
                "clamp(1rem - 14px, 0.17rem + 0.97vw - 14px, 2.5rem - 14px) !important",
              fontFamily: "Arial, sans-serif",
              height: "100%",
            }}
          >
            <MenuItem
              value={VIEW_TYPES.DAY}
              sx={{
                fontSize: "clamp(0.9rem, 0.15rem + 0.87vw, 2.25rem) !important",
              }}
            >
              Day
            </MenuItem>
            <MenuItem
              value={VIEW_TYPES.WEEK}
              sx={{
                fontSize: "clamp(0.9rem, 0.15rem + 0.87vw, 2.25rem) !important",
              }}
            >
              Week
            </MenuItem>
            <MenuItem
              value={VIEW_TYPES.MONTH}
              sx={{
                fontSize: "clamp(0.9rem, 0.15rem + 0.87vw, 2.25rem) !important",
              }}
            >
              Month
            </MenuItem>
          </Select>
        )}

        <button className="iconButton" onClick={onPrevious}>
          <NavigateBeforeIcon />
        </button>

        <button className="iconButton" onClick={onNext}>
          <NavigateNextIcon />
        </button>
      </div>
    </header>
  );
}
