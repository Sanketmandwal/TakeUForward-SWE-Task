import { useContext } from "react";
import { CalendarCtx } from "./CalendarContext";

export function useCalendar() {
  const context = useContext(CalendarCtx);

  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }

  return context;
}
