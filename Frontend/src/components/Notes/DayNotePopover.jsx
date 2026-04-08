import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Save } from "lucide-react";
import { useCalendar } from "../../context";
import { getHoliday, toFullLabel } from "../../utils";

/**
 * DayNotePopover
 * ──────────────
 * Opens when user:
 *   • Clicks start day again after range starts
 *   • Clicks any day inside a completed range
 *   • Right-clicks any in-month day
 *
 * Keyboard: Ctrl+Enter saves · Escape closes
 * Click backdrop → auto-saves and closes
 */
export default function DayNotePopover() {
  const { popoverDate, setPopoverDate, getDayNote, saveDayNote } = useCalendar();

  const [text, setText]   = useState("");
  const textareaRef       = useRef(null);

  /* Sync text when target date changes */
  useEffect(() => {
    if (popoverDate) {
      setText(getDayNote(popoverDate));
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [popoverDate]);

  const handleSave = useCallback(() => {
    if (popoverDate) saveDayNote(popoverDate, text);
    setPopoverDate(null);
  }, [popoverDate, text]);

  const handleDelete = useCallback(() => {
    if (popoverDate) saveDayNote(popoverDate, "");
    setPopoverDate(null);
  }, [popoverDate]);

  /* Global Escape listener */
  useEffect(() => {
    if (!popoverDate) return;
    const onKey = (e) => { if (e.key === "Escape") handleSave(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [popoverDate, handleSave]);

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSave();
  };

  const holiday     = popoverDate ? getHoliday(popoverDate) : null;
  const existsNote  = popoverDate ? !!getDayNote(popoverDate) : false;

  return (
    <AnimatePresence>
      {popoverDate && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleSave}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Note for ${popoverDate?.getDate()}`}
            initial={{ opacity: 0, scale: 0.9,  y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92,  y: 8  }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed z-50 w-[340px] max-w-[calc(100vw-32px)]
                       rounded-2xl overflow-hidden
                       bg-[var(--surface)] border border-[var(--border)]"
            style={{
              top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
            }}
          >
            {/* ── Colored top accent bar ─────────────────────────── */}
            <div
              className="h-1 w-full"
              style={{ background: "var(--mod-primary)" }}
            />

            {/* ── Header ───────────────────────────────────────────── */}
            <div className="flex items-start justify-between px-4 pt-4 pb-3
                            border-b border-[var(--border)]">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span
                    className="text-4xl font-bold leading-none"
                    style={{ color: "var(--mod-primary)", fontFamily: "'Outfit', sans-serif" }}
                  >
                    {popoverDate.getDate()}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--text)]">
                      {popoverDate.toLocaleString("default", { weekday: "long" })}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {popoverDate.toLocaleString("default", { month: "long", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Holiday chip */}
                {holiday && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold
                               px-2.5 py-1 rounded-full
                               bg-orange-100 text-orange-700
                               dark:bg-orange-900/30 dark:text-orange-300"
                  >
                    🎉 {holiday}
                  </motion.span>
                )}
              </div>

              <button
                onClick={handleSave}
                aria-label="Close"
                className="w-8 h-8 rounded-full flex items-center justify-center
                           text-[var(--text-muted)] hover:bg-[var(--surface-2)]
                           hover:text-[var(--text)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* ── Textarea ──────────────────────────────────────────── */}
            <div className="px-4 py-3">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Write a note for this day… (Ctrl+Enter to save)"
                rows={4}
                className="notes-textarea"
                aria-label={`Note for ${toFullLabel(popoverDate)}`}
              />
            </div>

            {/* ── Footer ───────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 pb-4">
              <span className="text-[10px] text-[var(--text-faint)]">
                {text.length > 0 ? `${text.length} chars` : "Right-click any day anytime"}
              </span>

              <div className="flex items-center gap-2">
                {existsNote && (
                  <motion.button
                    onClick={handleDelete}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Delete note"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                               text-xs font-medium text-red-500
                               hover:bg-red-50 dark:hover:bg-red-900/20
                               transition-colors"
                  >
                    <Trash2 size={12} /> Delete
                  </motion.button>
                )}

                <motion.button
                  onClick={handleSave}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Save note"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg
                             text-xs font-semibold text-white
                             transition-all hover:opacity-90"
                  style={{
                    background: "var(--mod-primary)",
                    boxShadow: "0 2px 8px color-mix(in srgb, var(--mod-primary) 40%, transparent)",
                  }}
                >
                  <Save size={12} /> Save
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
