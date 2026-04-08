import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useCalendar } from "../../context";
import { toShortLabel } from "../../utils";

const LINE_HEIGHT = 28;

function ruledLinesBg(lineColor) {
  return {
    backgroundImage: `repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent ${LINE_HEIGHT - 1}px,
      ${lineColor} ${LINE_HEIGHT - 1}px,
      ${lineColor} ${LINE_HEIGHT}px
    )`,
    backgroundSize: `100% ${LINE_HEIGHT}px`,
    backgroundPositionY: `${LINE_HEIGHT * 2}px`,
  };
}

export default function RangeNotes() {
  const {
    rangeStart,
    rangeEnd,
    rangeNotes,
    saveDayNote,
    selectedDaysCount,
    isDark,
  } = useCalendar();

  const lineColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";

  if (!rangeStart) {
    return (
      <div className="flex-1 flex items-center justify-center px-3" style={ruledLinesBg(lineColor)}>
        <p className="text-[11px] text-[var(--text-faint)] text-center leading-relaxed">
          Select a date range
          <br />
          on the calendar
        </p>
      </div>
    );
  }

  if (rangeNotes.length === 0) {
    return (
      <div className="flex-1 flex flex-col px-3 pt-2 gap-1" style={ruledLinesBg(lineColor)}>
        <p className="text-[11px] font-semibold text-[var(--mod-primary)]">
          {toShortLabel(rangeStart)}{rangeEnd ? ` -> ${toShortLabel(rangeEnd)}` : ""} · {selectedDaysCount}d
        </p>
        <p className="text-[10px] text-[var(--text-faint)]">
          Right-click any day to add notes
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 pt-2 flex flex-col gap-1.5" style={ruledLinesBg(lineColor)}>
      <p className="text-[10px] font-semibold text-[var(--mod-primary)] sticky top-0 bg-[var(--surface)] py-0.5">
        {toShortLabel(rangeStart)}{rangeEnd ? ` -> ${toShortLabel(rangeEnd)}` : ""} · {selectedDaysCount}d
      </p>

      {rangeNotes.map(({ date, key, text }) => (
        <motion.div
          key={key}
          layout
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-start gap-2 py-1"
        >
          <span className="shrink-0 text-[10px] font-bold text-[var(--mod-primary)] w-8 leading-[18px]">
            {date.getDate()}
          </span>
          <p className="flex-1 text-[11px] text-[var(--text)] leading-tight line-clamp-2">
            {text}
          </p>
          <button
            onClick={() => saveDayNote(date, "")}
            aria-label="Delete note"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-faint)] hover:text-red-500"
          >
            <Trash2 size={10} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
