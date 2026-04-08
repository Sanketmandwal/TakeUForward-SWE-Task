import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Save } from "lucide-react";
import { useCalendar } from "../../context";
import { getHoliday, toFullLabel } from "../../utils";

export default function DayNotePopover() {
  const { popoverDate, setPopoverDate, getDayNote, saveDayNote } = useCalendar();
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!popoverDate) return;

    setText(getDayNote(popoverDate));
    const focusTimer = setTimeout(() => textareaRef.current?.focus(), 100);
    return () => clearTimeout(focusTimer);
  }, [getDayNote, popoverDate]);

  const handleSave = useCallback(() => {
    if (popoverDate) saveDayNote(popoverDate, text);
    setPopoverDate(null);
  }, [popoverDate, saveDayNote, setPopoverDate, text]);

  const handleDelete = useCallback(() => {
    if (popoverDate) saveDayNote(popoverDate, "");
    setPopoverDate(null);
  }, [popoverDate, saveDayNote, setPopoverDate]);

  useEffect(() => {
    if (!popoverDate) return;

    const onKey = (event) => {
      if (event.key === "Escape") handleSave();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSave, popoverDate]);

  const onKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      handleSave();
    }
  };

  const holiday = popoverDate ? getHoliday(popoverDate) : null;
  const existsNote = popoverDate ? Boolean(getDayNote(popoverDate)) : false;

  return (
    <AnimatePresence>
      {popoverDate && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleSave}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Note for ${popoverDate.getDate()}`}
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            onClick={(event) => event.stopPropagation()}
            className="fixed z-50 inset-x-3 bottom-3 top-auto max-h-[78dvh]
                       sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:inset-x-auto sm:max-h-[calc(100dvh-24px)]
                       sm:w-[340px] sm:max-w-[calc(100vw-32px)]
                       sm:-translate-x-1/2 sm:-translate-y-1/2
                       rounded-2xl overflow-hidden flex flex-col
                       bg-[var(--surface)] border border-[var(--border)]"
            style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}
          >
            <div className="sm:hidden flex justify-center pt-2 pb-1">
              <span className="h-1.5 w-10 rounded-full bg-[var(--border)]" />
            </div>

            <div className="h-1 w-full" style={{ background: "var(--mod-primary)" }} />

            <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-[var(--border)]">
              <div className="min-w-0">
                <div className="flex items-baseline gap-2.5">
                  <span
                    className="text-4xl font-bold leading-none shrink-0"
                    style={{ color: "var(--mod-primary)", fontFamily: "'Outfit', sans-serif" }}
                  >
                    {popoverDate.getDate()}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-[var(--text)] truncate">
                      {popoverDate.toLocaleString("default", { weekday: "long" })}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] truncate">
                      {popoverDate.toLocaleString("default", { month: "long", year: "numeric" })}
                    </span>
                  </div>
                </div>

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
                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center
                           text-[var(--text-muted)] hover:bg-[var(--surface-2)]
                           hover:text-[var(--text)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-4 py-3 flex-1 overflow-y-auto min-h-0">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Write a note for this day... (Ctrl+Enter to save)"
                rows={6}
                className="notes-textarea min-h-[160px] h-full sm:min-h-[120px]"
                aria-label={`Note for ${toFullLabel(popoverDate)}`}
              />
            </div>

            <div className="flex flex-col gap-3 px-4 pb-4 pt-1 border-t border-[var(--border)] bg-[var(--surface)] sm:flex-row sm:items-center sm:justify-between">
              <span className="order-2 sm:order-1 text-[10px] text-[var(--text-faint)]">
                {text.length > 0 ? `${text.length} chars` : "Right-click any day anytime"}
              </span>

              <div className="order-1 sm:order-2 flex items-center justify-end gap-2">
                {existsNote && (
                  <motion.button
                    onClick={handleDelete}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Delete note"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg
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
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg
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
