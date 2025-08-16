import { useEffect, useState } from "react";
import axios from "axios";
import ICalEvent from "@/utils/interfaces/ICalEvent";

interface UseEventsReturn {
  events: ICalEvent[];
  isLoading: boolean;
  error: string | null;
}

export const useEvents = (): UseEventsReturn => {
  const [events, setEvents] = useState<ICalEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get("/api/schedule");
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
  }, []);

  return { events, isLoading, error };
};
