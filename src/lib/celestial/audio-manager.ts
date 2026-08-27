import type { Connection } from "./connection";
import { createDemoTrackBlob } from "./demo-track";
import { libraryTrack } from "./library";
import { analyzeMixBuffer, sectionAt, type MixProfile } from "./mix-analyzer";
import { hzForPreset } from "./planet-data";
import { formatTime } from "@/lib/utils";
import type { MixStatus, RhythmBand, RhythmMode } from "./types";

type BandKey = "bass" | "mid" | "high";

type BandConfig = {
  enabled: boolean;
  sensitivity: number;
  minFreq: number;
  maxFreq: number;
  threshold: number;
  energy: number;
  drive: number;
  peak: number;
  weaveRate: number;
};

const mixCache = new Map<string, MixProfile>();
const MIX_CACHE_VER = "v4";
const BANDS: BandKey[] = ["bass", "mid", "high"];
const FLUX_LEN: Record<BandKey, number> = { bass: 28, mid: 22, high: 16 };
const ONSET_COOLDOWN: Record<BandKey, number> = { bass: 95, mid: 72, high: 52 };

export class AudioManager {
  readonly audio: HTMLAudioElement;
  context: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private outputGain: GainNode | null = null;
  private captureDest: MediaStreamAudioDestinationNode | null = null;
  speakerVolume = 0.8;
  maxWeave = 14;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private prevSpectrum: Float32Array | null = null;
  private objectUrl: string | null = null;
  private demoUrl: string | null = null;
  private wired = new Set<Connection>();
  private mixAbort: AbortController | null = null;
  private mixProfile: MixProfile | null = null;

  isPlaying = false;
  muted = false;
  private preMuteVolume = 0.8;
  rhythmEnabled = true;
  rhythmMode: RhythmMode = "advanced";
  trackName = "No track loaded";
  trackId = "";
  hasTrack = false;
  autoMix = true;
  mixStatus: MixStatus = "idle";
  mixNote = "";
  mixVoice = "";
  mixIndex = 0;
  locked: Record<BandKey, boolean> = { bass: false, mid: false, high: false };
  playing: Record<BandKey, boolean> = { bass: false, mid: false, high: false };
  readiness: Record<BandKey, number> = { bass: 0, mid: 0, high: 0 };

  bands: Record<BandKey, BandConfig> = {
    bass: { enabled: true, sensitivity: 1.8, minFreq: 20, maxFreq: 220, threshold: 150, energy: 0, drive: 0.7, peak: 140, weaveRate: 0 },
    mid: { enabled: true, sensitivity: 1.7, minFreq: 220, maxFreq: 800, threshold: 85, energy: 0, drive: 0.65, peak: 95, weaveRate: 0 },
    high: { enabled: true, sensitivity: 2.1, minFreq: 800, maxFreq: 6000, threshold: 40, energy: 0, drive: 0.75, peak: 55, weaveRate: 0 },
  };

  private lastBeat: Record<BandKey, number> = { bass: 0, mid: 0, high: 0 };
  private fluxHistory: number[] = [];
  private bandFlux: Record<BandKey, number[]> = { bass: [], mid: [], high: [] };

  constructor() {
    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.audio.preload = "auto";
    this.audio.loop = true;
    this.audio.volume = 0.8;
  }

