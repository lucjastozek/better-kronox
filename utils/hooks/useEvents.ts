import { useEffect, useState } from "react";
import axios from "axios";
import ICalEvent from "@/utils/interfaces/ICalEvent";

interface UseEventsReturn {
  events: ICalEvent[];
  isLoading: boolean;
  error: string | null;
}

export const useEvents = (programId?: string): UseEventsReturn => {
  const [events, setEvents] = useState<ICalEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const url = programId ? `/api/schedule/${programId}` : "/api/schedule";
        const response = await axios.get(url);
        setEvents(response.data.events);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch events";
        setError(errorMessage);
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [programId]);

  return { events, isLoading, error };
};
