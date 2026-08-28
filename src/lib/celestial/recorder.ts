import { EMPTY_NOTE, note, type LocNote } from "./loc-note";

export type VideoAspect = "16:9" | "9:16" | "1:1" | "4:3";
export type VideoQuality = "720" | "1080" | "1440" | "2160";
export type VideoFps = "24" | "30" | "60";

export type RecorderMime = {
  mime: string;
  ext: "mp4" | "webm";
};

export type CaptureResult = {
  blob: Blob;
  ext: "mp4" | "webm";
  mime: string;
};

const ASPECT: Record<VideoAspect, number> = {
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "1:1": 1,
  "4:3": 4 / 3,
};

const LONG_EDGE: Record<VideoQuality, number> = {
  "720": 1280,
  "1080": 1920,
  "1440": 2560,
  "2160": 3840,
};

export const VIDEO_ASPECTS: { id: VideoAspect; label: string }[] = [
  { id: "16:9", label: "16:9" },
  { id: "9:16", label: "9:16" },
  { id: "1:1", label: "1:1" },
  { id: "4:3", label: "4:3" },
];

export const VIDEO_QUALITIES: { id: VideoQuality; label: string }[] = [
  { id: "720", label: "720" },
  { id: "1080", label: "1080" },
  { id: "1440", label: "1440" },
  { id: "2160", label: "4K" },
];

export const VIDEO_FPS: { id: VideoFps; label: string; fps: number }[] = [
  { id: "24", label: "24", fps: 24 },
  { id: "30", label: "30", fps: 30 },
  { id: "60", label: "60", fps: 60 },
];

export function fpsValue(id: VideoFps): number {
  return id === "24" ? 24 : id === "60" ? 60 : 30;
}

export function exportSize(aspect: VideoAspect, quality: VideoQuality): { width: number; height: number } {
  const long = LONG_EDGE[quality];
  const ratio = ASPECT[aspect];
  let width: number;
  let height: number;
  if (ratio >= 1) {
    width = long;
    height = Math.round(long / ratio);
  } else {
    height = long;
    width = Math.round(long * ratio);
  }
  width = Math.round(width / 2) * 2;
  height = Math.round(height / 2) * 2;
  return { width, height };
}

export function pickRecorderMime(withAudio: boolean): RecorderMime {
  const mp4 = withAudio
    ? [
        `video/mp4;codecs="avc1.640034,mp4a.40.2"`,
        `video/mp4;codecs="avc1.640033,mp4a.40.2"`,
        `video/mp4;codecs="avc1.640028,mp4a.40.2"`,
        `video/mp4;codecs="avc1.4d0028,mp4a.40.2"`,
        `video/mp4;codecs="avc1.42E01E,mp4a.40.2"`,
        "video/mp4;codecs=avc1.640034,mp4a.40.2",
        "video/mp4;codecs=avc1.640028,mp4a.40.2",
        "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
        "video/mp4",
      ]
    : [
        `video/mp4;codecs="avc1.640034"`,
        `video/mp4;codecs="avc1.640033"`,
        `video/mp4;codecs="avc1.640028"`,
        `video/mp4;codecs="avc1.42E01E"`,
        "video/mp4;codecs=avc1.640034",
        "video/mp4;codecs=avc1.42E01E",
        "video/mp4",
      ];
  const webm = withAudio
    ? ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"]
    : ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];

  if (typeof MediaRecorder !== "undefined") {
    for (const mime of mp4) {
      if (MediaRecorder.isTypeSupported(mime)) return { mime, ext: "mp4" };
    }
    for (const mime of webm) {
      if (MediaRecorder.isTypeSupported(mime)) return { mime, ext: "webm" };
    }
  }
  return { mime: "", ext: "webm" };
}

