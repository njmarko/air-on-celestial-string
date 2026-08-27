export type MixBandKey = "bass" | "mid" | "high";

export type MixSection = {
  start: number;
  end: number;
  sensitivity: Record<MixBandKey, number>;
  pivot: Record<MixBandKey, number>;
  peak: Record<MixBandKey, number>;
  drive: Record<MixBandKey, number>;
  presence: Record<MixBandKey, number>;
  readiness: Record<MixBandKey, number>;
  playing: Record<MixBandKey, boolean>;
  voice: string;
};

export type MixProfile = {
  duration: number;
  sections: MixSection[];
};

const BANDS: MixBandKey[] = ["bass", "mid", "high"];

const BAND_HZ: Record<MixBandKey, [number, number]> = {
  bass: [20, 220],
  mid: [220, 800],
  high: [800, 6000],
};

const BAND_THRESHOLD: Record<MixBandKey, number> = {
  bass: 150,
  mid: 85,
  high: 40,
};

const FFT_SIZE = 2048;
const TARGET_RATE = 11025;
const HOP_SEC = 0.28;
const MIN_SECTION = 14;
const MIN_DB = -100;
const MAX_DB = -30;

const FALLBACK_SENS: Record<MixBandKey, number> = { bass: 1.8, mid: 1.7, high: 2.1 };
const FALLBACK_PEAK: Record<MixBandKey, number> = { bass: 140, mid: 95, high: 55 };
const FALLBACK_DRIVE: Record<MixBandKey, number> = { bass: 0.7, mid: 0.65, high: 0.75 };

export function sectionAt(profile: MixProfile, time: number): { index: number; section: MixSection } {
  const sections = profile.sections;
  if (sections.length === 0) {
    return { index: 0, section: fallbackSection(Math.max(profile.duration, 1)) };
  }
  const t = Math.max(0, Math.min(time, profile.duration));
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]!;
    if (t >= section.start) return { index: i, section };
  }
  return { index: 0, section: sections[0]! };
}

export async function analyzeMixBuffer(buffer: AudioBuffer, signal?: AbortSignal): Promise<MixProfile> {
  const duration = Number.isFinite(buffer.duration) ? buffer.duration : 0;
  if (duration <= 0 || buffer.length < 32) {
    return {
      duration,
      sections: [fallbackSection(Math.max(duration, 1))],
    };
  }

  const samples = downsampleMono(buffer, TARGET_RATE);
  const hop = Math.max(512, Math.round(TARGET_RATE * HOP_SEC));
  const frameCount = Math.max(1, Math.floor(Math.max(0, samples.length - FFT_SIZE) / hop) + 1);

  const window = hann(FFT_SIZE);
  const re = new Float32Array(FFT_SIZE);
  const im = new Float32Array(FFT_SIZE);
  const energies: Record<MixBandKey, Float32Array> = {
    bass: new Float32Array(frameCount),
    mid: new Float32Array(frameCount),
    high: new Float32Array(frameCount),
  };

  const nyquist = TARGET_RATE / 2;
  const binHz = TARGET_RATE / FFT_SIZE;

  for (let f = 0; f < frameCount; f++) {
    if (signal?.aborted) throw abortError();
    if (f > 0 && f % 64 === 0) await yieldSlice();

    const offset = f * hop;
    re.fill(0);
    im.fill(0);
    const take = Math.min(FFT_SIZE, samples.length - offset);
    for (let i = 0; i < take; i++) re[i] = (samples[offset + i] ?? 0) * (window[i] ?? 0);
    fftRadix2(re, im);

    for (const key of BANDS) {
      const [lo, hi] = BAND_HZ[key];
      const startBin = Math.max(1, Math.floor(lo / binHz));
      const endBin = Math.min(FFT_SIZE / 2, Math.ceil(Math.min(hi, nyquist) / binHz));
      let sum = 0;
      let sumSq = 0;
      let count = 0;
      for (let k = startBin; k < endBin; k++) {
        const mag = Math.hypot(re[k] ?? 0, im[k] ?? 0) / (FFT_SIZE / 2);
        const db = mag > 1e-12 ? 20 * Math.log10(mag) : MIN_DB;
        const byte = ((db - MIN_DB) / (MAX_DB - MIN_DB)) * 255;
        const v = byte < 0 ? 0 : byte > 255 ? 255 : byte;
        sum += v;
        sumSq += v * v;
        count += 1;
      }
      if (!count) {
        energies[key][f] = 0;
        continue;
      }
      const mean = sum / count;
      const rms = Math.sqrt(sumSq / count);
      energies[key][f] = 0.4 * mean + 0.6 * rms;
    }
  }

  const novelty = new Float32Array(frameCount);
  for (let f = 1; f < frameCount; f++) {
    let flux = 0;
    for (const key of BANDS) {
      const d = (energies[key][f] ?? 0) - (energies[key][f - 1] ?? 0);
      if (d > 0) flux += d;
    }
    novelty[f] = flux;
  }
  const smooth = movingAverage(novelty, 5);

  const hopTime = hop / TARGET_RATE;
  const bounds = pickBoundaries(smooth, hopTime, duration);
  const sections: MixSection[] = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const start = bounds[i]!;
    const end = bounds[i + 1]!;
    const startFrame = Math.max(0, Math.min(frameCount - 1, Math.floor(start / hopTime)));
    const endFrame = Math.max(startFrame + 1, Math.min(frameCount, Math.ceil(end / hopTime)));
    sections.push(sectionFromFrames(start, end, startFrame, endFrame, energies));
  }

  if (sections.length === 0) sections.push(fallbackSection(duration));
  return { duration, sections };
}

