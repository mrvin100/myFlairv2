"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

const DateContext = createContext<DateContextType | null>(null); //fournir une valeur par defaut

interface DateContextType {
  addDate: (Date: string, isSaturday: boolean) => void;
  removeDate: (Date?: string, isSaturday?: boolean, allDates?: boolean) => void;
  selectedWeekDays: string[];
  selectedSaturdays: string[];
}

interface DateProviderProps<TChildren> {
  children: TChildren;
}

export const DateProvider = ({ children }: DateProviderProps<ReactNode>) => {
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([]);
  const [selectedSaturdays, setSelectedSaturdays] = useState<string[]>([]);

  const addDate = (date: string, isSaturday: boolean) => {
    if (isSaturday) {
      setSelectedSaturdays([...selectedSaturdays, date]);
    } else {
      setSelectedWeekDays([...selectedWeekDays, date]);
    }
  };

  const removeDate = (date?: string, isSaturday?: boolean, allDates?: boolean) => {
    if (allDates) {
      setSelectedWeekDays([]);
      setSelectedSaturdays([]);
      return;
    }
      if (isSaturday) {
        setSelectedSaturdays(selectedSaturdays.filter((d) => d !== date));
      } else {
        setSelectedWeekDays(selectedWeekDays.filter((d) => d !== date));
      }
    
  };

  return (
    <DateContext.Provider
      value={{ addDate, removeDate, selectedWeekDays, selectedSaturdays }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = (): DateContextType => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDateContext must be used within a DateProvider");
  }
  return context;
};