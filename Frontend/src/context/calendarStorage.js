import { STORAGE_KEYS } from "../utils";
import { createEmptyModuleMap, normalizeActiveDays } from "./calendarHelpers";

const DEFAULT_ACTIVE_DAYS = {
  dsa: [
    "2026-03-14", "2026-03-16", "2026-03-17", "2026-03-18", "2026-03-19",
    "2026-03-20", "2026-03-21", "2026-03-22", "2026-03-24", "2026-03-25",
    "2026-03-26", "2026-03-27", "2026-03-28", "2026-03-29", "2026-03-30",
   "2026-04-01", "2026-04-03", "2026-04-04", "2026-04-05",
    "2026-04-06", "2026-04-07","2026-04-08",
  ],
  lld: [
    "2026-03-17", "2026-03-19", "2026-03-21", "2026-03-23", "2026-03-25",
    "2026-03-27", "2026-03-29", "2026-03-31", "2026-04-02", "2026-04-04",
    "2026-04-06", "2026-04-08",
  ],
  sql: [
    "2026-04-02", "2026-04-03", "2026-04-04", "2026-04-05",
    "2026-04-06", "2026-04-07", "2026-04-08",
  ],
};

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn("Failed to write to localStorage:", key, value);
  }
}

function migrateModuleScopedNotes(stored) {
  if (!stored) return createEmptyModuleMap();

  if (!stored.dsa && !stored.lld && !stored.sql) {
    return { dsa: stored, lld: {}, sql: {} };
  }

  return stored;
}

export function getInitialActiveModule() {
  return readStorage(STORAGE_KEYS.MODULE, "dsa");
}

export function getInitialDarkMode() {
  return readStorage(STORAGE_KEYS.DARK, false);
}

export function getInitialNotes() {
  return migrateModuleScopedNotes(readStorage(STORAGE_KEYS.NOTES, null));
}

export function getInitialMonthlyNotes() {
  return migrateModuleScopedNotes(readStorage(STORAGE_KEYS.MONTHLY_NOTES, null));
}

export function getInitialActiveDays() {
  return normalizeActiveDays(readStorage(STORAGE_KEYS.ACTIVE_DAYS, DEFAULT_ACTIVE_DAYS));
}
