import { format } from "date-fns";

export const toDateKey = (date) => format(date, "yyyy-MM-dd");

export const toMonthKey = (date) => format(date, "yyyy-MM");

export const toMonthLabel = (date) => format(date, "MMMM yyyy");

export const toShortLabel = (date) => format(date, "d MMM");

export const toFullLabel = (date) => format(date, "EEEE, d MMMM yyyy");
