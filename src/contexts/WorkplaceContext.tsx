// src/contexts/WorkplaceContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface Workplace {
  id: number;
  image: string;
  title: string;
  description: string;
  durationWeekStartHour: number;
  durationWeekStartMinute: number;
  durationWeekEndHour: number;
  durationWeekEndMinute: number;
  durationSaturdayStartHour: number;
  durationSaturdayStartMinute: number;
  durationSaturdayEndHour: number;
  durationSaturdayEndMinute: number;
  weekPrice: string;
  saturdayPrice: string;
  stock: number;
  valide?: boolean;
  alt?: string;
}

interface WorkplaceContextType {
  workplaces: Workplace[];
  fetchWorkplaces: () => void;
}

const WorkplaceContext = createContext<WorkplaceContextType | undefined>(
  undefined
);

export const WorkplaceProvider = ({ children }: { children: ReactNode }) => {
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);

  const fetchWorkplaces = async () => {
    try {
      const response = await fetch("/api/post/get");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWorkplaces(data);
    } catch (error) {
      console.error("Error fetching workplaces:", error);
    }
  };

  useEffect(() => {
    fetchWorkplaces();
  }, []);

  return (
    <WorkplaceContext.Provider value={{ workplaces, fetchWorkplaces }}>
      {children}
    </WorkplaceContext.Provider>
  );
};

export const useWorkplaceContext = () => {
  const context = useContext(WorkplaceContext);
  if (context === undefined) {
    throw new Error(
      "useWorkplaceContext must be used within a WorkplaceProvider"
    );
  }
  return context;
};
