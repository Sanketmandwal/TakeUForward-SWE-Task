import { forwardRef } from "react";
import { clsx } from "clsx";

/**
 * Button — production-grade reusable button with 4 variants.
 *
 * Variants:
 *  primary   → filled with module color (CSS var --mod-primary)
 *  secondary → outlined with module color
 *  ghost     → transparent, subtle hover
 *  danger    → red destructive action
 *
 * Sizes: sm | md (default) | lg
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    className,
    disabled,
    loading,
    iconLeft,
    iconRight,
    ...props
  },
  ref
) {
  const base = clsx(
    // Layout & reset
    "inline-flex items-center justify-center gap-2 font-medium",
    "rounded-lg border transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[var(--mod-primary)]",
    "select-none cursor-pointer",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    // Size
    size === "sm" && "px-3 py-1.5 text-xs min-h-[32px]",
    size === "md" && "px-4 py-2 text-sm min-h-[38px]",
    size === "lg" && "px-6 py-3 text-base min-h-[46px]",
  );

  const variants = {
    primary: clsx(
      "bg-[var(--mod-primary)] text-white border-transparent",
      "hover:bg-[var(--mod-dark)] active:scale-[0.97]",
      "shadow-sm hover:shadow-md"
    ),
    secondary: clsx(
      "bg-transparent text-[var(--mod-primary)] border-[var(--mod-primary)]",
      "hover:bg-[var(--mod-light)] active:scale-[0.97]",
      "dark:hover:bg-[var(--mod-primary)]/10"
    ),
    ghost: clsx(
      "bg-transparent text-gray-600 border-transparent",
      "hover:bg-gray-100 active:bg-gray-200",
      "dark:text-gray-300 dark:hover:bg-white/10 dark:active:bg-white/20"
    ),
    danger: clsx(
      "bg-red-500 text-white border-transparent",
      "hover:bg-red-600 active:scale-[0.97]",
      "shadow-sm hover:shadow-md"
    ),
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        <>
          {iconLeft && <span className="shrink-0" aria-hidden="true">{iconLeft}</span>}
          {children}
          {iconRight && <span className="shrink-0" aria-hidden="true">{iconRight}</span>}
        </>
      )}
    </button>
  );
});

export default Button;