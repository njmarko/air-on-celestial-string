import { useMemo, useState } from "react";
import { Music, Search, Upload } from "lucide-react";
import { useLocale, useT } from "@/i18n/use-i18n";
import { LIBRARY, trackMatches, trackText } from "@/lib/celestial/library";
import { cn, formatTime } from "@/lib/utils";

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
  const locale = useLocale();
  const [query, setQuery] = useState("");

  const tracks = useMemo(() => LIBRARY.filter((track) => trackMatches(track, query)), [query]);

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center gap-2 px-1 pb-2">
        <label className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("track.search")}
            aria-label={t("track.search")}
            data-hint={t("track.searchHint")}
            className="h-11 w-full rounded-lg bg-fg/5 pr-3 pl-8 text-sm text-fg outline-none placeholder:text-faint ring-1 ring-border focus:ring-border-strong"
          />
        </label>
        <span className="shrink-0 font-mono text-xs tabular-nums text-faint">
          {t("track.nTracks", { n: tracks.length })}
        </span>
      </div>
      <div
        className={cn(
          "hud-scroll min-h-0 space-y-1 overflow-y-auto overscroll-contain pr-1",
          compact ? "max-h-80" : "max-h-96",
        )}
      >
        {tracks.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-faint">{t("track.noMatch")}</p>
        ) : (
          tracks.map((track) => {
            const active = track.id === activeId;
            const title = trackText(track, locale, "title");
            const composer = trackText(track, locale, "composer");
            const detail = trackText(track, locale, "detail");
            return (
              <button
                key={track.id}
                type="button"
                data-hint={t("track.playHint", {
                  title,
                  composer,
                  credit: track.credit,
                  duration: formatTime(track.duration),
                })}
                onClick={() => onPick(track.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 text-left transition-colors duration-150",
                  compact ? "h-12" : "min-h-12 py-1.5",
                  active ? "bg-primary/15 text-fg" : "text-fg hover:bg-fg/10",
                )}
              >
                <Music className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm">{title}</span>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-faint">
                      {formatTime(track.duration)}
                    </span>
                  </span>
                  <span className="block truncate text-xs text-faint">
                    {composer}
                    {compact ? "" : ` · ${detail}`}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
      <button
        type="button"
        data-hint={t("track.addHint")}
        onClick={onAdd}
        className={cn(
          "mt-1 flex w-full items-center gap-3 rounded-lg px-3 text-left text-fg transition-colors duration-150 hover:bg-fg/10",
          compact ? "h-11" : "h-12",
        )}
      >
        <Upload className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
        <span className="text-sm">{t("track.add")}</span>
      </button>
    </div>
  );
}
