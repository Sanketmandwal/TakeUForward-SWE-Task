import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCalendar } from "../../context";
import { toDateKey } from "../../utils";

export default function MarkTodayButton() {
  const {
    activeDays,
    activeModule,
    currentStreak,
    markTodayActive,
    moduleConfig,
  } = useCalendar();

  const todayKey = toDateKey(new Date());
  const moduleDays = activeDays[activeModule];
  const markedToday = moduleDays instanceof Set
    ? moduleDays.has(todayKey)
    : Array.isArray(moduleDays)
      ? moduleDays.includes(todayKey)
      : false;

  return (
    <motion.button
      onClick={markTodayActive}
      disabled={markedToday}
      whileHover={markedToday ? {} : { scale: 1.04 }}
      whileTap={markedToday ? {} : { scale: 0.94 }}
      aria-label={markedToday ? "Today already marked" : `Mark today active for ${moduleConfig.label}`}
      className="w-full h-9 flex items-center justify-center gap-1.5 px-3 rounded-full
                 min-w-0 sm:min-w-[110px] text-[12px] font-semibold transition-colors
                 border focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-[var(--mod-primary)]/40
                 disabled:cursor-default"
      style={{
        background: markedToday ? "var(--mod-light)" : "var(--mod-primary)",
        color: markedToday ? "var(--mod-primary)" : "#fff",
        borderColor: markedToday ? "transparent" : "var(--mod-primary)",
      }}
    >
      <CheckCircle2 size={13} />
      <span>{markedToday ? "Marked" : "Mark Today"}</span>
      <span className="hidden sm:inline opacity-80">
        {currentStreak > 0 ? `· ${currentStreak}d` : ""}
      </span>
    </motion.button>
  );
}
