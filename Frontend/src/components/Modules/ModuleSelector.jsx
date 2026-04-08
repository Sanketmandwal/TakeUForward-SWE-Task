import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { Zap, Layout, Database } from "lucide-react";
import { useCalendar } from "../../context";
import { MODULES } from "../../data";
import Badge from "../ui/Badge";

const MODULE_ICONS = {
  dsa: <Zap size={13} />,
  lld: <Layout size={13} />,
  sql: <Database size={13} />,
};

/**
 * ModuleSelector — compact pill row that floats above the calendar card.
 * Switching module → updates CSS vars → entire card recolors instantly.
 */
export default function ModuleSelector() {
  const { activeModule, switchModule, currentStreak, moduleConfig } = useCalendar();
  const modules = Object.values(MODULES);

  return (
    <div className="flex flex-col items-start gap-2 min-w-0 sm:flex-row sm:items-center sm:gap-3">

      {/* ── Module pill tabs ───────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Select TakeUforward module"
        className="flex flex-wrap items-center gap-1 p-1 rounded-xl w-full sm:w-auto
                   bg-[var(--surface)] border border-[var(--border)]
                   shadow-sm"
        style={{ backdropFilter: "blur(8px)" }}
      >
        {modules.map((mod) => {
          const isActive = mod.id === activeModule;
          return (
            <button
              key={mod.id}
              role="tab"
              aria-selected={isActive}
              aria-label={mod.fullLabel}
              onClick={() => switchModule(mod.id)}
              className={clsx(
                "relative flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg flex-1 sm:flex-none",
                "text-xs font-semibold transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[var(--mod-primary)] focus-visible:ring-offset-1",
                isActive
                  ? "text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              )}
            >
              {/* Animated sliding background */}
              {isActive && (
                <motion.div
                  layoutId="module-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: mod.primaryColor }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span aria-hidden="true">{MODULE_ICONS[mod.id]}</span>
                {mod.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Module full name ─────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.span
          key={activeModule}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0  }}
          exit={{   opacity: 0, y:  4  }}
          transition={{ duration: 0.2 }}
          className="text-[11px] sm:text-xs font-medium text-[var(--text-muted)] truncate max-w-full"
        >
          {moduleConfig.fullLabel}
        </motion.span>
      </AnimatePresence>

      {/* ── Streak fire badge ────────────────────────────────────────── */}
      <AnimatePresence>
        {currentStreak > 0 && (
          <motion.div
            key={`streak-${currentStreak}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            exit={{   scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="self-start sm:self-auto"
          >
            <Badge variant="streak" aria-label={`${currentStreak} day streak`}>
              🔥 {currentStreak}d
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
