import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { FXAAPass } from "three/addons/postprocessing/FXAAPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { AudioManager } from "./audio-manager";
import { Connection } from "./connection";
import { OrbitPath } from "./orbit-path";
import { DEFAULT_WEAVE, hzForPreset, PATH_COLORS, PLANET_DEFS, presetFromHz } from "./planet-data";
import { Planet } from "./planet";
import {
  CaptureSession,
  downloadBlob,
  exportSize,
  fpsValue,
  stampFilename,
} from "./recorder";
import { Starfield } from "./starfield";
import { Sun } from "./sun";
import { fetchHiResMaps } from "./texture-hd";
import type { TexturePack } from "./texture-pack";
import { createSkyTexture } from "./textures";
import { EMPTY_NOTE, note, type LocNote } from "./loc-note";
import type {
  BackgroundType,
  BodyRow,
  CelestialBody,
  ConnRow,
  OrbitMode,
  RhythmBand,
  RhythmMode,
  VideoAspect,
  VideoFps,
  VideoQuality,
  OrbitDir,
  VizSnapshot,
} from "./types";

const PALETTE = [0x8fd0da, 0x8fd4b8, 0xe8b4bc, 0xc8ccd4, 0x9fd0d0, 0xd4c4a8];

export class SceneManager {
  readonly audio = new AudioManager();
  paused = false;
  uiHidden = false;
  speed = 1;
  spinFactor = 0.01;
  linesPerSec = 6;
  trailDuration = 60;
  pathWidth = 1.5;
  stringWidth = 2;
  orbitMode: OrbitMode = "realistic";
  background: BackgroundType = "milkyway";
  parallax = true;
  fps = 60;
  ready = false;
  ringBrightness = 1.4;

  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer | null = null;
  private bloomPass: UnrealBloomPass | null = null;
  private fxaaPass: FXAAPass | null = null;
  private controls: OrbitControls;
  private timer = new THREE.Timer();
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private ambientLight: THREE.AmbientLight;
  private sun: Sun;
  private starfield: Starfield;
  private bodies: CelestialBody[] = [];
  private paths = new Map<string, OrbitPath>();
  private connections: Connection[] = [];
  private selected: CelestialBody[] = [];
  private pathColors: Record<string, string> = { ...PATH_COLORS };
  private sky: THREE.Mesh | null = null;
  private skyMap: THREE.Texture | null = null;
  private skyFromPack = false;
  private pack: TexturePack | null;
  private basePack: TexturePack | null;
  private hiPack: TexturePack | null = null;
  hiRes = true;
  hiResNote: LocNote = note("maps.fetching");
  autoOrbit = false;
  autoOrbitSpeed = 0.5;
  autoOrbitDir: OrbitDir = "ccw";
  recording = false;
  recordNote: LocNote = EMPTY_NOTE;
  videoAspect: VideoAspect = "16:9";
  videoQuality: VideoQuality = "1080";
  videoFps: VideoFps = "30";
  antialias = true;
  private hiResBusy = false;
  private ultraComplete = false;
  private ultraAbort: AbortController | null = null;
  private connCount = 0;
  private frameAcc = 0;
  private pointer = { x: 0, y: 0, down: false, moved: false };
  private ro: ResizeObserver | null = null;
  private disposed = false;
  private useBloom: boolean;
  private capture: CaptureSession | null = null;
  private exportFrame: { width: number; height: number } | null = null;
  private viewRestore: { width: number; height: number; pixelRatio: number } | null = null;

  constructor(container: HTMLElement, pack?: TexturePack) {
    this.container = container;
    this.pack = pack ?? null;
    this.basePack = pack ?? null;
    const w = Math.max(1, container.clientWidth || window.innerWidth);
    const h = Math.max(1, container.clientHeight || window.innerHeight);
    const mobile = w < 700;
    const existingCanvas = container.querySelector("canvas");

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.8, 9000);
    this.camera.position.set(0, 220, 480);

