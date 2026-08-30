import { Square } from "lucide-react";
import { formatNote, useT } from "@/i18n/use-i18n";
import { exportSize, fpsValue, VIDEO_ASPECTS, VIDEO_FPS, VIDEO_QUALITIES } from "@/lib/celestial/recorder";
import type { ElevateDir, OrbitDir, VideoAspect, VideoFps, VideoQuality } from "@/lib/celestial/types";
import { formatTime } from "@/lib/utils";
import { act } from "@/lib/viz-actions";
import { useVizStore } from "@/store/viz-store";
import { IconBtn, RangeField, Segmented, ToggleRow } from "./widgets";

const ASPECT_HINT: Record<VideoAspect, string> = {
  "16:9": "record.aspect169",
  "9:16": "record.aspect916",
  "1:1": "record.aspect11",
  "4:3": "record.aspect43",
};

const QUALITY_HINT: Record<VideoQuality, string> = {
  "720": "record.q720",
  "1080": "record.q1080",
  "1440": "record.q1440",
  "2160": "record.q2160",
};

const FPS_HINT: Record<VideoFps, string> = {
  "24": "record.fps24",
  "30": "record.fps30",
  "60": "record.fps60",
};

export function ExportFields({ onStart }: { onStart?: () => void }) {
  const t = useT();
  const aspect = useVizStore((s) => s.videoAspect);
  const quality = useVizStore((s) => s.videoQuality);
  const videoFps = useVizStore((s) => s.videoFps);
  const recording = useVizStore((s) => s.recording);
  const recordNote = useVizStore((s) => s.recordNote);
  const size = exportSize(aspect, quality);
  const fps = fpsValue(videoFps);
  const noteText = formatNote(t, recordNote);

  return (
    <div className="space-y-2">
      <Segmented<VideoAspect>
        label={t("record.frame")}
        value={aspect}
        options={VIDEO_ASPECTS.map((item) => ({
          id: item.id,
          label: item.label,
          hint: t(ASPECT_HINT[item.id]),
        }))}
        onChange={(value) => act((engine) => engine.setVideoAspect(value))}
      />
      <Segmented<VideoQuality>
        label={t("record.resolution")}
        value={quality}
        options={VIDEO_QUALITIES.map((item) => ({
          id: item.id,
          label: item.label,
          hint: t(QUALITY_HINT[item.id]),
        }))}
        onChange={(value) => act((engine) => engine.setVideoQuality(value))}
      />
      <Segmented<VideoFps>
        label={t("record.fps")}
        value={videoFps}
        options={VIDEO_FPS.map((item) => ({
          id: item.id,
          label: item.label,
          hint: t(FPS_HINT[item.id]),
        }))}
        onChange={(value) => act((engine) => engine.setVideoFps(value))}
      />
      <p className="px-1 text-xs tabular-nums text-faint">
        {t("record.size", { width: size.width, height: size.height, fps })}
      </p>
      <p className="px-1 text-xs leading-relaxed text-faint">{t("record.blurb")}</p>
      {noteText && !recording ? (
        <p className="px-1 text-xs leading-relaxed text-muted">{noteText}</p>
      ) : null}
      <button
        type="button"
        disabled={recording}
        data-hint={t("record.startHint")}
        className="flex h-11 w-full items-center justify-center rounded-lg bg-fg text-sm font-medium text-bg hover:bg-fg/90 disabled:opacity-40"
        onClick={() => {
          onStart?.();
          act((engine) => engine.startRecording());
        }}
      >
        {t("record.start")}
      </button>
    </div>
  );
}

