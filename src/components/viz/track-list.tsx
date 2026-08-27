import { Music, Upload } from "lucide-react";
import { useT } from "@/i18n/use-i18n";
import { LIBRARY } from "@/lib/celestial/library";
import { cn } from "@/lib/utils";

export function TrackList({
  activeId,
  onPick,
  onAdd,
  compact = false,
}: {
  activeId?: string;
  onPick: (id: string) => void;
  onAdd: () => void;
  compact?: boolean;
}) {
  const t = useT();

  return (
    <div className="space-y-1">
      {LIBRARY.map((track) => {
        const active = track.id === activeId;
        const title = t(`track.${track.id}.title`);
        const composer = t(`track.${track.id}.composer`);
        const detail = t(`track.${track.id}.detail`);
        return (
          <button
            key={track.id}
            type="button"
            data-hint={t("track.playHint", { title, composer, credit: track.credit })}
            onClick={() => onPick(track.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 text-left transition-colors duration-150",
              compact ? "h-11" : "h-12",
              active ? "bg-primary/15 text-fg" : "text-fg hover:bg-fg/10",
            )}
          >
            <Music className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{title}</span>
              <span className="block truncate text-xs text-faint">
                {composer}
                {compact ? "" : ` · ${detail}`}
              </span>
            </span>
          </button>
        );
      })}
      <button
        type="button"
        data-hint={t("track.addHint")}
        onClick={onAdd}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 text-left text-fg transition-colors duration-150 hover:bg-fg/10",
          compact ? "h-11" : "h-12",
        )}
      >
        <Upload className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
        <span className="text-sm">{t("track.add")}</span>
      </button>
    </div>
  );
}
