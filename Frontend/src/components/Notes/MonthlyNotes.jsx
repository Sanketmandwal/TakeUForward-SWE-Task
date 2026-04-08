import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendar } from "../../context";
import { toMonthKey } from "../../utils";

const LINE_HEIGHT = 28;

function ruledLinesBg(lineColor) {
  return {
    backgroundImage: `repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent ${LINE_HEIGHT - 1}px,
      ${lineColor} ${LINE_HEIGHT - 1}px,
      ${lineColor} ${LINE_HEIGHT}px
    )`,
    backgroundSize: `100% ${LINE_HEIGHT}px`,
    backgroundPositionY: `${LINE_HEIGHT * 2}px`,
  };
}

export default function MonthlyNotes() {
  const { viewDate, getMonthNote, saveMonthNote, isDark } = useCalendar();
  const [text, setText] = useState(() => getMonthNote(viewDate));
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);
  const monthKey = toMonthKey(viewDate);
  const lineColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";

  useEffect(() => {
    setText(getMonthNote(viewDate));
    setSaved(false);
  }, [getMonthNote, monthKey, viewDate]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = (value) => {
    setText(value);
    setSaved(false);
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      saveMonthNote(viewDate, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 700);
  };

  return (
    <div className="relative flex-1 overflow-hidden" style={ruledLinesBg(lineColor)}>
      <textarea
        value={text}
        onChange={(event) => handleChange(event.target.value)}
        aria-label={`Monthly notes for ${viewDate.toLocaleString("default", { month: "long", year: "numeric" })}`}
        placeholder={`${viewDate.toLocaleString("default", { month: "long" })} notes...`}
        className="absolute inset-0 w-full h-full resize-none bg-transparent
                   px-3 pt-1 pb-2 text-[12.5px] leading-[28px]
                   text-[var(--text)] placeholder-[var(--text-faint)]
                   focus:outline-none"
        style={{ fontFamily: "'Inter', sans-serif" }}
        spellCheck={false}
      />

      <AnimatePresence>
        {saved && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-2 right-3 text-[9px] font-semibold text-emerald-500"
          >
            saved
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
