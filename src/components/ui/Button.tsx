"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, children, className, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed tracking-wide";
    const variants = {
      primary: "bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-dark)] active:scale-[0.98] shadow-sm hover:shadow-md",
      accent:  "bg-[var(--color-brand-accent)] text-white hover:bg-[var(--color-brand-accent-dark)] active:scale-[0.98] shadow-sm hover:shadow-[0_4px_14px_rgb(238_102_27/0.35)]",
      outline: "bg-transparent text-[var(--color-brand-primary)] border-[1.5px] border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/6",
      ghost:   "bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]",
      danger:  "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-7 py-3 text-base",
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