  ensureContext(): void {
    if (!this.context) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.context = new Ctx({ latencyHint: "playback" });
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.52;
      this.dataArray = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));
      this.prevSpectrum = new Float32Array(this.analyser.frequencyBinCount);
      this.source = this.context.createMediaElementSource(this.audio);
      this.outputGain = this.context.createGain();
      this.outputGain.gain.value = this.muted ? 0 : this.speakerVolume;
      this.captureDest = this.context.createMediaStreamDestination();
      this.source.connect(this.analyser);
      this.analyser.connect(this.outputGain);
      this.analyser.connect(this.captureDest);
      this.outputGain.connect(this.context.destination);
      this.audio.volume = 1;
    }
    if (this.context.state === "suspended") {
      void this.context.resume();
    }
  }

  loadFile(file: File): void {
    this.revokeCurrent();
    this.objectUrl = URL.createObjectURL(file);
    this.audio.src = this.objectUrl;
    this.audio.load();
    this.trackName = file.name.replace(/\.[^.]+$/, "");
    this.trackId = "file";
    this.hasTrack = true;
    this.kickAnalysis();
  }

  loadLibrary(id: string): void {
    const track = libraryTrack(id);
    if (!track) {
      this.loadDemo();
      return;
    }
    this.revokeCurrent();
    this.audio.src = track.src;
    this.audio.load();
    this.trackName = `${track.title} — ${track.composer}`;
    this.trackId = track.id;
    this.hasTrack = true;
    this.kickAnalysis();
  }

  loadDemo(): void {
    this.loadLibrary("danube");
  }

  loadGeneratedWaltz(): void {
    if (!this.demoUrl) {
      this.demoUrl = URL.createObjectURL(createDemoTrackBlob());
    }
    this.revokeCurrent(false);
    this.audio.src = this.demoUrl;
    this.audio.load();
    this.trackName = "The Blue Danube — generated";
    this.trackId = "generated";
    this.hasTrack = true;
    this.kickAnalysis();
  }

  play(): void {
    if (!this.audio.src) return;
    this.ensureContext();
    const playResult = this.audio.play();
    this.isPlaying = true;
    if (playResult && typeof playResult.then === "function") {
      void playResult.catch(() => {
        if (this.trackId !== "generated" && this.trackId === "danube") {
          this.loadGeneratedWaltz();
          void this.audio.play().catch(() => {
            this.isPlaying = false;
          });
          return;
        }
        this.isPlaying = false;
      });
    }
  }

  pause(): void {
    this.audio.pause();
    this.isPlaying = false;
  }

  stop(): void {
    this.pause();
    this.audio.currentTime = 0;
  }

  toggle(): void {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  seek(percent: number): void {
    const duration = this.audio.duration || 0;
    this.audio.currentTime = duration * percent;
    this.followMix(this.audio.currentTime, true);
  }

  setVolume(value: number): void {
    const next = Math.min(1, Math.max(0, value));
    this.speakerVolume = next;
    this.muted = next <= 0.001;
    if (next > 0.001) this.preMuteVolume = next;
    this.applySpeakerGain();
  }

  toggleMute(): void {
    if (this.muted || this.speakerVolume <= 0.001) {
      this.muted = false;
      this.speakerVolume = this.preMuteVolume > 0.001 ? this.preMuteVolume : 0.8;
      this.applySpeakerGain();
      return;
    }
    this.preMuteVolume = this.speakerVolume;
    this.muted = true;
    this.applySpeakerGain();
  }

  captureStream(): MediaStream {
    this.ensureContext();
    return this.captureDest?.stream ?? new MediaStream();
  }

  private applySpeakerGain(): void {
    const gain = this.muted ? 0 : this.speakerVolume;
    if (this.outputGain) {
      this.outputGain.gain.value = gain;
      this.audio.volume = 1;
      return;
    }
    this.audio.volume = gain;
  }

  setRate(value: number): void {
    this.audio.playbackRate = Math.min(4, Math.max(0.25, value));
  }

  setMaxWeave(value: number): void {
    this.maxWeave = Math.min(24, Math.max(3, value));
  }

  setAutoMix(value: boolean): void {
    this.autoMix = value;
    if (value) {
      this.locked = { bass: false, mid: false, high: false };
      this.followMix(this.audio.currentTime || 0, true);
      return;
    }
    this.mixNote = this.mixStatus === "live" ? "Auto mix off — sliders stay put." : this.mixNote;
  }

  lockBand(band: BandKey): void {
    this.locked[band] = true;
    this.refreshMixNote();
  }

  unlockBand(band: BandKey): void {
    this.locked[band] = false;
    this.followMix(this.audio.currentTime || 0, true);
  }

  followMix(time: number, snap = false): void {
    if (!this.autoMix || !this.mixProfile || this.mixStatus !== "live") return;
    const { index, section } = sectionAt(this.mixProfile, time);
    this.mixIndex = index;
    this.mixVoice = section.voice;
    BANDS.forEach((key) => {
      this.playing[key] = section.playing[key];
      this.readiness[key] = section.readiness[key];
      const band = this.bands[key];
      band.peak = section.peak[key];
      if (this.locked[key]) return;
      const targetSens = section.sensitivity[key];
      const targetDrive = section.drive[key];
      if (snap) {
        band.sensitivity = targetSens;
        band.drive = targetDrive;
        return;
      }
      band.sensitivity += (targetSens - band.sensitivity) * 0.18;
      band.drive += (targetDrive - band.drive) * 0.18;
    });
    this.refreshMixNote();
  }

  update(delta: number): void {
    if (!this.isPlaying || !this.rhythmEnabled || !this.analyser || !this.dataArray) {
      BANDS.forEach((key) => {
        this.bands[key].weaveRate = 0;
      });
      return;
    }

    this.analyser.getByteFrequencyData(this.dataArray);
    const now = performance.now();
    const nyquist = (this.context?.sampleRate ?? 44100) / 2;
    const binCount = this.analyser.frequencyBinCount;

    BANDS.forEach((key) => {
      const band = this.bands[key];
      band.energy = this.getBandEnergy(band.minFreq, band.maxFreq, nyquist, binCount);
    });

    for (const conn of this.wired) {
      conn.energy = this.getBandEnergy(conn.minFreq, conn.maxFreq, nyquist, binCount);
    }

    this.driveRates(delta, now);

    if (this.rhythmMode === "advanced") {
      this.detectOnsets(now, nyquist, binCount);
    }

    if (this.prevSpectrum && this.dataArray) {
      this.prevSpectrum.set(this.dataArray);
    }
  }

  registerConnection(connection: Connection, rhythmType: RhythmBand = "all"): void {
    this.wired.add(connection);
    connection.rhythmType = rhythmType;
    connection.weaveAcc = 0;
    if (rhythmType !== "custom") {
      const [min, max] = hzForPreset(rhythmType);
      connection.minFreq = min;
      connection.maxFreq = max;
    }
  }

  removeConnection(connection: Connection): void {
    this.wired.delete(connection);
  }

  private driveRates(delta: number, now: number): void {
    const dt = Math.min(0.08, Math.max(0, delta));
    BANDS.forEach((key) => {
      const band = this.bands[key];
      band.weaveRate = band.enabled ? this.energyToRate(key, band.energy) : 0;
    });

    for (const conn of this.wired) {
      if (!this.rangeEnabled(conn)) {
        conn.weaveAcc = 0;
        continue;
      }
      const rate = this.rateForConnection(conn);
      conn.weaveAcc += rate * dt;
      if (conn.weaveAcc > 3) conn.weaveAcc = 3;
      let n = 0;
      while (conn.weaveAcc >= 1 && n < 4) {
        conn.weaveAcc -= 1;
        this.strike(conn, now);
        n += 1;
      }
    }
  }

  private rateForConnection(conn: Connection): number {
    const key = conn.rhythmType;
    if (key === "bass" || key === "mid" || key === "high") {
      return this.bands[key].weaveRate;
    }
    return this.energyToRateFromParams(conn.energy, this.averageGate(), this.averagePeak(), this.averageDrive());
  }

  private energyToRate(key: BandKey, energy: number): number {
    const band = this.bands[key];
    const gate = this.gateFor(key);
    return this.energyToRateFromParams(energy, gate, band.peak, band.drive);
  }

  private energyToRateFromParams(energy: number, gate: number, peak: number, drive: number): number {
    const cap = 1 + Math.max(0.15, drive) * (this.maxWeave - 1);
    if (energy <= gate) return 0;
    const span = Math.max(12, peak - gate);
    const t = clamp((energy - gate) / span, 0, 1);
    const shaped = Math.pow(t, 0.55);
    return Math.min(cap, 0.45 + shaped * (cap - 0.45));
  }

  private gateFor(key: BandKey): number {
    const band = this.bands[key];
    return (band.threshold * 0.82) / Math.max(0.01, band.sensitivity);
  }

  private averageGate(): number {
    const enabled = BANDS.filter((key) => this.bands[key].enabled);
    const keys = enabled.length ? enabled : BANDS;
    return keys.reduce((sum, key) => sum + this.gateFor(key), 0) / keys.length;
  }

  private averagePeak(): number {
    const enabled = BANDS.filter((key) => this.bands[key].enabled);
    const keys = enabled.length ? enabled : BANDS;
    return keys.reduce((sum, key) => sum + this.bands[key].peak, 0) / keys.length;
  }

  private averageDrive(): number {
    const enabled = BANDS.filter((key) => this.bands[key].enabled);
    const keys = enabled.length ? enabled : BANDS;
    return keys.reduce((sum, key) => sum + this.bands[key].drive, 0) / keys.length;
  }

  private strike(conn: Connection, now: number): void {
    conn.lastBeat = now;
    conn.addSegment();
  }

  private rangeEnabled(conn: Connection): boolean {
    if (conn.rhythmType === "all" || conn.rhythmType === "custom") {
      return this.bands.bass.enabled || this.bands.mid.enabled || this.bands.high.enabled;
    }
    if (conn.rhythmType === "bass" || conn.rhythmType === "mid" || conn.rhythmType === "high") {
      return this.bands[conn.rhythmType].enabled;
    }
    return true;
  }

  private detectOnsets(now: number, nyquist: number, binCount: number): void {
    if (!this.dataArray || !this.prevSpectrum) return;

    let flux = 0;
    for (let i = 0; i < binCount; i++) {
      const d = (this.dataArray[i] ?? 0) - (this.prevSpectrum[i] ?? 0);
      if (d > 0) flux += d;
    }
    this.fluxHistory.push(flux);
    if (this.fluxHistory.length > 36) this.fluxHistory.shift();
    const gMed = medianOf(this.fluxHistory);
    const gMad = madOf(this.fluxHistory, gMed);
    const gK = 2.1 / Math.max(0.5, this.averageSensitivity());
    const globalGate = gMed + gK * Math.max(gMad, 8);

    if (flux > globalGate && flux > 18) {
      for (const conn of this.wired) {
        if (!this.rangeEnabled(conn)) continue;
        if (conn.rhythmType === "all" && now - conn.lastBeat > 70) {
          this.strike(conn, now);
          conn.weaveAcc += 0.35;
        }
      }
    }

    for (const key of BANDS) {
      const band = this.bands[key];
      if (!band.enabled) continue;
      const bandFlux = this.spectralFlux(band.minFreq, band.maxFreq, nyquist, binCount);
      const hist = this.bandFlux[key]!;
      hist.push(bandFlux);
      if (hist.length > FLUX_LEN[key]) hist.shift();
      const med = medianOf(hist);
      const mad = madOf(hist, med);
      const k = clamp(2.5 / Math.max(0.5, band.sensitivity), 0.7, 3.1);
      const gate = med + k * Math.max(mad, 1.1);
      const absMin = 6.5 / Math.max(0.55, band.sensitivity);
      const attack = bandFlux > gate && bandFlux > absMin;
      if (attack && now - this.lastBeat[key] > ONSET_COOLDOWN[key]) {
        this.lastBeat[key] = now;
        this.strikeBand(key, now, ONSET_COOLDOWN[key] - 20);
      }
    }

    for (const conn of this.wired) {
      if (!this.rangeEnabled(conn)) continue;
      if (conn.rhythmType !== "custom") continue;
      const threshold = this.averageGate();
      if (conn.energy > threshold && now - conn.lastBeat > 90) this.strike(conn, now);
    }
  }

  private spectralFlux(minFreq: number, maxFreq: number, nyquist: number, binCount: number): number {
    if (!this.dataArray || !this.prevSpectrum) return 0;
    const startBin = Math.max(0, Math.floor((minFreq / nyquist) * binCount));
    const endBin = Math.min(binCount, Math.floor((maxFreq / nyquist) * binCount));
    if (endBin <= startBin) return 0;
    let flux = 0;
    for (let i = startBin; i < endBin; i++) {
      const d = (this.dataArray[i] ?? 0) - (this.prevSpectrum[i] ?? 0);
      if (d > 0) flux += d;
    }
    return flux / (endBin - startBin);
  }

  private strikeBand(key: BandKey, now: number, minGap: number): void {
    for (const conn of this.wired) {
      if (!this.rangeEnabled(conn)) continue;
      if (conn.rhythmType !== key) continue;
      if (now - conn.lastBeat > minGap) {
        this.strike(conn, now);
        conn.weaveAcc += 0.4;
      }
    }
  }

  private averageSensitivity(): number {
    const vals = Object.values(this.bands).map((b) => b.sensitivity);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  private getBandEnergy(minFreq: number, maxFreq: number, nyquist: number, binCount: number): number {
    if (!this.dataArray) return 0;
    const startBin = Math.max(0, Math.floor((minFreq / nyquist) * binCount));
    const endBin = Math.min(binCount, Math.floor((maxFreq / nyquist) * binCount));
    if (endBin <= startBin) return 0;
    let sum = 0;
    let sumSq = 0;
    for (let i = startBin; i < endBin; i++) {
      const v = this.dataArray[i] ?? 0;
      sum += v;
      sumSq += v * v;
    }
    const n = endBin - startBin;
    const mean = sum / n;
    const rms = Math.sqrt(sumSq / n);
    return 0.4 * mean + 0.6 * rms;
  }

  private kickAnalysis(): void {
    this.mixAbort?.abort();
    this.mixProfile = null;
    this.mixIndex = 0;
    this.locked = { bass: false, mid: false, high: false };
    this.mixVoice = "";
    this.playing = { bass: false, mid: false, high: false };
    this.readiness = { bass: 0, mid: 0, high: 0 };
    const src = this.audio.src;
    if (!src) {
      this.mixStatus = "idle";
      this.mixNote = "";
      return;
    }
    this.mixStatus = "analyzing";
    this.mixNote = "Reading the recording for bass, mids, and treble…";
    const abort = new AbortController();
    this.mixAbort = abort;
    void this.runAnalysis(src, abort.signal);
  }

  private async runAnalysis(src: string, signal: AbortSignal): Promise<void> {
    try {
      const cached = mixCache.get(`${MIX_CACHE_VER}:${src}`);
      const profile = cached ?? (await decodeAndAnalyze(src, signal));
      if (signal.aborted) return;
      if (!cached) mixCache.set(`${MIX_CACHE_VER}:${src}`, profile);
      this.mixProfile = profile;
      this.mixStatus = "live";
      this.followMix(this.audio.currentTime || 0, true);
    } catch (error) {
      if (signal.aborted || (error instanceof DOMException && error.name === "AbortError")) return;
      this.mixStatus = "failed";
      this.mixNote = "Could not analyse this file — sliders stay manual.";
      this.mixProfile = null;
    }
  }

  private refreshMixNote(): void {
    if (!this.autoMix) {
      this.mixNote = this.mixStatus === "live" ? "Auto mix off — sliders stay put." : this.mixNote;
      return;
    }
    if (this.mixStatus === "analyzing") {
      this.mixNote = "Reading the recording for bass, mids, and treble…";
      return;
    }
    if (this.mixStatus !== "live" || !this.mixProfile) return;
    const section = this.mixProfile.sections[this.mixIndex];
    if (!section) {
      this.mixNote = "Auto mix ready.";
      return;
    }
    const n = this.mixProfile.sections.length;
    const span = `${formatTime(section.start)}–${formatTime(section.end)}`;
    const lockedCount = BANDS.filter((key) => this.locked[key]).length;
    const lockBit = lockedCount === 3 ? " · all bands locked" : lockedCount ? ` · ${lockedCount} locked` : "";
    this.mixNote = `Section ${this.mixIndex + 1} of ${n} · ${span}${lockBit}`;
    this.mixVoice = section.voice;
  }

  private revokeCurrent(includeDemo = true): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    if (includeDemo && this.demoUrl) {
      URL.revokeObjectURL(this.demoUrl);
      this.demoUrl = null;
    }
  }

  dispose(): void {
    this.mixAbort?.abort();
    this.pause();
    this.revokeCurrent(true);
    this.wired.clear();
    this.source?.disconnect();
    this.analyser?.disconnect();
    this.outputGain?.disconnect();
    this.captureDest?.disconnect();
    void this.context?.close();
    this.context = null;
  }
}

function medianOf(values: number[]): number {
  const n = values.length;
  if (n === 0) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = n >> 1;
  return n % 2 ? (sorted[mid] ?? 0) : 0.5 * ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0));
}

function madOf(values: number[], med: number): number {
  if (values.length === 0) return 0;
  return medianOf(values.map((v) => Math.abs(v - med)));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

async function decodeAndAnalyze(src: string, signal: AbortSignal): Promise<MixProfile> {
  const response = await fetch(src, { signal });
  if (!response.ok) throw new Error(`mix fetch ${response.status}`);
  const bytes = await response.arrayBuffer();
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const ctx = new OfflineAudioContext(1, 44100, 44100);
  const buffer = await ctx.decodeAudioData(bytes.slice(0));
  return analyzeMixBuffer(buffer, signal);
}
