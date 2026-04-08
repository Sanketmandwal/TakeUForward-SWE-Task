import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendar } from "../../context";
import { getMonthImage } from "../../data";
import { buildHeaderVariants } from "./calendarHeaderMotion";
import HeroChevronOverlay from "./HeroChevronOverlay";
import ModuleIllustration from "./ModuleIllustration";
import YearPicker from "./YearPicker";

const MODULE_TINTS = {
  dsa: "rgba(14,165,233,0.10)",
  lld: "rgba(139,92,246,0.10)",
  sql: "rgba(16,185,129,0.10)",
};

export default function CalendarHeader() {
  const {
    viewDate,
    activeModule,
    moduleConfig,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    jumpToYear,
  } = useCalendar();

  const monthIndex = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const heroImage = getMonthImage(monthIndex);

  const [direction, setDirection] = useState(0);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [yearPickerAnchor, setYearPickerAnchor] = useState(null);
  const previousDateRef = useRef(viewDate);
  const pageKey = `${year}-${monthIndex}`;

  useEffect(() => {
    previousDateRef.current = viewDate;
  }, [viewDate]);

  const handlePrev = () => {
    setDirection(-1);
    goToPrevMonth();
  };

  const handleNext = () => {
    setDirection(1);
    goToNextMonth();
  };

  const handleYearClick = (anchorRect) => {
    setYearPickerAnchor(anchorRect ?? null);
    setShowYearPicker((value) => !value);
  };

  return (
    <div
      className="relative overflow-hidden bg-[#0e1014] w-full"
      style={{ aspectRatio: "10 / 7", minHeight: "245px", maxHeight: "420px" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={pageKey}
          className="absolute inset-0"
          variants={buildHeaderVariants(direction)}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <img
            src={heroImage}
            alt={`${monthName} ${year}`}
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 35%" }}
            loading="eager"
          />

          <div className="absolute inset-0" style={{ background: MODULE_TINTS[activeModule] }} />

          <HeroChevronOverlay
            modColor={moduleConfig.primaryColor}
            monthName={monthName}
            year={year}
            onYearClick={handleYearClick}
          />

          <motion.div
            className="absolute top-4 left-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.24, ease: "easeOut" }}
          >
            <ModuleIllustration module={activeModule} />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showYearPicker && (
          <YearPicker
            anchorRect={yearPickerAnchor}
            currentYear={year}
            onSelect={jumpToYear}
            onClose={() => {
              setShowYearPicker(false);
              setYearPickerAnchor(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="absolute z-10 flex items-center gap-2" style={{ bottom: "13%", left: "14px" }}>
        <HeaderNavButton onClick={handlePrev} aria-label="Previous month">
          <ChevronLeft size={15} />
        </HeaderNavButton>
        <HeaderNavButton onClick={goToToday} aria-label="Today">
          <CalendarCheck size={13} />
        </HeaderNavButton>
        <HeaderNavButton onClick={handleNext} aria-label="Next month">
          <ChevronRight size={15} />
        </HeaderNavButton>
      </div>
    </div>
  );
}

function HeaderNavButton({ children, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.14 }}
      whileTap={{ scale: 0.86 }}
      className="w-8 h-8 rounded-full flex items-center justify-center text-white
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style={{ background: "rgba(0,0,0,0.44)", backdropFilter: "blur(8px)" }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
