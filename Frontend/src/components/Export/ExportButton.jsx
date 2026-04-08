import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Download, Loader2, Share2 } from "lucide-react";
import { useCalendar } from "../../context";
import {
  copyCalendarImage,
  downloadCalendarImage,
  renderCalendarImage,
} from "./exportCalendarImage";

export default function ExportButton() {
  const {
    viewDate,
    activeModule,
    activeDays,
    rangeStart,
    rangeEnd,
    currentStreak,
  } = useCalendar();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null);
  const [copied, setCopied] = useState(false);

  const monthLabel = viewDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const renderImage = useCallback(() => renderCalendarImage({
    viewDate,
    activeModule,
    activeDays,
    rangeStart,
    rangeEnd,
    currentStreak,
  }), [viewDate, activeModule, activeDays, rangeStart, rangeEnd, currentStreak]);

  const handleDownload = useCallback(async () => {
    setLoading("download");

    try {
      const canvas = await renderImage();
      const filename = `tuf-${activeModule}-${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}.png`;
      downloadCalendarImage(canvas, filename);
    } finally {
      setLoading(null);
      setOpen(false);
    }
  }, [activeModule, renderImage, viewDate]);

  const handleCopy = useCallback(async () => {
    setLoading("copy");

    try {
      const canvas = await renderImage();
      await copyCalendarImage(canvas);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const canvas = await renderImage();
      downloadCalendarImage(canvas, `tuf-${activeModule}-calendar.png`);
    } finally {
      setLoading(null);
      setOpen(false);
    }
  }, [activeModule, renderImage]);

  return (
    <div className="relative w-full sm:w-auto">
      <motion.button
        onClick={() => setOpen((value) => !value)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Share this month"
        aria-expanded={open}
        className="w-full h-9 flex items-center justify-center gap-1.5 px-3 rounded-full
                   min-w-0 sm:min-w-[84px]
                   text-[12px] font-semibold
                   border border-[var(--mod-primary)]/30
                   text-[var(--mod-primary)]
                   bg-[var(--mod-primary)]/8
                   hover:bg-[var(--mod-primary)]/15
                   focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-[var(--mod-primary)]/40
                   transition-colors"
      >
        {copied ? <Check size={13} /> : <Share2 size={13} />}
        {copied ? "Copied!" : "Share"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="absolute right-0 top-10 z-50 rounded-2xl overflow-hidden min-w-[220px]"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-lg)",
              }}
              initial={{ opacity: 0, scale: 0.92, y: -6, transformOrigin: "top right" }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -6 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <div className="px-4 pt-3 pb-2 border-b border-[var(--border)]">
                <p className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-widest">
                  Export month
                </p>
                <p className="text-[13px] font-medium text-[var(--text)] mt-0.5">
                  {monthLabel}
                </p>
              </div>

              <div className="p-2 flex flex-col gap-1">
                <ExportAction
                  icon={<Download size={14} />}
                  label="Download PNG"
                  sub="Saves a 1080x1080 image"
                  loading={loading === "download"}
                  onClick={handleDownload}
                />
                <ExportAction
                  icon={<Copy size={14} />}
                  label="Copy to clipboard"
                  sub="Paste directly into LinkedIn, Twitter..."
                  loading={loading === "copy"}
                  onClick={handleCopy}
                />
              </div>

              <p className="px-4 pb-3 text-[10px] text-[var(--text-faint)]">
                Includes your streak, marked days and selected range.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExportAction({ icon, label, sub, loading, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={{ backgroundColor: "var(--surface-offset)" }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl disabled:opacity-60 transition-colors"
    >
      <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--mod-primary)]/12 text-[var(--mod-primary)]">
        {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      </span>
      <span>
        <span className="block text-[13px] font-medium text-[var(--text)]">{label}</span>
        <span className="block text-[11px] text-[var(--text-faint)] mt-0.5">{sub}</span>
      </span>
    </motion.button>
  );
}
