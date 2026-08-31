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

/** Short-edge pixels — matches the Mix labels (4K = 2160 tall for 16:9). */
const SHORT_EDGE: Record<VideoQuality, number> = {
  "720": 720,
  "1080": 1080,
  "1440": 1440,
  "2160": 2160,
};

/** H.264 High@L5.1 frame-size cap (macroblocks) and a common hardware max edge. */
const H264_MAX_MB = 36864;
const H264_MAX_EDGE = 4096;
const MIN_USEFUL_BYTES = 32_768;

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

function even(n: number): number {
  return Math.max(2, Math.round(n / 2) * 2);
}

/**
 * Scale a frame so H.264 hardware encoders will accept it.
 * Level 5.1/5.2 max is 36864 macroblocks (~4096×2304). Long-edge 4K on 1:1
 * (3840×3840) and 4:3 (3840×2880) overshoots that and yields empty ~3 KB files.
 */
export function fitEncodeSize(width: number, height: number): { width: number; height: number } {
  let w = Math.max(2, width);
  let h = Math.max(2, height);
  const mb = Math.ceil(w / 16) * Math.ceil(h / 16);
  let scale = 1;
  const edge = Math.max(w, h);
  if (edge > H264_MAX_EDGE) scale = Math.min(scale, H264_MAX_EDGE / edge);
  if (mb > H264_MAX_MB) scale = Math.min(scale, Math.sqrt(H264_MAX_MB / mb));
  if (scale < 1) {
    w *= scale;
    h *= scale;
  }
  w = even(w);
  h = even(h);
  while (w > 16 && h > 16 && Math.ceil(w / 16) * Math.ceil(h / 16) > H264_MAX_MB) {
    w = even(w - 2);
    h = even(h - 2);
  }
  return { width: w, height: h };
}

export function exportSize(aspect: VideoAspect, quality: VideoQuality): { width: number; height: number } {
  const short = SHORT_EDGE[quality];
  const ratio = ASPECT[aspect];
  let width: number;
  let height: number;
  if (ratio >= 1) {
    height = short;
    width = short * ratio;
  } else {
    width = short;
    height = short / ratio;
  }
  return fitEncodeSize(width, height);
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
  return Math.min(60_000_000, Math.max(5_000_000, Math.round(width * height * 4 * fpsScale)));
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
  private encodeFailed = false;

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
    // Do not apply width/height constraints — canvas.captureStream already
    // matches the drawing buffer. Ideal 3840×3840 / 2880×2160 is not a camera
    // mode, and Chrome's encoder then writes an empty ~3 KB file.
    try {
      void videoTrack.applyConstraints({ frameRate: { ideal: fps } });
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
    this.encodeFailed = false;
    this.ext = mimeExt(recorder.mimeType);
    this.mime = recorder.mimeType || (this.ext === "mp4" ? "video/mp4" : "video/webm");
    this.note = this.ext === "mp4" ? note("record.formatMp4") : note("record.formatWebm");
    this.startedAt = performance.now();
    this.running = true;

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) this.chunks.push(event.data);
    };
    recorder.onerror = () => {
      this.encodeFailed = true;
      this.note = note("record.encodeFailed");
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
        if (this.encodeFailed) {
          this.note = note("record.encodeFailed");
          resolve(null);
          return;
        }
        if (this.chunks.length === 0) {
          this.note = note("record.nothing");
          resolve(null);
          return;
        }
        const mime = this.mime || (this.ext === "mp4" ? "video/mp4" : "video/webm");
        const blob = new Blob(this.chunks, { type: mime });
        if (blob.size < MIN_USEFUL_BYTES) {
          this.note = note("record.encodeFailed");
          resolve(null);
          return;
        }
        resolve({ blob, ext: this.ext, mime });
      };

      recorder.onstop = finish;

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
