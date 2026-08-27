import { useState } from "react";
import { ListMusic, Orbit, Pause, Play, Video, Volume2, VolumeX } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { act } from "@/lib/viz-actions";
import { useT } from "@/i18n/use-i18n";
import { useVizStore } from "@/store/viz-store";
import { ExportFields } from "./export";
import { TrackList } from "./track-list";
import { IconBtn } from "./widgets";

function trackLabel(
  t: ReturnType<typeof useT>,
  trackId: string,
  trackName: string,
): string {
  if (!trackId) return t("track.none");
  if (trackId === "file") return trackName;
  if (trackId === "generated") return t("track.generated");
  const title = t(`track.${trackId}.title`);
  const composer = t(`track.${trackId}.composer`);
  if (title.startsWith("track.")) return trackName;
  return `${title} — ${composer}`;
}

export function Transport({
  onOpenFile,
  onOpenSheet,
}: {
  onOpenFile: () => void;
  onOpenSheet: () => void;
}) {
  const t = useT();
  const audio = useVizStore((s) => s.audio);
  const paused = useVizStore((s) => s.paused);
  const canCreate = useVizStore((s) => s.canCreate);
  const selectedCount = useVizStore((s) => s.selectedCount);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const recording = useVizStore((s) => s.recording);

  const progress = audio.duration > 0 ? audio.current / audio.duration : 0;
  const muted = audio.muted || audio.volume <= 0.001;
  const name = trackLabel(t, audio.trackId, audio.trackName);

  return (
    <footer className="pointer-events-auto relative w-full max-w-3xl">
      {libraryOpen ? (
        <div className="panel absolute inset-x-0 bottom-full z-30 mb-2 rounded-2xl p-2">
          <TrackList
            compact
            activeId={audio.trackId}
            onPick={(id) => {
              act((engine) => {
                engine.loadLibrary(id);
                engine.playAudio();
              });
              setLibraryOpen(false);
            }}
            onAdd={() => {
              setLibraryOpen(false);
              onOpenFile();
            }}
          />
        </div>
      ) : null}

      {exportOpen && !recording ? (
        <div className="panel absolute inset-x-0 bottom-full z-30 mb-2 rounded-2xl p-3">
          <p className="mb-2 px-1 font-display text-lg text-fg">{t("record.videoTitle")}</p>
          <ExportFields onStart={() => setExportOpen(false)} />
        </div>
      ) : null}

      <div className="panel rounded-2xl px-2 py-2 md:px-3">
        <div className="flex items-center gap-1 md:gap-2">
          <IconBtn
            label={audio.playing ? t("player.pause") : t("player.play")}
            hint={audio.playing ? t("player.pauseHint") : t("player.playHint")}
            onClick={() =>
              act((engine) => {
                if (!engine.audio.hasTrack) engine.loadDemo();
                engine.toggleAudio();
              })
            }
          >
            {audio.playing ? (
              <Pause className="size-5 fill-current" strokeWidth={1.5} />
            ) : (
              <Play className="ml-0.5 size-5 fill-current" strokeWidth={1.5} />
            )}
          </IconBtn>

          <div className="min-w-0 flex-1 px-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="truncate text-sm text-fg">{name}</p>
              <p className="shrink-0 font-mono text-xs tabular-nums text-faint">
                {formatTime(audio.current)} / {formatTime(audio.duration)}
              </p>
            </div>
            <input
              type="range"
              className="hud-range mt-2"
              min={0}
              max={1}
              step={0.001}
              value={progress}
              disabled={!audio.hasTrack}
              aria-label={t("player.seek")}
              data-hint={t("player.seekHint")}
              onChange={(event) => act((engine) => engine.seekAudio(Number(event.target.value)))}
            />
          </div>

          <IconBtn
            label={muted ? t("player.unmute") : t("player.mute")}
            hint={muted ? t("player.unmuteHint") : t("player.muteHint")}
            className="size-9"
            active={muted}
            onClick={() => act((engine) => engine.toggleMute())}
          >
            {muted ? (
              <VolumeX className="size-4" strokeWidth={1.75} />
            ) : (
              <Volume2 className="size-4" strokeWidth={1.75} />
            )}
          </IconBtn>
          <input
            type="range"
            className="hud-range hidden w-20 sm:block"
            min={0}
            max={1}
            step={0.01}
            value={audio.volume}
            aria-label={t("player.volume")}
            data-hint={t("player.volumeHint")}
            onChange={(event) => act((engine) => engine.setVolume(Number(event.target.value)))}
          />

          <IconBtn
            label={t("player.library")}
            hint={t("player.libraryHint")}
            active={libraryOpen}
            onClick={() => {
              setExportOpen(false);
              setLibraryOpen((open) => !open);
            }}
          >
            <ListMusic className="size-4" strokeWidth={1.75} />
          </IconBtn>
          <IconBtn
            label={paused ? t("player.resumeOrbits") : t("player.pauseOrbits")}
            hint={paused ? t("player.resumeOrbitsHint") : t("player.pauseOrbitsHint")}
            active={paused}
            onClick={() => act((engine) => engine.togglePaused())}
          >
            <Orbit className="size-4" strokeWidth={1.75} />
          </IconBtn>
          <IconBtn
            label={t("player.export")}
            hint={t("record.exportHint")}
            active={exportOpen || recording}
            className="hidden md:inline-flex"
            onClick={() => {
              setLibraryOpen(false);
              setExportOpen((open) => !open);
            }}
          >
            <Video className="size-4" strokeWidth={1.75} />
          </IconBtn>
          <button
            type="button"
            onClick={onOpenSheet}
            data-hint={t("hud.tuneHint")}
            className="inline-flex h-11 items-center rounded-md px-3 text-xs font-medium text-muted hover:bg-fg/10 hover:text-fg lg:hidden"
          >
            {t("hud.tune")}
          </button>
        </div>

        {(selectedCount > 0 || canCreate) && (
          <div className="mt-1 flex items-center justify-between gap-3 px-2 pb-1">
            <p className="text-xs text-muted">
              {canCreate
                ? t("strings.twoSelected")
                : selectedCount === 1
                  ? t("strings.pickSecond")
                  : t("strings.nSelected", { n: selectedCount })}
            </p>
            <button
              type="button"
              disabled={!canCreate}
              data-hint={t("strings.weaveHint")}
              onClick={() => act((engine) => engine.createConnection())}
              className="h-9 rounded-md bg-fg px-3 text-xs font-medium text-bg disabled:opacity-40"
            >
              {t("strings.weaveShort")}
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
