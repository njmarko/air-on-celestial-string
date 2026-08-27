import { Music, Upload } from "lucide-react";
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
  return (
    <div className="space-y-1">
      {LIBRARY.map((track) => {
        const active = track.id === activeId;
        return (
          <button
            key={track.id}
            type="button"
            data-hint={`Play ${track.title} by ${track.composer}. ${track.credit}.`}
            onClick={() => onPick(track.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 text-left transition-colors duration-150",
              compact ? "h-11" : "h-12",
              active ? "bg-primary/15 text-fg" : "text-fg hover:bg-fg/10",
            )}
          >
            <Music className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{track.title}</span>
              <span className="block truncate text-xs text-faint">
                {track.composer}
                {compact ? "" : ` · ${track.detail}`}
              </span>
            </span>
          </button>
        );
      })}
      <button
        type="button"
        data-hint="Open a file from your device — MP3, WAV, FLAC, and similar."
        onClick={onAdd}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 text-left text-fg transition-colors duration-150 hover:bg-fg/10",
          compact ? "h-11" : "h-12",
        )}
      >
        <Upload className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
        <span className="text-sm">Add a track</span>
      </button>
    </div>
  );
}
