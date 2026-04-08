import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarRange, StickyNote } from "lucide-react";
import { clsx } from "clsx";
import MonthlyNotes from "./MonthlyNotes";
import RangeNotes from "./RangeNotes";

function TabPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative px-2.5 py-0.5 text-[10px] font-semibold rounded-full",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--mod-primary)]",
        active
          ? "bg-[var(--mod-primary)] text-white"
          : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]",
      )}
    >
      {children}
    </button>
  );
}

export default function NotesPanel() {
  const [tab, setTab] = useState("monthly");

  return (
    <div className="flex flex-col h-full bg-[var(--surface)] min-h-[240px]">
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-1.5">
          <StickyNote size={13} className="text-[var(--mod-primary)]" />
          <span className="text-xs font-bold text-[var(--text)] tracking-wide">Notes</span>
        </div>

        <div className="flex items-center gap-1">
          <TabPill active={tab === "monthly"} onClick={() => setTab("monthly")}>
            Monthly
          </TabPill>
          <TabPill active={tab === "range"} onClick={() => setTab("range")}>
            <CalendarRange size={9} className="inline mr-0.5" />
            Range
          </TabPill>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {tab === "monthly" ? <MonthlyNotes /> : <RangeNotes />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