export function videoBitrate(width: number, height: number, fps = 30): number {
  const fpsScale = Math.max(1, fps / 30);
  return Math.min(80_000_000, Math.max(5_000_000, Math.round(width * height * 4 * fpsScale)));
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function stampFilename(ext: string, title = "celestial-strings"): string {
  const safe = title.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "celestial-strings";
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${safe}-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.${ext}`;
}

export class CaptureSession {
  running = false;
  startedAt = 0;
  ext: "mp4" | "webm" = "mp4";
  mime = "";
  note: LocNote = EMPTY_NOTE;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private canvasStream: MediaStream | null = null;

  start(canvas: HTMLCanvasElement, audioStream: MediaStream, width: number, height: number, fps = 30): boolean {
    if (typeof MediaRecorder === "undefined") {
      this.note = note("record.noSupport");
      return false;
    }

    let canvasStream: MediaStream;
    try {
      canvasStream = canvas.captureStream(fps);
    } catch {
      this.note = note("record.canvasProtected");
      return false;
    }

    const videoTrack = canvasStream.getVideoTracks()[0];
    if (!videoTrack) {
      this.note = note("record.noSky");
      return false;
    }
    if ("contentHint" in videoTrack) videoTrack.contentHint = "detail";
    try {
      void videoTrack.applyConstraints({
        width: { ideal: width },
        height: { ideal: height },
        frameRate: { ideal: fps },
      });
    } catch {
      /* constraints are best-effort */
    }

    const tracks: MediaStreamTrack[] = [videoTrack];
    for (const track of audioStream.getAudioTracks()) {
      if (track.readyState === "live") tracks.push(track);
    }
    const mixed = new MediaStream(tracks);
    const hasAudio = mixed.getAudioTracks().length > 0;
    const recorder = createRecorder(mixed, width, height, hasAudio, fps);
    if (!recorder) {
      videoTrack.stop();
      this.note = note("record.noSupport");
      return false;
    }

    this.canvasStream = canvasStream;
    this.recorder = recorder;
    this.chunks = [];
    this.ext = mimeExt(recorder.mimeType);
    this.mime = recorder.mimeType || (this.ext === "mp4" ? "video/mp4" : "video/webm");
    this.note = this.ext === "mp4" ? note("record.formatMp4") : note("record.formatWebm");
    this.startedAt = performance.now();
    this.running = true;

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) this.chunks.push(event.data);
    };

    try {
      // MP4 needs a single complete file; timeslice would fragment the moov atom.
      if (this.ext === "mp4") recorder.start();
      else recorder.start(1000);
    } catch {
      this.cleanupTracks();
      this.running = false;
      this.note = note("record.startFailed");
      return false;
    }
    return true;
  }

  elapsedSeconds(): number {
    if (!this.running) return 0;
    return (performance.now() - this.startedAt) / 1000;
  }

  stop(): Promise<CaptureResult | null> {
    const recorder = this.recorder;
    if (!recorder) {
      this.running = false;
      this.cleanupTracks();
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      const finish = () => {
        this.running = false;
        this.recorder = null;
        this.cleanupTracks();
        if (this.chunks.length === 0) {
          resolve(null);
          return;
        }
        const mime = this.mime || (this.ext === "mp4" ? "video/mp4" : "video/webm");
        resolve({ blob: new Blob(this.chunks, { type: mime }), ext: this.ext, mime });
      };

      recorder.onstop = finish;
      recorder.onerror = () => finish();

      try {
        if (recorder.state === "recording") {
          try {
            recorder.requestData();
          } catch {
            /* some mp4 recorders reject requestData */
          }
          recorder.stop();
        } else {
          finish();
        }
      } catch {
        finish();
      }
    });
  }

  private cleanupTracks(): void {
    this.canvasStream?.getVideoTracks().forEach((track) => track.stop());
    this.canvasStream = null;
  }
}

function mimeExt(mime: string): "mp4" | "webm" {
  return mime.includes("mp4") ? "mp4" : "webm";
}

function createRecorder(
  stream: MediaStream,
  width: number,
  height: number,
  hasAudio: boolean,
  fps: number,
): MediaRecorder | null {
  const picked = pickRecorderMime(hasAudio);
  const bitrate = videoBitrate(width, height, fps);
  const attempts: MediaRecorderOptions[] = [];
  if (picked.mime) {
    const withRates: MediaRecorderOptions = { mimeType: picked.mime, videoBitsPerSecond: bitrate };
    if (hasAudio) withRates.audioBitsPerSecond = 192_000;
    attempts.push(withRates);
    attempts.push({ mimeType: picked.mime });
  }
  attempts.push({ videoBitsPerSecond: bitrate });
  attempts.push({});

  for (const options of attempts) {
    try {
      return new MediaRecorder(stream, options);
    } catch {
      /* try the next option set */
    }
  }
  return null;
}
