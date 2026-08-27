import { useState } from "react";
import { ListMusic, Orbit, Pause, Play, Video, Volume2, VolumeX } from "lucide-react";
import { act } from "@/lib/viz-actions";
import { formatTime } from "@/lib/utils";
import { useVizStore } from "@/store/viz-store";
import { ExportFields } from "./export";
import { TrackList } from "./track-list";
import { IconBtn } from "./widgets";

export function Transport({
  onOpenFile,
  onOpenSheet,
}: {
  onOpenFile: () => void;
  onOpenSheet: () => void;
}) {
  const audio = useVizStore((s) => s.audio);
  const paused = useVizStore((s) => s.paused);
  const canCreate = useVizStore((s) => s.canCreate);
  const selectedCount = useVizStore((s) => s.selectedCount);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const recording = useVizStore((s) => s.recording);

  const progress = audio.duration > 0 ? audio.current / audio.duration : 0;
  const muted = audio.muted || audio.volume <= 0.001;

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
          <p className="mb-2 px-1 font-display text-lg text-fg">Export video</p>
          <ExportFields onStart={() => setExportOpen(false)} />
        </div>
      ) : null}

      <div className="panel rounded-2xl px-2 py-2 md:px-3">
        <div className="flex items-center gap-1 md:gap-2">
          <IconBtn
            label={audio.playing ? "Pause" : "Play"}
            hint={audio.playing ? "Pause the recording. Space also toggles." : "Play the recording. Space also toggles."}
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
              <p className="truncate text-sm text-fg">{audio.trackName}</p>
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
              aria-label="Seek"
              data-hint="Scrub the recording. Mix sliders follow the section under the playhead."
              onChange={(event) => act((engine) => engine.seekAudio(Number(event.target.value)))}
            />
          </div>

          <IconBtn
            label={muted ? "Unmute" : "Mute"}
            hint={muted ? "Unmute the recording." : "Mute the recording. The speaker also toggles mute."}
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
            aria-label="Volume"
            data-hint="Playback volume."
            onChange={(event) => act((engine) => engine.setVolume(Number(event.target.value)))}
          />

          <IconBtn
            label="Choose a track"
            hint="Pick a public-domain recording or add your own."
            active={libraryOpen}
            onClick={() => {
              setExportOpen(false);
              setLibraryOpen((open) => !open);
            }}
          >
            <ListMusic className="size-4" strokeWidth={1.75} />
          </IconBtn>
          <IconBtn
            label={paused ? "Resume orbits" : "Pause orbits"}
            hint={paused ? "Let the planets move again. Music keeps playing." : "Freeze planetary motion. Music still plays."}
            active={paused}
            onClick={() => act((engine) => engine.togglePaused())}
          >
            <Orbit className="size-4" strokeWidth={1.75} />
          </IconBtn>
          <IconBtn
            label="Export video"
            hint="Record the sky and the music. Menus and the cursor stay out of the file. You can drag the camera while it records."
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
            data-hint="Open worlds, strings, and mix on a small screen."
            className="inline-flex h-11 items-center rounded-md px-3 text-xs font-medium text-muted hover:bg-fg/10 hover:text-fg lg:hidden"
          >
            Tune
          </button>
        </div>

        {(selectedCount > 0 || canCreate) && (
          <div className="mt-1 flex items-center justify-between gap-3 px-2 pb-1">
            <p className="text-xs text-muted">
              {canCreate
                ? "Two worlds selected"
                : selectedCount === 1
                  ? "Select a second world"
                  : `${selectedCount} selected`}
            </p>
            <button
              type="button"
              disabled={!canCreate}
              data-hint="Stretch a glowing string between the two selected worlds."
              onClick={() => act((engine) => engine.createConnection())}
              className="h-9 rounded-md bg-fg px-3 text-xs font-medium text-bg disabled:opacity-40"
            >
              Weave string
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
