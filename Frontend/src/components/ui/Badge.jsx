import { clsx } from "clsx";

/**
 * Badge — compact label chip.
 *
 * Variants:
 *  module  → uses current module's CSS vars (default)
 *  success → green
 *  warning → amber
 *  neutral → gray
 *  streak  → fire-orange gradient for streak count
 */
export default function Badge({ children, variant = "module", className, ...props }) {
  const base = "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide select-none";

  const variants = {
    module:  "bg-[var(--mod-light)] text-[var(--mod-text)] dark:bg-[var(--mod-primary)]/20 dark:text-[var(--mod-light)]",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    neutral: "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300",
    streak:  "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-sm",
  };

  return (
    <span className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}