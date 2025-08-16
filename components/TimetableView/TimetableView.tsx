import { DateTime } from "luxon";
import { Dispatch, SetStateAction } from "react";
import TimetableDay from "@/components/TimetableDay/TimetableDay";
import TimetableWeek from "@/components/TimetableWeek/TimetableWeek";
import TimetableMonth from "@/components/TimetableMonth/TimetableMonth";
import { ViewType, VIEW_TYPES } from "@/utils/constants/AppConstants";
import ICalEvent from "@/utils/interfaces/ICalEvent";

interface CellSize {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TimetableViewProps {
  currentDate: DateTime;
  currentView: ViewType;
  events: ICalEvent[];
  onCellSizeChange: Dispatch<SetStateAction<CellSize>>;
}

export default function TimetableView({
  currentDate,
  currentView,
  events,
  onCellSizeChange,
}: TimetableViewProps) {
  const renderView = () => {
    const commonProps = {
      date: currentDate,
      setCellSize: onCellSizeChange,
    };

    switch (currentView) {
      case VIEW_TYPES.DAY:
        return <TimetableDay {...commonProps} />;
      case VIEW_TYPES.WEEK:
        return <TimetableWeek {...commonProps} />;
      case VIEW_TYPES.MONTH:
        return <TimetableMonth {...commonProps} events={events} />;
      default:
        return null;
    }
  };

  return <>{renderView()}</>;
}
