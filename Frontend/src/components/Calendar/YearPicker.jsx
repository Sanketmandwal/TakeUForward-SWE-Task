import { motion } from "framer-motion";
import { createPortal } from "react-dom";

export default function YearPicker({ anchorRect, currentYear, onSelect, onClose }) {
  const years = Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);
  const desktopLeft = anchorRect
    ? Math.max(16, Math.min(anchorRect.right - 228, window.innerWidth - 228 - 16))
    : Math.max(16, window.innerWidth - 228 - 16);
  const desktopTop = anchorRect
    ? Math.min(anchorRect.bottom + 10, window.innerHeight - 170 - 16)
    : Math.max(16, window.innerHeight * 0.12);

  const content = (
    <>
      <motion.div
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="fixed z-50 inset-x-3 bottom-3 rounded-2xl overflow-hidden
                   sm:inset-x-auto sm:bottom-auto"
        style={{
          width: "auto",
          maxWidth: "calc(100vw - 24px)",
          background: "rgba(8,8,18,0.87)",
          backdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.11)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.65)",
          left: window.innerWidth >= 640 ? `${desktopLeft}px` : undefined,
          top: window.innerWidth >= 640 ? `${desktopTop}px` : undefined,
        }}
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 14 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      >
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <span className="h-1.5 w-10 rounded-full bg-white/15" />
        </div>

        <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest uppercase text-white/35">
          Jump to year
        </p>

        <div className="grid grid-cols-3 gap-1 px-2 pb-3 sm:w-[228px]">
          {years.map((year) => (
            <motion.button
              key={year}
              onClick={() => {
                onSelect(year);
                onClose();
              }}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
              className="rounded-lg py-2 text-[13px] font-semibold"
              style={{
                background: year === currentYear
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                color: year === currentYear
                  ? "#fff"
                  : "rgba(255,255,255,0.58)",
                outline: year === currentYear
                  ? "1px solid rgba(255,255,255,0.22)"
                  : "none",
              }}
            >
              {year}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );

  return createPortal(content, document.body);
}
