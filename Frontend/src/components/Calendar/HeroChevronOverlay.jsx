import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroChevronOverlay({ modColor, monthName, year, onYearClick }) {
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef(null);

  return (
    <>
      <svg
        viewBox="0 0 780 520"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="780" height="520" fill="url(#bottomFade)" />
        <path d="M 0 520 L 0 292 L 366 520 Z" fill={modColor} fillOpacity="0.78" />
        <path d="M 366 520 L 780 192 L 780 520 Z" fill={modColor} fillOpacity="0.97" />
        <path d="M 590 520 L 780 290 L 780 520 Z" fill="black" fillOpacity="0.14" />
      </svg>

      <div
        className="pointer-events-auto absolute"
        style={{ right: "5%", bottom: "11%", zIndex: 10 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className="absolute -top-9 right-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium"
              style={{
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(8px)",
                color: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Click to change year
            </motion.div>
          )}
        </AnimatePresence>

        <button
          ref={buttonRef}
          onClick={() => onYearClick(buttonRef.current?.getBoundingClientRect())}
          aria-label={`Change year - currently ${year}`}
          className="text-right rounded-xl px-3 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{
            background: hovered ? "rgba(255,255,255,0.10)" : "transparent",
            border: hovered
              ? "1px solid rgba(255,255,255,0.18)"
              : "1px solid transparent",
          }}
        >
          <div
            className="text-white/85 leading-none"
            style={{ fontSize: 13, letterSpacing: "0.26em", fontWeight: 300 }}
          >
            {year}
          </div>
          <div
            className="text-white leading-none mt-1"
            style={{ fontSize: 27, letterSpacing: "0.04em", fontWeight: 700 }}
          >
            {monthName.toUpperCase()}
          </div>
        </button>
      </div>
    </>
  );
}