    this.renderer = new THREE.WebGLRenderer({
      canvas: existingCanvas ?? undefined,
      antialias: !mobile,
      powerPreference: "high-performance",
      alpha: false,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2));
    this.renderer.setSize(w, h, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = !mobile;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.domElement.className = "block h-full w-full";
    this.renderer.domElement.style.touchAction = "none";
    if (!existingCanvas) this.container.appendChild(this.renderer.domElement);

    if (this.pack) {
      const ani = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
      for (const tex of Object.values(this.pack.maps)) tex.anisotropy = ani;
    }

    this.antialias = !mobile;
    this.useBloom = !mobile;
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.02, 0.55, 0.18);
    this.bloomPass.enabled = this.useBloom;
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());
    this.fxaaPass = new FXAAPass();
    this.fxaaPass.enabled = this.antialias;
    this.composer.addPass(this.fxaaPass);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 40;
    this.controls.maxDistance = 4200;
    this.controls.target.set(0, 0, 0);

    this.ambientLight = new THREE.AmbientLight(0xd8e0ea, 1);
    this.scene.add(this.ambientLight);

    this.sun = new Sun(this.scene, this.pack?.maps.sun);
    this.starfield = new Starfield(this.scene);
    this.starfield.setVisible(this.parallax);

    this.createBodies();
    this.setRingBrightness(this.ringBrightness);
    this.seedDefaultWeave();
    this.updateBackground();
    this.bindPointer();

    this.ro = new ResizeObserver(() => this.onResize());
    this.ro.observe(this.container);

    document.addEventListener("visibilitychange", this.onVisibility);

    this.renderer.setAnimationLoop(() => this.tick());
    this.queueUltraMaps();
  }

  snapshot(): VizSnapshot {
    const a = this.audio;
    return {
      ready: this.ready,
      fps: this.fps,
      paused: this.paused,
      uiHidden: this.uiHidden,
      speed: this.speed,
      spinFactor: this.spinFactor,
      linesPerSec: this.linesPerSec,
      maxWeave: this.audio.maxWeave,
      trailDuration: this.trailDuration,
      pathWidth: this.pathWidth,
      stringWidth: this.stringWidth,
      orbitMode: this.orbitMode,
      background: this.background,
      parallax: this.parallax,
      ambient: this.ambientLight.intensity,
      bloom: this.bloomPass?.strength ?? 0,
      antialias: this.antialias,
      ringBrightness: this.ringBrightness,
      selectedCount: this.selected.length,
      canCreate: this.selected.length === 2,
      hiRes: this.hiRes,
      hiResNote: this.hiResNote,
      autoOrbit: this.autoOrbit,
      autoOrbitSpeed: this.autoOrbitSpeed,
      autoOrbitDir: this.autoOrbitDir,
      recording: this.recording,
      recordElapsed: this.capture?.elapsedSeconds() ?? 0,
      recordNote: this.recordNote,
      recordFormat: this.capture?.ext === "mp4" ? "MP4" : this.capture ? "WebM" : "",
      videoAspect: this.videoAspect,
      videoQuality: this.videoQuality,
      videoFps: this.videoFps,
      bodies: this.bodyRows(),
      connections: this.connRows(),
      audio: {
        trackName: a.trackName,
        trackId: a.trackId,
        hasTrack: a.hasTrack,
        playing: a.isPlaying,
        muted: a.muted,
        current: a.audio.currentTime || 0,
        duration: Number.isFinite(a.audio.duration) ? a.audio.duration : 0,
        volume: a.speakerVolume,
        rate: a.audio.playbackRate,
        rhythmEnabled: a.rhythmEnabled,
        rhythmMode: a.rhythmMode,
        autoMix: a.autoMix,
        mixStatus: a.mixStatus,
        mixNote: a.mixNote,
        mixVoice: a.mixVoice,
        bands: {
          bass: {
            enabled: a.bands.bass.enabled,
            sensitivity: a.bands.bass.sensitivity,
            energy: a.bands.bass.energy,
            locked: a.locked.bass,
            playing: a.playing.bass,
            readiness: a.readiness.bass,
            weaveRate: a.bands.bass.weaveRate,
          },
          mid: {
            enabled: a.bands.mid.enabled,
            sensitivity: a.bands.mid.sensitivity,
            energy: a.bands.mid.energy,
            locked: a.locked.mid,
            playing: a.playing.mid,
            readiness: a.readiness.mid,
            weaveRate: a.bands.mid.weaveRate,
          },
          high: {
            enabled: a.bands.high.enabled,
            sensitivity: a.bands.high.sensitivity,
            energy: a.bands.high.energy,
            locked: a.locked.high,
            playing: a.playing.high,
            readiness: a.readiness.high,
            weaveRate: a.bands.high.weaveRate,
          },
        },
      },
    };
  }

  setPaused(value: boolean): void {
    this.paused = value;
  }

  togglePaused(): void {
    this.paused = !this.paused;
  }

  setSpeed(value: number): void {
    this.speed = Math.max(0, value);
  }

  setSpinFactor(value: number): void {
    this.spinFactor = Math.max(0, value);
  }

  setLinesPerSec(value: number): void {
    this.linesPerSec = Math.max(0.1, value);
  }

  setMaxWeave(value: number): void {
    this.audio.setMaxWeave(value);
  }

  setTrailDuration(value: number): void {
    this.trailDuration = Math.max(0, value);
  }

  setPathWidth(value: number): void {
    this.pathWidth = THREE.MathUtils.clamp(value, 0.25, 16);
    for (const path of this.paths.values()) path.setWidth(this.pathWidth);
  }

  setStringWidth(value: number): void {
    this.stringWidth = THREE.MathUtils.clamp(value, 0.25, 24);
    for (const conn of this.connections) conn.setWidth(this.stringWidth);
  }

  setOrbitMode(mode: OrbitMode): void {
    if (mode === "hidden") {
      this.orbitMode = "hidden";
      this.applyPathVisibility();
      return;
    }
    const circular = mode === "circular";
    const changed = (this.orbitMode === "circular") !== circular;
    this.orbitMode = circular ? "circular" : "realistic";
    if (changed) this.recreatePaths();
    else this.applyPathVisibility();
  }

  setBackground(type: BackgroundType): void {
    this.background = type;
    this.updateBackground();
  }

  setParallax(value: boolean): void {
    this.parallax = value;
    this.starfield.setVisible(value);
  }

  setAmbient(value: number): void {
    this.ambientLight.intensity = Math.max(0, value);
  }

  setBloom(value: number): void {
    if (this.bloomPass) this.bloomPass.strength = Math.max(0, value);
  }

  setAntialias(value: boolean): void {
    this.antialias = value;
    if (this.fxaaPass) this.fxaaPass.enabled = value;
  }

  setRingBrightness(value: number): void {
    this.ringBrightness = Math.max(0, value);
    for (const body of this.bodies) {
      if (body instanceof Planet) body.setRingBrightness(this.ringBrightness);
    }
  }

  toggleUi(): void {
    this.uiHidden = !this.uiHidden;
  }

  resetPlanets(): void {
    for (const body of this.bodies) body.resetAngle();
    this.selected = [];
    this.updateHighlights();
    this.clearTrails();
  }

  clearTrails(): void {
    for (const conn of this.connections) conn.clear();
  }

  trailCount(): number {
    return this.connections.reduce((sum, conn) => sum + conn.segmentCount(), 0);
  }

  toggleSelectionByName(name: string): void {
    const body = this.bodies.find((b) => b.name === name);
    if (body) this.toggleSelection(body);
  }

  setBodyVisibility(name: string, visible: boolean): void {
    const body = this.bodies.find((b) => b.name === name);
    if (!body) return;
    body.setVisible(visible);
    if (!visible) this.selected = this.selected.filter((b) => b !== body);
    this.applyPathVisibility();
    this.updateHighlights();
  }

  setPlanetPathColor(name: string, color: string): void {
    const key = name.toLowerCase();
    const hex = `#${new THREE.Color(color).getHexString()}`;
    this.pathColors[key] = hex;
    this.paths.get(key)?.setColor(hex);
  }

  createConnection(): Connection | null {
    if (this.selected.length !== 2) return null;
    const [a, b] = this.selected;
    if (!a || !b) return null;
    const conn = this.connectBodies(a, b, "all", PALETTE[this.connCount % PALETTE.length]!);
    this.selected = [];
    this.updateHighlights();
    return conn;
  }

  removeConnection(id: string): void {
    const index = this.connections.findIndex((c) => c.id === id);
    if (index < 0) return;
    const conn = this.connections[index]!;
    this.audio.removeConnection(conn);
    conn.dispose();
    this.connections.splice(index, 1);
  }

  setConnectionColor(id: string, color: string, alpha?: number): void {
    const conn = this.connections.find((c) => c.id === id);
    if (!conn) return;
    conn.setColor(color);
    if (alpha !== undefined) conn.setBaseAlpha(alpha);
  }

  setConnectionVisibility(id: string, visible: boolean): void {
    this.connections.find((c) => c.id === id)?.setVisible(visible);
  }

  setConnectionRhythmType(id: string, rhythmType: RhythmBand): void {
    const conn = this.connections.find((c) => c.id === id);
    if (!conn) return;
    this.audio.removeConnection(conn);
    conn.rhythmType = rhythmType;
    if (rhythmType !== "custom") {
      const [min, max] = hzForPreset(rhythmType);
      conn.minFreq = min;
      conn.maxFreq = max;
    }
    this.audio.registerConnection(conn, rhythmType);
  }

  seedDefaultWeave(): void {
    for (const pair of DEFAULT_WEAVE) {
      const a = this.bodies.find((b) => b.name === pair.a);
      const b = this.bodies.find((b) => b.name === pair.b);
      if (a && b) this.connectBodies(a, b, pair.rhythm, pair.color);
    }
  }

  weaveIfEmpty(): void {
    if (this.connections.length === 0) this.seedDefaultWeave();
  }

  loadFile(file: File): void {
    this.audio.loadFile(file);
    this.weaveIfEmpty();
    this.clearTrails();
  }

  loadLibrary(id: string): void {
    this.audio.loadLibrary(id);
    this.weaveIfEmpty();
    this.clearTrails();
  }

  loadDemo(): void {
    this.audio.loadDemo();
    this.weaveIfEmpty();
    this.clearTrails();
  }

  toggleMute(): void {
    this.audio.toggleMute();
  }

  setConnectionFreq(id: string, minFreq: number, maxFreq: number): void {
    const conn = this.connections.find((c) => c.id === id);
    if (!conn) return;
    conn.minFreq = Math.min(minFreq, maxFreq);
    conn.maxFreq = Math.max(minFreq, maxFreq);
    conn.rhythmType = presetFromHz(conn.minFreq, conn.maxFreq);
  }

  async setHiRes(enabled: boolean): Promise<void> {
    if (!enabled) {
      this.ultraAbort?.abort();
      this.ultraAbort = null;
      this.hiResBusy = false;
      this.hiRes = false;
      this.hiResNote = note("maps.twoK");
      this.pack = this.basePack;
      this.applyCurrentPack();
      try {
        localStorage.setItem("viz-hires", "0");
      } catch {
        /* ignore */
      }
      return;
    }
    if (this.hiResBusy) return;
    if (this.hiPack && this.ultraComplete) {
      this.hiRes = true;
      this.pack = this.hiPack;
      this.applyCurrentPack();
      this.hiResNote = note("maps.ready");
      try {
        localStorage.setItem("viz-hires", "1");
      } catch {
        /* ignore */
      }
      return;
    }
    if (!this.basePack) return;

    this.hiResBusy = true;
    this.hiRes = true;
    this.hiResNote = note("maps.fetching");
    try {
      localStorage.setItem("viz-hires", "1");
    } catch {
      /* ignore */
    }

    this.ultraAbort?.abort();
    this.ultraAbort = new AbortController();
    const { signal } = this.ultraAbort;
    const fallback = this.basePack;
    if (!this.hiPack) {
      const maps: Record<string, THREE.Texture> = { ...fallback.maps };
      this.hiPack = {
        maps,
        body: (name: string) => {
          const key = name.toLowerCase();
          if (key === "venus") return { map: maps.venus, atmosphere: maps.venusAtmosphere };
          if (key === "earth") return { map: maps.earth, clouds: maps.earthClouds };
          if (key === "saturn") return { map: maps.saturn, rings: maps.saturnRing };
          return { map: maps[key] };
        },
        dispose: () => {
          const keep = new Set(Object.values(fallback.maps));
          for (const tex of Object.values(maps)) {
            if (!keep.has(tex)) tex.dispose();
          }
        },
      };
    }
    this.pack = this.hiPack;
    const maps = this.hiPack.maps;

    const maxSize = Math.min(8192, this.renderer.capabilities.maxTextureSize || 4096);
    let applied = 0;
    try {
      for await (const step of fetchHiResMaps(maxSize, signal)) {
        if (this.disposed || signal.aborted) return;
        if (step.phase === "start") {
          this.hiResNote = note("maps.fetchingItem", {
            n: step.done + 1,
            total: step.total,
            map: step.key,
          });
          continue;
        }
        if (step.phase !== "ok" || !step.tex) {
          this.hiResNote = note("maps.skipped", {
            n: step.done,
            total: step.total,
            map: step.key,
          });
          continue;
        }
        const current = maps[step.key];
        if (current && current !== fallback.maps[step.key]) {
          step.tex.dispose();
          applied += 1;
          this.hiResNote = note("maps.ultraItem", {
            n: step.done,
            total: step.total,
            map: step.key,
          });
          continue;
        }
        maps[step.key] = step.tex;
        this.applyMapKey(step.key);
        applied += 1;
        this.hiResNote = note("maps.ultraItem", {
          n: step.done,
          total: step.total,
          map: step.key,
        });
      }
      if (this.disposed || signal.aborted) return;
      this.hiResNote = applied > 0 ? note("maps.ready") : note("maps.unavailable");
      this.ultraComplete = applied > 0;
    } catch {
      if (signal.aborted || this.disposed) return;
      this.hiResNote = applied > 0 ? note("maps.ready") : note("maps.failed");
    } finally {
      this.hiResBusy = false;
    }
  }

  private queueUltraMaps(): void {
    let prefer = true;
    try {
      prefer = localStorage.getItem("viz-hires") !== "0";
    } catch {
      prefer = true;
    }
    if (!prefer) {
      this.hiRes = false;
      this.hiResNote = note("maps.twoK");
      return;
    }
    void this.setHiRes(true);
  }

  private applyMapKey(key: string): void {
    const pack = this.pack;
    if (!pack) return;
    if (key === "sun") {
      this.sun.setMap(pack.maps.sun);
      return;
    }
    const host: Record<string, string> = {
      mercury: "Mercury",
      venus: "Venus",
      venusAtmosphere: "Venus",
      earth: "Earth",
      earthClouds: "Earth",
      moon: "Moon",
      mars: "Mars",
      jupiter: "Jupiter",
      saturn: "Saturn",
      saturnRing: "Saturn",
      uranus: "Uranus",
      neptune: "Neptune",
    };
    const name = host[key];
    if (!name) return;
    const body = this.bodies.find((item) => item.name === name);
    if (body instanceof Planet) body.applyTextures(pack.body(name));
  }

  private applyCurrentPack(): void {
    const pack = this.pack;
    if (!pack) return;
    this.sun.setMap(pack.maps.sun);
    for (const body of this.bodies) {
      if (body instanceof Planet) body.applyTextures(pack.body(body.name));
    }
    if (this.background === "milkyway") this.updateBackground();
  }

  playAudio(): void {
    this.audio.play();
  }

  toggleAudio(): void {
    this.audio.toggle();
  }

  seekAudio(percent: number): void {
    this.audio.seek(percent);
  }

  setVolume(value: number): void {
    this.audio.setVolume(value);
  }

  setRate(value: number): void {
    this.audio.setRate(value);
  }

  setRhythmEnabled(value: boolean): void {
    this.audio.rhythmEnabled = value;
  }

  setRhythmMode(mode: RhythmMode): void {
    this.audio.rhythmMode = mode;
  }

  setBandEnabled(band: "bass" | "mid" | "high", enabled: boolean): void {
    this.audio.bands[band].enabled = enabled;
  }

  setBandSensitivity(band: "bass" | "mid" | "high", value: number): void {
    this.audio.bands[band].sensitivity = value;
    this.audio.lockBand(band);
  }

  setAutoMix(value: boolean): void {
    this.audio.setAutoMix(value);
  }

  lockBand(band: "bass" | "mid" | "high"): void {
    this.audio.lockBand(band);
  }

  unlockBand(band: "bass" | "mid" | "high"): void {
    this.audio.unlockBand(band);
  }

  setAutoOrbit(value: boolean): void {
    this.autoOrbit = value;
    this.applyOrbitSpin();
  }

  setAutoOrbitSpeed(value: number): void {
    this.autoOrbitSpeed = Math.min(3, Math.max(0.15, value));
    this.applyOrbitSpin();
  }

  setAutoOrbitDir(dir: OrbitDir): void {
    this.autoOrbitDir = dir;
    this.applyOrbitSpin();
  }

  private applyOrbitSpin(): void {
    this.controls.autoRotate = this.autoOrbit;
    const sign = this.autoOrbitDir === "ccw" ? 1 : -1;
    this.controls.autoRotateSpeed = this.autoOrbitSpeed * sign;
  }

  setVideoAspect(aspect: VideoAspect): void {
    this.videoAspect = aspect;
  }

  setVideoQuality(quality: VideoQuality): void {
    this.videoQuality = quality;
  }

  setVideoFps(fps: VideoFps): void {
    this.videoFps = fps;
  }

  startRecording(aspect?: VideoAspect, quality?: VideoQuality): void {
    if (this.recording) return;
    if (aspect) this.videoAspect = aspect;
    if (quality) this.videoQuality = quality;
    const raw = exportSize(this.videoAspect, this.videoQuality);
    const { width, height } = this.clampExportSize(raw.width, raw.height);
    const fps = fpsValue(this.videoFps);
    this.prepareExportFrame(width, height);
    this.audio.ensureContext();
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);

    const session = new CaptureSession();
    const ok = session.start(this.renderer.domElement, this.audio.captureStream(), width, height, fps);
    if (!ok) {
      this.restoreExportFrame();
      this.recordNote = session.note.key ? session.note : note("record.noSupport");
      return;
    }
    this.capture = session;
    this.recording = true;
    this.recordNote = session.note;
  }

  async stopRecording(): Promise<void> {
    if (!this.recording && !this.capture) return;
    this.recording = false;
    const session = this.capture;
    this.capture = null;
    this.restoreExportFrame();
    if (!session) return;
    const result = await session.stop();
    if (!result) {
      this.recordNote = note("record.nothing");
      return;
    }
    const name = stampFilename(result.ext, this.audio.trackName);
    downloadBlob(result.blob, name);
    this.recordNote = note("record.saved", { name });
  }

  zoomBy(factor: number): void {
    const viewDir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target);
    const next = THREE.MathUtils.clamp(
      viewDir.length() * factor,
      this.controls.minDistance,
      this.controls.maxDistance,
    );
    viewDir.setLength(next);
    this.camera.position.copy(this.controls.target).add(viewDir);
    this.controls.update();
  }

  onResize(): void {
    if (this.disposed) return;
    if (this.exportFrame) {
      this.fitExportCss(this.exportFrame.width, this.exportFrame.height);
      return;
    }
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer?.setSize(w, h);
    this.bloomPass?.setSize(w, h);
  }

  private clampExportSize(width: number, height: number): { width: number; height: number } {
    const max = Math.min(this.renderer.capabilities.maxTextureSize || 8192, 8192);
    if (width <= max && height <= max) return { width, height };
    const scale = max / Math.max(width, height);
    return {
      width: Math.max(2, Math.round((width * scale) / 2) * 2),
      height: Math.max(2, Math.round((height * scale) / 2) * 2),
    };
  }

  private prepareExportFrame(width: number, height: number): void {
    const canvas = this.renderer.domElement;
    this.viewRestore = {
      width: Math.max(1, this.container.clientWidth),
      height: Math.max(1, this.container.clientHeight),
      pixelRatio: this.renderer.getPixelRatio(),
    };
    this.exportFrame = { width, height };
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(width, height, false);
    this.composer?.setSize(width, height);
    this.bloomPass?.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.fitExportCss(width, height);
    canvas.style.background = "var(--color-bg)";
  }

  private restoreExportFrame(): void {
    const restore = this.viewRestore;
    this.exportFrame = null;
    this.viewRestore = null;
    const canvas = this.renderer.domElement;
    canvas.style.position = "";
    canvas.style.left = "";
    canvas.style.top = "";
    canvas.style.transform = "";
    canvas.style.width = "";
    canvas.style.height = "";
    canvas.style.background = "";
    canvas.className = "block h-full w-full";
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.renderer.setPixelRatio(restore?.pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
    this.composer?.setSize(w, h);
    this.bloomPass?.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private fitExportCss(width: number, height: number): void {
    const canvas = this.renderer.domElement;
    const cw = Math.max(1, this.container.clientWidth);
    const ch = Math.max(1, this.container.clientHeight);
    const frameAspect = width / height;
    const boxAspect = cw / ch;
    let cssW: number;
    let cssH: number;
    if (boxAspect > frameAspect) {
      cssH = ch;
      cssW = ch * frameAspect;
    } else {
      cssW = cw;
      cssH = cw / frameAspect;
    }
    canvas.style.position = "absolute";
    canvas.style.left = "50%";
    canvas.style.top = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
    canvas.style.width = `${Math.round(cssW)}px`;
    canvas.style.height = `${Math.round(cssH)}px`;
  }

  dispose(): void {
    this.disposed = true;
    this.ultraAbort?.abort();
    if (this.capture) {
      void this.capture.stop();
      this.capture = null;
      this.recording = false;
      this.restoreExportFrame();
    }
    this.renderer.setAnimationLoop(null);
    this.ro?.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.renderer.domElement.removeEventListener("pointerdown", this.onPointerDown);
    this.renderer.domElement.removeEventListener("pointermove", this.onPointerMove);
    this.renderer.domElement.removeEventListener("pointerup", this.onPointerUp);
    this.renderer.domElement.removeEventListener("pointercancel", this.onPointerUp);
    this.renderer.domElement.removeEventListener("contextmenu", this.onContextMenu);
    for (const conn of this.connections) {
      this.audio.removeConnection(conn);
      conn.dispose();
    }
    this.connections = [];
    for (const path of this.paths.values()) path.dispose();
    this.paths.clear();
    for (const body of this.bodies) body.dispose();
    this.starfield.dispose();
    this.clearSky();
    this.hiPack?.dispose();
    this.hiPack = null;
    this.controls.dispose();
    this.composer?.dispose();
    this.renderer.dispose();
    if (!this.renderer.domElement.hasAttribute("aria-hidden")) {
      this.renderer.domElement.remove();
    }
    this.audio.dispose();
  }

  private tick = (): void => {
    if (this.disposed) return;
    this.timer.update();
    const delta = Math.min(this.timer.getDelta(), 0.1);
    this.fps = THREE.MathUtils.lerp(this.fps, 1 / Math.max(delta, 1 / 240), 0.08);
    this.controls.update();
    this.audio.followMix(this.audio.audio.currentTime || 0);

    if (!this.paused) {
      const simDelta = delta * this.speed;
      if (this.parallax) this.starfield.update(this.camera.position, delta);
      for (const body of this.bodies) {
        body.update(simDelta, this.orbitMode === "circular", this.speed, this.spinFactor);
      }

      this.audio.update(delta);
      this.sun.setPulse(this.audio.isPlaying ? this.audio.bands.bass.energy / 220 : 0);

      const rhythmActive = this.audio.isPlaying && this.audio.rhythmEnabled;
      if (!rhythmActive) {
        this.frameAcc += delta;
        const interval = 1 / Math.max(this.linesPerSec, 0.05);
        while (this.frameAcc >= interval) {
          this.frameAcc -= interval;
          for (const conn of this.connections) conn.addSegment();
        }
      }
    }

    for (const conn of this.connections) {
      conn.maxAge = this.trailDuration;
      conn.update();
    }

    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);

    this.ready = true;
  };

  private createBodies(): void {
    this.bodies = [this.sun];
    const byName = new Map<string, CelestialBody>();
    byName.set("sun", this.sun);

    const mobile = (this.container.clientWidth || window.innerWidth) < 700;
    const segments = mobile ? 32 : 64;

    for (const def of PLANET_DEFS) {
      const planet = new Planet(def, segments, this.pack?.body(def.name) ?? {});
      const parent = def.parent ? byName.get(def.parent.toLowerCase()) : null;
      planet.parentBody = parent ?? null;
      if (parent?.group) parent.group.add(planet.group);
      else this.scene.add(planet.group);

      if (def.semiMajor > 0) {
        const host = parent?.group ?? this.scene;
        const ecc = this.orbitMode === "circular" ? 0 : def.eccentricity;
        const color = this.pathColors[def.name.toLowerCase()] ?? "#8aa4b8";
        const path = new OrbitPath(host, def.semiMajor, ecc, new THREE.Color(color).getHex(), this.pathWidth);
        planet.setOrbitPath(path.mesh);
        this.paths.set(def.name.toLowerCase(), path);
      }

      byName.set(def.name.toLowerCase(), planet);
      this.bodies.push(planet);
    }
    this.applyPathVisibility();
  }

  private recreatePaths(): void {
    for (const path of this.paths.values()) path.dispose();
    this.paths.clear();
    for (const body of this.bodies) {
      if (body === this.sun || body.semiMajor <= 0) continue;
      const ecc = this.orbitMode === "circular" ? 0 : body.originalEccentricity;
      const host = body.parentBody?.group ?? this.scene;
      const color = this.pathColors[body.name.toLowerCase()] ?? "#8aa4b8";
      const path = new OrbitPath(host, body.semiMajor, ecc, new THREE.Color(color).getHex(), this.pathWidth);
      body.setOrbitPath(path.mesh);
      this.paths.set(body.name.toLowerCase(), path);
    }
    this.applyPathVisibility();
  }

  private applyPathVisibility(): void {
    const visible = this.orbitMode !== "hidden";
    for (const body of this.bodies) {
      if (body.orbitPath) body.orbitPath.visible = visible && body.visible;
    }
  }

  private connectBodies(
    a: CelestialBody,
    b: CelestialBody,
    rhythm: RhythmBand,
    color: number,
  ): Connection | null {
    const exists = this.connections.some(
      (c) => (c.body1 === a && c.body2 === b) || (c.body1 === b && c.body2 === a),
    );
    if (exists) return null;
    const conn = new Connection(this.scene, a, b, color, this.stringWidth);
    conn.id = `conn-${++this.connCount}`;
    conn.maxAge = this.trailDuration;
    conn.rhythmType = rhythm;
    this.connections.push(conn);
    this.audio.registerConnection(conn, rhythm);
    return conn;
  }

  private toggleSelection(planet: CelestialBody): void {
    if (planet.visible === false) return;
    const index = this.selected.indexOf(planet);
    if (index >= 0) this.selected.splice(index, 1);
    else if (this.selected.length < 2) this.selected.push(planet);
    this.updateHighlights();
  }

  private updateHighlights(): void {
    for (const body of this.bodies) body.setSelected(this.selected.includes(body));
  }

  private bodyRows(): BodyRow[] {
    return this.bodies.map((b) => ({
      name: b.name,
      selected: this.selected.includes(b),
      visible: b.visible,
      pathColor: this.pathColors[b.name.toLowerCase()] ?? "#8aa4b8",
      hasPath: Boolean(b.orbitPath) && this.orbitMode !== "hidden",
    }));
  }

  private connRows(): ConnRow[] {
    return this.connections.map((c) => ({
      id: c.id,
      a: c.body1.name,
      b: c.body2.name,
      color: `#${c.color.getHexString()}`,
      alpha: c.baseAlpha,
      visible: c.visible,
      rhythmType: c.rhythmType,
      minFreq: c.minFreq,
      maxFreq: c.maxFreq,
    }));
  }

  private updateBackground(): void {
    this.clearSky();
    if (this.background === "none") {
      this.scene.background = new THREE.Color(0x07080c);
      return;
    }
    this.scene.background = null;
    const packSky = this.background === "milkyway" ? this.pack?.maps.milkyway : undefined;
    this.skyFromPack = Boolean(packSky);
    this.skyMap = packSky ?? createSkyTexture(this.background, 1024);
    const geo = new THREE.SphereGeometry(5200, this.skyFromPack ? 96 : 48, this.skyFromPack ? 64 : 32);
    const mat = new THREE.MeshBasicMaterial({
      map: this.skyMap,
      side: THREE.BackSide,
      depthWrite: false,
    });
    this.sky = new THREE.Mesh(geo, mat);
    this.sky.renderOrder = -2;
    this.scene.add(this.sky);
  }

  private clearSky(): void {
    if (this.sky) {
      this.scene.remove(this.sky);
      this.sky.geometry.dispose();
      (this.sky.material as THREE.Material).dispose();
      this.sky = null;
    }
    if (this.skyMap && !this.skyFromPack) this.skyMap.dispose();
    this.skyMap = null;
    this.skyFromPack = false;
  }

  private bindPointer(): void {
    const el = this.renderer.domElement;
    el.addEventListener("pointerdown", this.onPointerDown);
    el.addEventListener("pointermove", this.onPointerMove);
    el.addEventListener("pointerup", this.onPointerUp);
    el.addEventListener("pointercancel", this.onPointerUp);
    el.addEventListener("contextmenu", this.onContextMenu);
  }

  private onPointerDown = (event: PointerEvent): void => {
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.down = true;
    this.pointer.moved = false;
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.pointer.down) return;
    const dx = event.clientX - this.pointer.x;
    const dy = event.clientY - this.pointer.y;
    if (dx * dx + dy * dy > 16) this.pointer.moved = true;
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (!this.pointer.down) return;
    this.pointer.down = false;
    if (this.pointer.moved) return;
    if (event.button !== 0) return;
    this.pick(event);
  };

  private onContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
    if (this.selected.length === 2) {
      this.createConnection();
      return;
    }
    this.pick(event);
    if (this.selected.length === 2) this.createConnection();
  };

  private pick(event: MouseEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes = this.bodies.map((b) => b.mesh);
    const hits = this.raycaster.intersectObjects(meshes, false);
    if (hits.length === 0) return;
    const mesh = hits[0]?.object;
    const planet = this.bodies.find((b) => b.mesh === mesh);
    if (planet) this.toggleSelection(planet);
  }

  private onVisibility = (): void => {
    if (document.visibilityState === "visible") this.audio.ensureContext();
  };
}
