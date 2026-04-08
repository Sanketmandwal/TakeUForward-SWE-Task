import { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useCalendar } from "../../context";
import { ModuleSelector } from "../Modules";
import { NotesPanel, DayNotePopover } from "../Notes";
import { ThemeToggle } from "../ui";
import { ExportButton } from "../Export";
import { MarkTodayButton } from "../Streak";
import BinderStrip from "./BinderStrip";
import CalendarGrid from "./CalendarGrid";
import CalendarHeader from "./CalendarHeader";
import Confetti from "./Confetti";

export default function CalendarApp() {
  const { activeModule, showConfetti } = useCalendar();
  const [displayModule, setDisplayModule] = useState(activeModule);
  const controls = useAnimation();

  useEffect(() => {
    if (displayModule === activeModule) return;

    controls
      .start({ rotateY: 90, transition: { duration: 0.17, ease: [0.4, 0, 1, 1] } })
      .then(() => {
        setDisplayModule(activeModule);
        controls.set({ rotateY: -90 });
      })
      .then(() =>
        controls.start({ rotateY: 0, transition: { duration: 0.2, ease: [0, 0, 0.2, 1] } }),
      );
  }, [activeModule, controls, displayModule]);

  return (
    <div
      data-module={displayModule}
      className="min-h-screen bg-[var(--bg)] transition-colors duration-300 py-6 lg:py-10 px-4"
    >
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>
      <DayNotePopover />

      <div className="w-full max-w-[780px] mx-auto">
        <div className="flex flex-col gap-3 mb-3 px-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <ModuleSelector />
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_36px] gap-2 items-center sm:flex sm:flex-nowrap sm:items-center sm:justify-end">
            <MarkTodayButton />
            <ExportButton />
            <ThemeToggle />
          </div>
        </div>

        <div style={{ perspective: "1200px", perspectiveOrigin: "center center" }}>
          <motion.div
            animate={controls}
            initial={{ rotateY: 0 }}
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div
              className="w-full bg-[var(--surface)] border border-[var(--border)]"
              style={{
                borderRadius: "14px",
                boxShadow: "var(--shadow-lg)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <BinderStrip />

              <div style={{ overflow: "visible", position: "relative", zIndex: 2 }}>
                <CalendarHeader />
              </div>

              <div
                className="flex flex-col sm:flex-row border-t border-[var(--border)]"
                style={{ paddingTop: "52px", position: "relative", zIndex: 1 }}
              >
                <div className="sm:w-[36%] border-b sm:border-b-0 sm:border-r border-[var(--border)] min-h-[200px]">
                  <NotesPanel />
                </div>
                <div className="flex-1 min-h-[200px]">
                  <CalendarGrid />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <p className="mt-4 text-[11px] text-[var(--text-faint)] text-center">
          <span className="font-semibold text-[var(--mod-primary)]">Right-click any day to add a note</span>
        </p>
      </div>
    </div>
  );
}
