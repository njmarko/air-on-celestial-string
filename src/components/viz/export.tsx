import { Square } from "lucide-react";
import { exportSize, VIDEO_ASPECTS, VIDEO_QUALITIES } from "@/lib/celestial/recorder";
import type { OrbitDir, VideoAspect, VideoQuality } from "@/lib/celestial/types";
import { formatTime } from "@/lib/utils";
import { act } from "@/lib/viz-actions";
import { useVizStore } from "@/store/viz-store";
import { IconBtn, RangeField, Segmented, ToggleRow } from "./widgets";

export function ExportFields({ onStart }: { onStart?: () => void }) {
  const aspect = useVizStore((s) => s.videoAspect);
  const quality = useVizStore((s) => s.videoQuality);
  const recording = useVizStore((s) => s.recording);
  const recordNote = useVizStore((s) => s.recordNote);
  const size = exportSize(aspect, quality);

  return (
    <div className="space-y-2">
      <Segmented<VideoAspect>
        label="Frame"
        value={aspect}
        options={VIDEO_ASPECTS}
        onChange={(value) => act((engine) => engine.setVideoAspect(value))}
      />
      <Segmented<VideoQuality>
        label="Resolution"
        value={quality}
        options={VIDEO_QUALITIES}
        onChange={(value) => act((engine) => engine.setVideoQuality(value))}
      />
      <p className="px-1 text-xs tabular-nums text-faint">
        {size.width} × {size.height}
      </p>
      <p className="px-1 text-xs leading-relaxed text-faint">
        Only the sky is saved — menus and the cursor stay out of the file. Drag to orbit while it
        records. MP4 when this browser can encode it.
      </p>
      {recordNote && !recording ? (
        <p className="px-1 text-xs leading-relaxed text-muted">{recordNote}</p>
      ) : null}
      <button
        type="button"
        disabled={recording}
        data-hint="Start capturing the orrery and the music that is playing. Menus are not recorded."
        className="flex h-11 w-full items-center justify-center rounded-lg bg-fg text-sm font-medium text-bg hover:bg-fg/90 disabled:opacity-40"
        onClick={() => {
          onStart?.();
          act((engine) => engine.startRecording());
        }}
      >
        Start recording
      </button>
    </div>
  );
}

export function RecPill() {
  const recording = useVizStore((s) => s.recording);
  const elapsed = useVizStore((s) => s.recordElapsed);
  const format = useVizStore((s) => s.recordFormat);
  const autoOrbit = useVizStore((s) => s.autoOrbit);
  const aspect = useVizStore((s) => s.videoAspect);
  const quality = useVizStore((s) => s.videoQuality);

  if (!recording) return null;
  const size = exportSize(aspect, quality);

  return (
    <div className="overlay-safe pointer-events-none absolute inset-0 z-50">
      <div
        className="pointer-events-auto absolute top-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl bg-surface px-2 py-1 shadow-panel ring-1 ring-border-strong"
        data-hint="Recording the sky and the music. Menus and the cursor stay out of the file. Drag to orbit. Escape stops."
      >
        <span className="rec-dot mx-1 size-2.5 shrink-0 rounded-full bg-danger" />
        <p className="px-1 font-mono text-xs tabular-nums text-fg">
          <span className="mr-2 font-sans font-medium tracking-wider text-danger">REC</span>
          {formatTime(elapsed)}
          <span className="ml-2 text-faint">
            {format || "MP4"} · {size.width}×{size.height}
          </span>
        </p>
        <button
          type="button"
          data-hint={
            autoOrbit
              ? "Stop circling the sun. You can still drag the camera."
              : "Let the camera slowly circle the sun. You can still drag to look around."
          }
          onClick={() => act((engine) => engine.setAutoOrbit(!autoOrbit))}
          className={`h-9 rounded-md px-2.5 text-xs font-medium ${
            autoOrbit ? "bg-fg/10 text-primary" : "text-muted hover:bg-fg/10 hover:text-fg"
          }`}
        >
          Circle
        </button>
        <IconBtn
          label="Stop recording"
          hint="Stop and download the video with the music."
          className="size-9 text-danger"
          onClick={() => act((engine) => void engine.stopRecording())}
        >
          <Square className="size-3.5 fill-current" strokeWidth={1.5} />
        </IconBtn>
      </div>
    </div>
  );
}

export function CircleCameraSection() {
  const autoOrbit = useVizStore((s) => s.autoOrbit);
  const speed = useVizStore((s) => s.autoOrbitSpeed);
  const dir = useVizStore((s) => s.autoOrbitDir);
  const period = Math.round(60 / Math.max(0.05, speed));

  return (
    <div className="space-y-1">
      <ToggleRow
        label="Circle camera"
        hint="Orbit the camera around the sun. You can still drag to look around. Works while recording."
        checked={autoOrbit}
        onChange={(value) => act((engine) => engine.setAutoOrbit(value))}
      />
      <Segmented<OrbitDir>
        label="Circle direction"
        value={dir}
        options={[
          {
            id: "ccw",
            label: "CCW",
            hint: "Counter-clockwise around the sun, looking down from above.",
          },
          {
            id: "cw",
            label: "CW",
            hint: "Clockwise around the sun, looking down from above.",
          },
        ]}
        onChange={(value) => act((engine) => engine.setAutoOrbitDir(value))}
      />
      <RangeField
        label="Circle speed"
        hint="How fast the camera circles the sun. 0.50 is a slow two-minute orbit."
        min={0.15}
        max={2.5}
        step={0.05}
        value={speed}
        display={`${speed.toFixed(2)} · ${period}s / orbit`}
        onChange={(value) => act((engine) => engine.setAutoOrbitSpeed(value))}
      />
    </div>
  );
}