function sectionFromFrames(
  start: number,
  end: number,
  startFrame: number,
  endFrame: number,
  energies: Record<MixBandKey, Float32Array>,
): MixSection {
  const sensitivity = { ...FALLBACK_SENS };
  const pivot = { bass: 0, mid: 0, high: 0 };
  const peak = { ...FALLBACK_PEAK };
  const drive = { ...FALLBACK_DRIVE };
  const presence = { bass: 0, mid: 0, high: 0 };
  const readiness = { bass: 0, mid: 0, high: 0 };

  for (const key of BANDS) {
    const slice = energies[key].subarray(startFrame, endFrame);
    const floor = percentile(slice, 0.12);
    const p25 = percentile(slice, 0.25);
    const p75 = percentile(slice, 0.75);
    const p90 = percentile(slice, 0.9);
    const spread = Math.max(0, p90 - floor);
    const iqr = Math.max(0, p75 - p25);
    const gate = floor + 0.1 * Math.max(spread, 6);

    let hits = 0;
    let rises = 0;
    for (let i = 0; i < slice.length; i++) {
      const v = slice[i] ?? 0;
      if (v > gate) hits += 1;
      if (i > 0) {
        const d = v - (slice[i - 1] ?? 0);
        if (d > 2.5) rises += 1;
      }
    }
    const present = slice.length ? hits / slice.length : 0;
    const noteDensity = slice.length > 1 ? rises / (slice.length - 1) : 0;
    presence[key] = present;
    const motion = clamp(iqr / 48, 0, 1);
    const dynamics = clamp(spread / 70, 0, 1);
    readiness[key] = clamp(present * (0.38 + 0.62 * dynamics) + 0.15 * noteDensity, 0, 1);
    pivot[key] = floor + 0.14 * Math.max(spread, 6);
    peak[key] = Math.max(gate + 16, p90);

    // Park the live gate just above the quiet troughs so single notes
    // (left-hand bass, right-hand melody) still weave, then go silent between them.
    const target = Math.max(5.5, floor + 0.11 * Math.max(spread, 8));
    const raw = (BAND_THRESHOLD[key] * 0.82) / target;
    sensitivity[key] = quantize(clamp(raw, 1.15, 3.2), 0.05);

    // Sparse piano: moderate cap. Busy tutti: closer to the global max.
    drive[key] = quantize(clamp(0.22 + 0.42 * present + 0.28 * motion + 0.18 * noteDensity, 0.18, 1), 0.02);
  }

  const playing = {
    bass: presence.bass > 0.055 || readiness.bass > 0.14,
    mid: presence.mid > 0.055 || readiness.mid > 0.14,
    high: presence.high > 0.055 || readiness.high > 0.14,
  };
  return {
    start,
    end,
    sensitivity,
    pivot,
    peak,
    drive,
    presence,
    readiness,
    playing,
    voice: voiceLabel(playing, readiness),
  };
}

function voiceLabel(
  playing: Record<MixBandKey, boolean>,
  readiness: Record<MixBandKey, number>,
): string {
  const { bass, mid, high } = playing;
  if (!bass && !mid && !high) return "Quiet — waiting for notes";
  if (bass && high && !mid) return "Bass and treble — left hand and melody";
  if (bass && !mid && !high) return "Bass — left hand / low notes";
  if (!bass && !mid && high) return "Treble — melody / right hand";
  if (!bass && mid && !high) return "Mids — inner voices";
  if (bass && mid && high) {
    const top = (["bass", "mid", "high"] as MixBandKey[]).sort((a, b) => readiness[b] - readiness[a])[0];
    if (top === "high") return "Full mix — melody on top";
    if (top === "bass") return "Full mix — bass line leading";
    return "Full mix — bass, mids, and treble";
  }
  if (bass && mid) return "Bass and mids — left hand and inner voices";
  return "Mids and treble — melody";
}

