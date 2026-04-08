// ─── TakeUforward Module Configuration ────────────────────────────────────────
// Each module has its own color palette, hero SVG pattern, and display metadata.
// These values drive the entire theming system via CSS variables.

export const MODULES = {
  dsa: {
    id: "dsa",
    label: "DSA",
    fullLabel: "Data Structures & Algorithms",
    description: "Arrays, Trees, Graphs & more",
    primaryColor: "#0ea5e9",     // sky-500
    darkColor: "#0284c7",        // sky-600
    lightColor: "#e0f2fe",       // sky-100
    textColor: "#0c4a6e",        // sky-950
    gradientFrom: "#0ea5e9",
    gradientTo: "#06b6d4",
    heroPattern: "dsa",
    streakEmoji: "⚡",
  },
  lld: {
    id: "lld",
    label: "LLD",
    fullLabel: "Low Level Design",
    description: "Design Patterns & OOP",
    primaryColor: "#8b5cf6",     // violet-500
    darkColor: "#7c3aed",        // violet-600
    lightColor: "#ede9fe",       // violet-100
    textColor: "#2e1065",        // violet-950
    gradientFrom: "#8b5cf6",
    gradientTo: "#a855f7",
    heroPattern: "lld",
    streakEmoji: "🏗️",
  },
  sql: {
    id: "sql",
    label: "SQL",
    fullLabel: "SQL & Databases",
    description: "Queries, Joins & Schemas",
    primaryColor: "#10b981",     // emerald-500
    darkColor: "#059669",        // emerald-600
    lightColor: "#d1fae5",       // emerald-100
    textColor: "#064e3b",        // emerald-950
    gradientFrom: "#10b981",
    gradientTo: "#14b8a6",
    heroPattern: "sql",
    streakEmoji: "🗄️",
  },
};

// Hero background themes change per month to keep the calendar fresh.
// These are used inside the SVG hero illustration as gradient + label.
export const MONTH_THEMES = [
  { label: "New Beginnings",  bg: "#0c1445", accent: "#4facfe" }, // Jan
  { label: "Deep Dive",       bg: "#0d1b2a", accent: "#00f5d4" }, // Feb
  { label: "Growth",          bg: "#1a1a2e", accent: "#a8edea" }, // Mar
  { label: "Flow State",      bg: "#0f3460", accent: "#e94560" }, // Apr
  { label: "Endurance",       bg: "#1f1c2c", accent: "#c94b4b" }, // May
  { label: "Architecture",    bg: "#141e30", accent: "#243b55" }, // Jun
  { label: "Exploration",     bg: "#0a0a0a", accent: "#ffd200" }, // Jul
  { label: "Innovation",      bg: "#1a1a1a", accent: "#00d2ff" }, // Aug
  { label: "Harvest",         bg: "#2c1654", accent: "#a17fe0" }, // Sep
  { label: "Discovery",       bg: "#1c1c1c", accent: "#f7971e" }, // Oct
  { label: "Resilience",      bg: "#1f2937", accent: "#60a5fa" }, // Nov
  { label: "Year End",        bg: "#0f172a", accent: "#a78bfa" }, // Dec
];

export const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// Full day names for accessibility aria-labels
export const DAY_NAMES_FULL = [
  "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
];