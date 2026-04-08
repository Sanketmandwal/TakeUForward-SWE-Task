import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useCalendar } from "../../context";

export default function ThemeToggle() {
  const { isDark, toggleDark } = useCalendar();

  return (
    <motion.button
      onClick={toggleDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.90 }}
      className="relative flex items-center justify-center rounded-full
                 border transition-colors duration-200 focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-[var(--mod-primary)]"
      style={{
        width: 36, height: 36,
        background: isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.06)",
        borderColor: isDark
          ? "rgba(255,255,255,0.12)"
          : "rgba(0,0,0,0.10)",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
            animate={{ rotate:   0, opacity: 1, scale: 1   }}
            exit={{    rotate:  30, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex items-center justify-center text-[var(--mod-primary)]"
          >
            <Moon size={16} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate:  30, opacity: 0, scale: 0.7 }}
            animate={{ rotate:   0, opacity: 1, scale: 1   }}
            exit={{    rotate: -30, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex items-center justify-center text-[var(--mod-primary)]"
          >
            <Sun size={16} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
