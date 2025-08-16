import { DateTime } from "luxon";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { ViewType, VIEW_TYPES } from "@/utils/constants/AppConstants";

interface CalendarHeaderProps {
  currentDate: DateTime;
  currentView: ViewType;
  showMobile: boolean;
  programDisplayName: string;
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: ViewType) => void;
}

export default function CalendarHeader({
  currentDate,
  currentView,
  showMobile,
  onPrevious,
  onNext,
  onViewChange,
  programDisplayName,
}: CalendarHeaderProps) {
  return (
    <header className="header">
      <div className="headerDate">
        <div>
          <button className="iconButton" onClick={onPrevious}>
            <NavigateBeforeIcon />
          </button>
          <button className="iconButton" onClick={onNext}>
            <NavigateNextIcon />
          </button>
        </div>
        <h1>{currentDate.toFormat("LLLL yyyy")}</h1>
      </div>

      {!showMobile && <p>{programDisplayName}</p>}

      <div className="buttons">
        {showMobile ? (
          <div className="mobileViewToggle">
            <button
              className={`mobileViewButton ${currentView === VIEW_TYPES.DAY ? "active" : ""}`}
              onClick={() => onViewChange(VIEW_TYPES.DAY)}
              aria-label="Day view"
            >
              Day
            </button>
            <button
              className={`mobileViewButton ${currentView === VIEW_TYPES.MONTH ? "active" : ""}`}
              onClick={() => onViewChange(VIEW_TYPES.MONTH)}
              aria-label="Month view"
            >
              Month
            </button>
          </div>
        ) : (
          <div className="mobileViewToggle">
            <button
              className={`mobileViewButton ${currentView === VIEW_TYPES.DAY ? "active" : ""}`}
              onClick={() => onViewChange(VIEW_TYPES.DAY)}
              aria-label="Day view"
            >
              Day
            </button>
            <button
              className={`mobileViewButton ${currentView === VIEW_TYPES.WEEK ? "active" : ""}`}
              onClick={() => onViewChange(VIEW_TYPES.WEEK)}
              aria-label="Week view"
            >
              Week
            </button>
            <button
              className={`mobileViewButton ${currentView === VIEW_TYPES.MONTH ? "active" : ""}`}
              onClick={() => onViewChange(VIEW_TYPES.MONTH)}
              aria-label="Month view"
            >
              Month
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