export function RecPill() {
  const t = useT();
  const recording = useVizStore((s) => s.recording);
  const elapsed = useVizStore((s) => s.recordElapsed);
  const format = useVizStore((s) => s.recordFormat);
  const autoOrbit = useVizStore((s) => s.autoOrbit);
  const autoElevate = useVizStore((s) => s.autoElevate);
  const aspect = useVizStore((s) => s.videoAspect);
  const quality = useVizStore((s) => s.videoQuality);
  const videoFps = useVizStore((s) => s.videoFps);

  if (!recording) return null;
  const size = exportSize(aspect, quality);
  const fps = fpsValue(videoFps);

  return (
    <div className="overlay-safe pointer-events-none absolute inset-0 z-50">
      <div
        className="pointer-events-auto absolute top-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl bg-surface px-2 py-1 shadow-panel ring-1 ring-border-strong"
        data-hint={t("record.pillHint")}
      >
        <span className="rec-dot mx-1 size-2.5 shrink-0 rounded-full bg-danger" />
        <p className="px-1 font-mono text-xs tabular-nums text-fg">
          <span className="mr-2 font-sans font-medium tracking-wider text-danger">REC</span>
          {formatTime(elapsed)}
          <span className="ml-2 text-faint">
            {format || "MP4"} · {size.width}×{size.height} · {fps}
          </span>
        </p>
        <button
          type="button"
          data-hint={autoOrbit ? t("record.circleOn") : t("record.circleOff")}
          onClick={() => act((engine) => engine.setAutoOrbit(!autoOrbit))}
          className={`h-9 rounded-md px-2.5 text-xs font-medium ${
            autoOrbit ? "bg-fg/10 text-primary" : "text-muted hover:bg-fg/10 hover:text-fg"
          }`}
        >
          {t("record.circle")}
        </button>
        <button
          type="button"
          data-hint={autoElevate ? t("record.liftOn") : t("record.liftOff")}
          onClick={() => act((engine) => engine.setAutoElevate(!autoElevate))}
          className={`h-9 rounded-md px-2.5 text-xs font-medium ${
            autoElevate ? "bg-fg/10 text-primary" : "text-muted hover:bg-fg/10 hover:text-fg"
          }`}
        >
          {t("record.lift")}
        </button>
        <IconBtn
          label={t("record.stop")}
          hint={t("record.stopHint")}
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
  const t = useT();
  const autoOrbit = useVizStore((s) => s.autoOrbit);
  const speed = useVizStore((s) => s.autoOrbitSpeed);
  const dir = useVizStore((s) => s.autoOrbitDir);
  const autoElevate = useVizStore((s) => s.autoElevate);
  const liftSpeed = useVizStore((s) => s.autoElevateSpeed);
  const liftDir = useVizStore((s) => s.autoElevateDir);
  const period = Math.round(60 / Math.max(0.05, speed));
  const liftPeriod = Math.round(30 / Math.max(0.05, liftSpeed));

  return (
    <div className="space-y-1">
      <ToggleRow
        label={t("mix.circleCam")}
        hint={t("mix.circleCamHint")}
        checked={autoOrbit}
        onChange={(value) => act((engine) => engine.setAutoOrbit(value))}
      />
      <Segmented<OrbitDir>
        label={t("mix.circleDir")}
        value={dir}
        options={[
          { id: "ccw", label: t("mix.ccw"), hint: t("mix.ccwHint") },
          { id: "cw", label: t("mix.cw"), hint: t("mix.cwHint") },
        ]}
        onChange={(value) => act((engine) => engine.setAutoOrbitDir(value))}
      />
      <RangeField
        label={t("mix.circleSpeed")}
        hint={t("mix.circleSpeedHint")}
        min={0.15}
        max={8}
        step={0.05}
        value={speed}
        display={t("mix.circleSpeedDisplay", { speed: speed.toFixed(2), period })}
        onChange={(value) => act((engine) => engine.setAutoOrbitSpeed(value))}
      />
      <ToggleRow
        label={t("mix.liftCam")}
        hint={t("mix.liftCamHint")}
        checked={autoElevate}
        onChange={(value) => act((engine) => engine.setAutoElevate(value))}
      />
      <Segmented<ElevateDir>
        label={t("mix.liftDir")}
        value={liftDir}
        options={[
          { id: "up", label: t("mix.liftUp"), hint: t("mix.liftUpHint") },
          { id: "down", label: t("mix.liftDown"), hint: t("mix.liftDownHint") },
        ]}
        onChange={(value) => act((engine) => engine.setAutoElevateDir(value))}
      />
      <RangeField
        label={t("mix.liftSpeed")}
        hint={t("mix.liftSpeedHint")}
        min={0.15}
        max={8}
        step={0.05}
        value={liftSpeed}
        display={t("mix.liftSpeedDisplay", { speed: liftSpeed.toFixed(2), period: liftPeriod })}
        onChange={(value) => act((engine) => engine.setAutoElevateSpeed(value))}
      />
    </div>
  );
}
