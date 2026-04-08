export const HOLIDAYS = {
  "01-01": "New Year",
  "01-26": "Republic Day",
  "08-15": "Independence Day",
  "10-02": "Gandhi Jayanti",
  "10-24": "Dussehra 2025",
  "11-01": "Diwali 2024",
  "12-25": "Christmas",
  "2026-03-25": "Holi",
  "2026-10-20": "Diwali",
};

export function getHoliday(date) {
  const full = `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const recurring = full.slice(5);
  return HOLIDAYS[full] || HOLIDAYS[recurring] || null;
}

export const STORAGE_KEYS = {
  MODULE: "tuf-cal-module",
  DARK: "tuf-cal-dark",
  NOTES: "tuf-cal-notes",
  MONTHLY_NOTES: "tuf-cal-monthly-notes",
  ACTIVE_DAYS: "tuf-cal-active-days",
};

export const STREAK_MILESTONE = 7;
