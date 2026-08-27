import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function IconBtn({
  label,
  hint,
  onClick,
  active,
  disabled,
  children,
  className,
}: {
  label: string;
  hint?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-hint={hint ?? label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-md text-fg",
        "transition-colors duration-150",
        "hover:bg-fg/10 disabled:pointer-events-none disabled:opacity-40",
        active && "bg-fg/10 text-primary",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel rounded-2xl p-3", className)}>
      <h2 className="mb-3 px-1 font-display text-lg font-medium tracking-tight text-fg">{title}</h2>
      {children}
    </section>
  );
}

export function RangeField({
  label,
  hint,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  display?: string;
}) {
  return (
    <label className="block py-1" data-hint={hint ?? label}>
      <span className="mb-2 flex items-baseline justify-between gap-3 text-xs">
        <span className="text-muted">{label}</span>
        <span className="tabular-nums text-faint">{display ?? value}</span>
      </span>
      <input
        type="range"
        className="hud-range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function Segmented<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
}: {
  label: string;
  hint?: string;
  value: T;
  options: { id: T; label: string; hint?: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="py-1">
      <p className="mb-2 text-xs text-muted">{label}</p>
      <div className="flex rounded-lg bg-surface-2 p-1">
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              data-hint={option.hint ?? hint ?? `${label}: ${option.label}`}
              onClick={() => onChange(option.id)}
              className={cn(
                "h-9 min-w-0 flex-1 rounded-md px-2 text-xs font-medium transition-colors duration-150",
                selected ? "bg-fg text-bg" : "text-muted hover:text-fg",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-hint={hint ?? label}
      onClick={() => onChange(!checked)}
      className="flex h-11 w-full items-center justify-between rounded-lg px-2 text-sm text-fg hover:bg-fg/10"
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-6 w-10 rounded-full p-0.5 transition-colors duration-150",
          checked ? "bg-primary" : "bg-fg/15",
        )}
      >
        <span
          className={cn(
            "block size-5 rounded-full transition-transform duration-150",
            checked ? "translate-x-4 bg-primary-fg" : "translate-x-0 bg-fg",
          )}
        />
      </span>
    </button>
  );
}

export function PrimaryBtn({
  children,
  onClick,
  disabled,
  className,
  hint,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      data-hint={hint}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium",
        "bg-fg text-bg transition-transform duration-150",
        "hover:bg-fg/90 active:scale-[0.98]",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function MakerCredit({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs tracking-wide text-muted", className)}>
      Made by Marko Njegomir{" "}
      <a
        href="https://x.com/njmarko"
        target="_blank"
        rel="noopener noreferrer"
        data-hint="Open Marko Njegomir on X."
        className="inline-flex h-6 items-center text-fg underline decoration-border-strong underline-offset-2 transition-colors duration-150 hover:text-primary hover:decoration-primary"
      >
        @njmarko
      </a>{" "}
      with Grok
    </p>
  );
}
