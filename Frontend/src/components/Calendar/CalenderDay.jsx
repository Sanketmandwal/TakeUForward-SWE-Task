import { memo } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { isToday, isSameMonth } from "date-fns";
import { useCalendar } from "../../context";
import { getHoliday, toDateKey, toFullLabel } from "../../utils";

const STREAK_EMOJI = { dsa: "🔥", lld: "⚡", sql: "💎" };

const CalendarDay = memo(function CalendarDay({ date, colIndex, isFirst, isLast }) {
  const {
    viewDate, activeModule,
    handleDayClick, setHoveredDate,
    getDateRangeRole, hasDayNote,
    setPopoverDate, rangeStart, rangeEnd,
    activeDays,
  } = useCalendar();

  const today    = isToday(date);
  const inMonth  = isSameMonth(date, viewDate);
  const holiday  = getHoliday(date);
  const hasNote  = hasDayNote(date);
  const role     = getDateRangeRole(date);
  const dateKey  = toDateKey(date);


  const modDaysRaw  = activeDays[activeModule];
  const modDaysSet  = modDaysRaw instanceof Set
    ? modDaysRaw
    : new Set(Array.isArray(modDaysRaw) ? modDaysRaw : Object.values(modDaysRaw ?? {}));
  const isStreakDay = inMonth && modDaysSet.has(dateKey);
  const streakEmoji = STREAK_EMOJI[activeModule] ?? "🔥";

  const isStart      = role === "start";
  const isEnd        = role === "end";
  const isInRange    = role === "in-range";
  const isPreview    = role === "preview";
  const isPreviewEnd = role === "preview-end";
  const showBand     = isInRange || isPreview;

  const roundLeft  = colIndex === 0 || isFirst || isStart;
  const roundRight = colIndex === 6 || isLast  || isEnd || isPreviewEnd;

  const handleClick = () => {
    if (rangeStart && rangeEnd && (isInRange || isStart || isEnd)) {
      setPopoverDate(date); return;
    }
    handleDayClick(date);
  };

  return (
    <td role="gridcell" style={{ padding: 0, verticalAlign: "middle", textAlign: "center", width: "14.285%" }}>
      <div
        className={clsx(
          "day-cell-wrapper",
          showBand            && "in-range",
          isPreview           && "preview",
          isStart && !isEnd   && "range-start",
          isEnd   && !isStart && "range-end",
          isStart && isEnd    && "range-start range-end",
          roundLeft  && (showBand || isStart) && "band-round-left",
          roundRight && (showBand || isEnd)   && "band-round-right",
        )}
      >
        <motion.button
          onClick={handleClick}
          onMouseEnter={() => inMonth && setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
          onContextMenu={(e) => { e.preventDefault(); setPopoverDate(date); }}
          aria-label={[
            toFullLabel(date),
            today        ? "Today"               : null,
            holiday      ? `Holiday: ${holiday}` : null,
            hasNote      ? "Has note"            : null,
            isStreakDay  ? "Streak day"          : null,
            isStart      ? "Range start"         : null,
            isEnd        ? "Range end"           : null,
          ].filter(Boolean).join(", ")}
          aria-pressed={isStart || isEnd}
          disabled={!inMonth}
          whileTap={inMonth ? { scale: 0.82 } : {}}
          className={clsx(
            "day-btn",
            !inMonth && "opacity-20 cursor-default pointer-events-none",
            today && !isStart && !isEnd && "is-today",
            (isStart || isEnd) && "is-range-start",
            !isStart && !isEnd && inMonth && colIndex >= 5 && "weekend",
            holiday && !isStart && !isEnd && inMonth && "holiday",
            isStreakDay && !isStart && !isEnd && "streak-day",
          )}
        >
          {isStreakDay && (
            <motion.span
              className="streak-ghost"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.05 }}
              aria-hidden="true"
            >
              {streakEmoji}
            </motion.span>
          )}

          <span className="relative z-10 leading-none select-none tabular-nums">
            {date.getDate()}
          </span>

          {hasNote && inMonth && (
            <motion.span
              className="note-dot"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 20 }}
              aria-hidden="true"
            />
          )}

          {holiday && inMonth && (
            <span
              className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-orange-400"
              title={holiday}
              aria-hidden="true"
            />
          )}
        </motion.button>
      </div>
    </td>
  );
});

export default CalendarDay;
