import { motion } from "framer-motion";

export default function YearPicker({ currentYear, onSelect, onClose }) {
  const years = Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="absolute z-50 rounded-2xl overflow-hidden"
        style={{
          right: "4%",
          bottom: "12%",
          width: "min(228px, 34%)",
          background: "rgba(8,8,18,0.87)",
          backdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.11)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.65)",
        }}
        initial={{ opacity: 0, scale: 0.88, y: 14, transformOrigin: "bottom right" }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 14 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      >
        <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest uppercase text-white/35">
          Jump to year
        </p>
        <div className="grid grid-cols-3 gap-1 px-2 pb-3">
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
}
