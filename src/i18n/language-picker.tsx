import { cn } from "@/lib/utils";
import { LANGUAGES } from "./catalog";
import { Flag } from "./flags";
import { useLocaleStore, useT } from "./use-i18n";

export function LanguagePicker({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const t = useT();

  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className={cn("flex flex-wrap items-center gap-1", className)}
    >
      {LANGUAGES.map((lang) => {
        const on = locale === lang.id;
        return (
          <button
            key={lang.id}
            type="button"
            aria-pressed={on}
            data-hint={t("lang.switch", { name: lang.nativeName })}
            onClick={() => setLocale(lang.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-2.5 text-xs font-medium transition-colors duration-150",
              compact ? "h-9" : "h-10",
              on ? "bg-fg text-bg" : "bg-fg/10 text-muted hover:text-fg",
            )}
          >
            <Flag
              code={lang.flag}
              className="h-3.5 w-5 shrink-0 rounded-[2px] shadow-[0_0_0_1px_#e8eef633]"
            />
            <span>{lang.nativeName}</span>
          </button>
        );
      })}
    </div>
  );
}
