import { motion, AnimatePresence } from "framer-motion";
import { endOfMonth } from "date-fns";
import { clsx } from "clsx";
import { X } from "lucide-react";
import { useCalendar } from "../../context";
import { toShortLabel } from "../../utils";
import CalendarDay from "./CalenderDay";

const DAY_ABBR = ["M","T","W","T","F","S","S"];
const DAY_FULL = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const ROW_VARIANTS = {
  hidden: {
    opacity: 0,
    y: -14,
    rotateX: -10,
    filter: "blur(3px)",
  },
  visible: (rowIndex) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      delay: rowIndex * 0.055,
      type: "spring",
      stiffness: 380,
      damping: 26,
      filter: { delay: rowIndex * 0.055, duration: 0.22 },
    },
  }),
};

const TABLE_VARIANTS = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
  exit:    { opacity: 0, transition: { duration: 0.12 } },
};

export default function CalendarGrid() {
  const {
    viewDate, calendarGrid,
    rangeStart, rangeEnd,
    clearRange, selectedDaysCount,
  } = useCalendar();

  const gridKey     = `${viewDate.getFullYear()}-${viewDate.getMonth()}`;
  const lastOfMonth = endOfMonth(viewDate);

  return (
    <div className="flex flex-col h-full bg-[var(--surface)]">

      <div className="flex-1 px-2 pt-2 pb-1 overflow-hidden" style={{ perspective: "600px" }}>
        <AnimatePresence mode="wait">
          <motion.table
            key={gridKey}
            role="grid"
            aria-label={`Calendar — ${viewDate.toLocaleString("default", { month: "long", year: "numeric" })}`}
            className="w-full table-fixed border-collapse"
            variants={TABLE_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformStyle: "preserve-3d" }}
          >
            <thead>
              <tr role="row">
                {DAY_ABBR.map((d, i) => (
                  <th key={`${d}-${i}`} scope="col" aria-label={DAY_FULL[i]}
                    className={clsx(
                      "text-center pb-2 pt-1 select-none",
                      "text-[10px] font-bold tracking-widest uppercase",
                      i >= 5 ? "text-[var(--mod-primary)]" : "text-[var(--text-faint)]"
                    )}
                    style={{ width: "14.285%" }}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {calendarGrid.map((week, wi) => (
                <motion.tr
                  key={wi}
                  role="row"
                  custom={wi}
                  variants={ROW_VARIANTS}
                  style={{ transformOrigin: "center top" }}
                >
                  {week.map((date, ci) => (
                    <CalendarDay
                      key={date.toISOString()}
                      date={date}
                      colIndex={ci}
                      isFirst={date.getDate()===1 && date.getMonth()===viewDate.getMonth()}
                      isLast={date.getDate()===lastOfMonth.getDate() && date.getMonth()===viewDate.getMonth()}
                    />
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </AnimatePresence>
      </div>

      <div className="px-3 py-2 border-t border-[var(--border)]
                      flex items-center justify-between bg-[var(--surface-2)]">
        <span className="text-[10px] text-[var(--text-faint)] font-medium">
          {lastOfMonth.getDate()} days
        </span>

        <AnimatePresence>
          {rangeStart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 4  }}
              animate={{ opacity: 1, scale: 1,   y: 0  }}
              exit={{   opacity: 0, scale: 0.8,  y: 4  }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                         bg-[var(--mod-light)] dark:bg-[var(--mod-primary)]/20"
            >
              <span className="text-[10px] font-semibold text-[var(--mod-primary)]">
                {!rangeEnd
                  ? toShortLabel(rangeStart)
                  : `${toShortLabel(rangeStart)} → ${toShortLabel(rangeEnd)} · ${selectedDaysCount}d`
                }
              </span>
              <button onClick={clearRange} aria-label="Clear range"
                className="text-[var(--mod-primary)] hover:text-[var(--mod-dark)] transition-colors">
                <X size={10}/>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
