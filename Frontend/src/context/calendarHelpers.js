import {
  addDays,
  eachWeekOfInterval,
  endOfMonth,
  isSameDay,
  startOfMonth,
} from "date-fns";
import { MODULES } from "../data";

export function createEmptyModuleMap() {
  return Object.keys(MODULES).reduce((acc, key) => {
    acc[key] = {};
    return acc;
  }, {});
}

export function normalizeActiveDays(raw) {
  const normalized = {};

  for (const moduleId of Object.keys(MODULES)) {
    const value = raw?.[moduleId];

    if (value instanceof Set) {
      normalized[moduleId] = value;
    } else if (Array.isArray(value)) {
      normalized[moduleId] = new Set(value);
    } else if (value && typeof value === "object") {
      normalized[moduleId] = new Set(Object.values(value));
    } else {
      normalized[moduleId] = new Set();
    }
  }

  return normalized;
}

export function serializeActiveDays(activeDays) {
  return Object.fromEntries(
    Object.entries(activeDays).map(([moduleId, value]) => [
      moduleId,
      value instanceof Set ? [...value] : Array.isArray(value) ? value : [],
    ]),
  );
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function computeStreak(days = []) {
  if (!days.length) return 0;

  const sorted = [...new Set(days)].sort();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayKey = formatLocalDate(today);
  const yesterdayKey = formatLocalDate(yesterday);
  const lastKey = sorted[sorted.length - 1];

  if (lastKey !== todayKey && lastKey !== yesterdayKey) return 0;

  let streak = 1;

  for (let index = sorted.length - 2; index >= 0; index -= 1) {
    const current = new Date(`${sorted[index + 1]}T00:00:00`);
    const previous = new Date(`${sorted[index]}T00:00:00`);
    const diffInDays = Math.round((current - previous) / 86400000);

    if (diffInDays !== 1) break;
    streak += 1;
  }

  return streak;
}

export function buildCalendarGrid(viewDate) {
  const start = startOfMonth(viewDate);
  const end = endOfMonth(viewDate);
  const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });

  return weeks.map((weekStart) =>
    Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
  );
}

export function getRangeRole(date, rangeStart, rangeEnd, hoveredDate) {
  const effectiveRangeEnd = rangeEnd ?? hoveredDate;
  const lowerBound = rangeStart && effectiveRangeEnd
    ? (rangeStart <= effectiveRangeEnd ? rangeStart : effectiveRangeEnd)
    : rangeStart;
  const upperBound = rangeStart && effectiveRangeEnd
    ? (rangeStart <= effectiveRangeEnd ? effectiveRangeEnd : rangeStart)
    : null;

  if (!lowerBound) return null;
  if (isSameDay(date, lowerBound)) return "start";

  if (upperBound && isSameDay(date, upperBound)) {
    return rangeEnd ? "end" : "preview-end";
  }

  if (
    upperBound &&
    date.getTime() > lowerBound.getTime() &&
    date.getTime() < upperBound.getTime()
  ) {
    return rangeEnd ? "in-range" : "preview";
  }

  return null;
}