function fallbackSection(duration: number): MixSection {
  return {
    start: 0,
    end: duration,
    sensitivity: { ...FALLBACK_SENS },
    pivot: { bass: 40, mid: 32, high: 22 },
    peak: { ...FALLBACK_PEAK },
    drive: { ...FALLBACK_DRIVE },
    presence: { bass: 0, mid: 0, high: 0 },
    readiness: { bass: 0, mid: 0, high: 0 },
    playing: { bass: false, mid: false, high: false },
    voice: "Listening for notes",
  };
}

function pickBoundaries(novelty: Float32Array, hopTime: number, duration: number): number[] {
  const n = novelty.length;
  if (n < 4) return [0, duration];

  let mean = 0;
  for (let i = 0; i < n; i++) mean += novelty[i] ?? 0;
  mean /= n;
  let variance = 0;
  for (let i = 0; i < n; i++) {
    const d = (novelty[i] ?? 0) - mean;
    variance += d * d;
  }
  const std = Math.sqrt(variance / n);
  const gate = mean + 0.65 * std;
  const minGap = Math.max(2, Math.round(MIN_SECTION / hopTime));

  const peaks: { i: number; v: number }[] = [];
  for (let i = 2; i < n - 2; i++) {
    const v = novelty[i] ?? 0;
    if (v < gate) continue;
    if (v >= (novelty[i - 1] ?? 0) && v >= (novelty[i + 1] ?? 0) && v >= (novelty[i - 2] ?? 0) && v >= (novelty[i + 2] ?? 0)) {
      peaks.push({ i, v });
    }
  }
  peaks.sort((a, b) => b.v - a.v);

  const chosen: number[] = [];
  for (const peak of peaks) {
    if (chosen.length >= 8) break;
    if (chosen.some((j) => Math.abs(j - peak.i) < minGap)) continue;
    const t = peak.i * hopTime;
    if (t < MIN_SECTION || t > duration - MIN_SECTION) continue;
    chosen.push(peak.i);
  }
  chosen.sort((a, b) => a - b);

  const bounds = [0];
  for (const i of chosen) bounds.push(i * hopTime);
  bounds.push(duration);
  return bounds;
}

function downsampleMono(buffer: AudioBuffer, targetRate: number): Float32Array {
  const srcRate = buffer.sampleRate || targetRate;
  const ratio = srcRate / targetRate;
  const outLen = Math.max(1, Math.floor(buffer.length / ratio));
  const out = new Float32Array(outLen);
  const channels = Math.max(1, buffer.numberOfChannels);
  const chans: Float32Array[] = [];
  for (let c = 0; c < channels; c++) chans.push(buffer.getChannelData(c));
  for (let i = 0; i < outLen; i++) {
    const s = Math.min(buffer.length - 1, Math.floor(i * ratio));
    let mix = 0;
    for (const ch of chans) mix += ch[s] ?? 0;
    out[i] = mix / channels;
  }
  return out;
}

function hann(n: number): Float32Array {
  const w = new Float32Array(n);
  if (n < 2) {
    w[0] = 1;
    return w;
  }
  for (let i = 0; i < n; i++) w[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
  return w;
}

function fftRadix2(re: Float32Array, im: Float32Array): void {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = re[i]!;
      re[i] = re[j]!;
      re[j] = tr;
      const ti = im[i]!;
      im[i] = im[j]!;
      im[j] = ti;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wlenRe = Math.cos(ang);
    const wlenIm = Math.sin(ang);
    const half = len >> 1;
    for (let i = 0; i < n; i += len) {
      let wRe = 1;
      let wIm = 0;
      for (let j = 0; j < half; j++) {
        const even = i + j;
        const odd = even + half;
        const vr = re[odd]! * wRe - im[odd]! * wIm;
        const vi = re[odd]! * wRe + im[odd]! * wIm;
        re[odd] = re[even]! - vr;
        im[odd] = im[even]! - vi;
        re[even] += vr;
        im[even] += vi;
        const nextRe = wRe * wlenRe - wIm * wlenIm;
        wIm = wRe * wlenIm + wIm * wlenRe;
        wRe = nextRe;
      }
    }
  }
}

function movingAverage(data: Float32Array, radius: number): Float32Array {
  const n = data.length;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    let count = 0;
    const a = Math.max(0, i - radius);
    const b = Math.min(n - 1, i + radius);
    for (let j = a; j <= b; j++) {
      sum += data[j] ?? 0;
      count += 1;
    }
    out[i] = count ? sum / count : 0;
  }
  return out;
}

function percentile(values: ArrayLike<number>, p: number): number {
  const n = values.length;
  if (n === 0) return 0;
  const sorted = new Float32Array(n);
  for (let i = 0; i < n; i++) sorted[i] = values[i] ?? 0;
  sorted.sort();
  const idx = clamp(p, 0, 1) * (n - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo] ?? 0;
  const t = idx - lo;
  return (sorted[lo] ?? 0) * (1 - t) + (sorted[hi] ?? 0) * t;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function quantize(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function abortError(): DOMException {
  return new DOMException("Aborted", "AbortError");
}

function yieldSlice(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}
