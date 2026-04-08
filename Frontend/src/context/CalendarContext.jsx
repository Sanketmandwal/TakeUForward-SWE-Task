import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { addMonths, isSameMonth, subMonths } from "date-fns";
import { MODULES } from "../data";
import { STORAGE_KEYS, STREAK_MILESTONE, toDateKey, toMonthKey } from "../utils";
import {
  buildCalendarGrid,
  computeStreak,
  getRangeRole,
  serializeActiveDays,
} from "./calendarHelpers";
import {
  getInitialActiveDays,
  getInitialActiveModule,
  getInitialDarkMode,
  getInitialMonthlyNotes,
  getInitialNotes,
  writeStorage,
} from "./calendarStorage";

export const CalendarCtx = createContext(null);

export function CalendarProvider({ children }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [activeModule, setActiveModule] = useState(getInitialActiveModule);
  const [isDark, setIsDark] = useState(getInitialDarkMode);

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  const [notes, setNotes] = useState(getInitialNotes);
  const [monthlyNotes, setMonthlyNotes] = useState(getInitialMonthlyNotes);
  const [activeDays, setActiveDays] = useState(getInitialActiveDays);

  const [popoverDate, setPopoverDate] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => writeStorage(STORAGE_KEYS.MODULE, activeModule), [activeModule]);
  useEffect(() => writeStorage(STORAGE_KEYS.DARK, isDark), [isDark]);
  useEffect(() => writeStorage(STORAGE_KEYS.NOTES, notes), [notes]);
  useEffect(() => writeStorage(STORAGE_KEYS.MONTHLY_NOTES, monthlyNotes), [monthlyNotes]);
  useEffect(() => {
    writeStorage(STORAGE_KEYS.ACTIVE_DAYS, serializeActiveDays(activeDays));
  }, [activeDays]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const calendarGrid = useMemo(() => buildCalendarGrid(viewDate), [viewDate]);
  const moduleConfig = useMemo(() => MODULES[activeModule], [activeModule]);

  const goToPrevMonth = useCallback(() => setViewDate((date) => subMonths(date, 1)), []);
  const goToNextMonth = useCallback(() => setViewDate((date) => addMonths(date, 1)), []);
  const goToToday = useCallback(() => setViewDate(new Date()), []);
  const jumpToYear = useCallback((year) => {
    setViewDate((date) => {
      const nextDate = new Date(date);
      nextDate.setFullYear(year);
      return nextDate;
    });
  }, []);

  const switchModule = useCallback((moduleId) => setActiveModule(moduleId), []);

  const handleDayClick = useCallback((date) => {
    if (!isSameMonth(date, viewDate)) return;

    if (!rangeStart || rangeEnd) {
      setRangeStart(date);
      setRangeEnd(null);
      return;
    }

    if (date < rangeStart) {
      setRangeEnd(rangeStart);
      setRangeStart(date);
      return;
    }

    setRangeEnd(date);
  }, [rangeEnd, rangeStart, viewDate]);

  const clearRange = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
    setHoveredDate(null);
  }, []);

  const selectedDaysCount = useMemo(() => {
    if (!rangeStart || !rangeEnd) return rangeStart ? 1 : 0;
    return Math.round((rangeEnd - rangeStart) / 86400000) + 1;
  }, [rangeEnd, rangeStart]);

  const getDateRangeRole = useCallback(
    (date) => getRangeRole(date, rangeStart, rangeEnd, hoveredDate),
    [hoveredDate, rangeEnd, rangeStart],
  );

  const getDayNote = useCallback(
    (date) => notes[activeModule]?.[toDateKey(date)] ?? "",
    [activeModule, notes],
  );

  const saveDayNote = useCallback((date, text) => {
    setNotes((prev) => ({
      ...prev,
      [activeModule]: {
        ...(prev[activeModule] ?? {}),
        [toDateKey(date)]: text,
      },
    }));
  }, [activeModule]);

  const hasDayNote = useCallback(
    (date) => Boolean(notes[activeModule]?.[toDateKey(date)]),
    [activeModule, notes],
  );

  const getMonthNote = useCallback(
    (date) => monthlyNotes[activeModule]?.[toMonthKey(date)] ?? "",
    [activeModule, monthlyNotes],
  );

  const saveMonthNote = useCallback((date, text) => {
    setMonthlyNotes((prev) => ({
      ...prev,
      [activeModule]: {
        ...(prev[activeModule] ?? {}),
        [toMonthKey(date)]: text,
      },
    }));
  }, [activeModule]);

  const rangeNotes = useMemo(() => {
    if (!rangeStart || !rangeEnd) return [];

    const notesInRange = [];
    const lowerBound = rangeStart <= rangeEnd ? rangeStart : rangeEnd;
    const upperBound = rangeStart <= rangeEnd ? rangeEnd : rangeStart;
    const current = new Date(lowerBound);

    while (current <= upperBound) {
      const key = toDateKey(current);
      const text = notes[activeModule]?.[key];

      if (text) {
        notesInRange.push({ date: new Date(current), key, text });
      }

      current.setDate(current.getDate() + 1);
    }

    return notesInRange;
  }, [activeModule, notes, rangeEnd, rangeStart]);

  const currentStreak = useMemo(() => {
    const moduleDays = activeDays[activeModule];
    const normalized = moduleDays instanceof Set
      ? [...moduleDays]
      : Array.isArray(moduleDays)
        ? moduleDays
        : [];

    return computeStreak(normalized);
  }, [activeDays, activeModule]);

  const markTodayActive = useCallback(() => {
    const todayKey = toDateKey(new Date());

    setActiveDays((prev) => {
      const existingDays = prev[activeModule] instanceof Set
        ? prev[activeModule]
        : new Set(Array.isArray(prev[activeModule]) ? prev[activeModule] : []);

      if (existingDays.has(todayKey)) return prev;

      const nextDays = new Set(existingDays);
      nextDays.add(todayKey);

      const streak = computeStreak([...nextDays]);
      if (streak > 0 && streak % STREAK_MILESTONE === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }

      return { ...prev, [activeModule]: nextDays };
    });
  }, [activeModule]);

  const toggleDark = useCallback(() => setIsDark((value) => !value), []);

  const value = {
    viewDate,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    jumpToYear,
    activeModule,
    switchModule,
    moduleConfig,
    calendarGrid,
    rangeStart,
    rangeEnd,
    hoveredDate,
    setHoveredDate,
    handleDayClick,
    clearRange,
    getDateRangeRole,
    selectedDaysCount,
    getDayNote,
    saveDayNote,
    hasDayNote,
    getMonthNote,
    saveMonthNote,
    rangeNotes,
    activeDays,
    currentStreak,
    markTodayActive,
    popoverDate,
    setPopoverDate,
    showConfetti,
    isDark,
    toggleDark,
  };

  return <CalendarCtx.Provider value={value}>{children}</CalendarCtx.Provider>;
}
