import type { VideoAspect, VideoFps, VideoQuality } from "./recorder";
import type { LocNote } from "./loc-note";
import type * as THREE from "three";

export type RhythmBand = "bass" | "mid" | "high" | "all" | "custom";
export type OrbitMode = "circular" | "realistic" | "hidden";
export type BackgroundType = "none" | "stars" | "milkyway";
export type RhythmMode = "simple" | "advanced";
export type MixStatus = "idle" | "analyzing" | "live" | "failed";
export type OrbitDir = "ccw" | "cw";
export type ElevateDir = "up" | "down";
export type { VideoAspect, VideoFps, VideoQuality };

export type PlanetDef = {
  name: string;
  radius: number;
  semiMajor: number;
  orbitSpeed: number;
  axialTilt: number;
  rotationPeriodDays: number;
  eccentricity: number;
  rings: boolean;
  atmosphere: boolean;
  parent?: string;
};

export type BodyRow = {
  name: string;
  selected: boolean;
  visible: boolean;
  pathColor: string;
  hasPath: boolean;
};

export type ConnRow = {
  id: string;
  a: string;
  b: string;
  color: string;
  alpha: number;
  visible: boolean;
  rhythmType: RhythmBand;
  minFreq: number;
  maxFreq: number;
};

export type BandState = {
  enabled: boolean;
  sensitivity: number;
  energy: number;
  locked: boolean;
  playing: boolean;
  readiness: number;
  weaveRate: number;
};

export type VizSnapshot = {
  ready: boolean;
  fps: number;
  paused: boolean;
  uiHidden: boolean;
  speed: number;
  spinFactor: number;
  linesPerSec: number;
  maxWeave: number;
  trailDuration: number;
  pathWidth: number;
  stringWidth: number;
  orbitMode: OrbitMode;
  background: BackgroundType;
  parallax: boolean;
  ambient: number;
  bloom: number;
  antialias: boolean;
  ringBrightness: number;
  selectedCount: number;
  canCreate: boolean;
  hiRes: boolean;
  hiResNote: LocNote;
  autoOrbit: boolean;
  autoOrbitSpeed: number;
  autoOrbitDir: OrbitDir;
  autoElevate: boolean;
  autoElevateSpeed: number;
  autoElevateDir: ElevateDir;
  recording: boolean;
  recordElapsed: number;
  recordNote: LocNote;
  recordFormat: string;
  videoAspect: VideoAspect;
  videoQuality: VideoQuality;
  videoFps: VideoFps;
  bodies: BodyRow[];
  connections: ConnRow[];
  audio: {
    trackName: string;
    trackId: string;
    hasTrack: boolean;
    playing: boolean;
    muted: boolean;
    current: number;
    duration: number;
    volume: number;
    rate: number;
    rhythmEnabled: boolean;
    rhythmMode: RhythmMode;
    autoMix: boolean;
    mixStatus: MixStatus;
    mixNote: LocNote;
    mixVoice: string;
    bands: { bass: BandState; mid: BandState; high: BandState };
  };
};

export interface CelestialBody {
  name: string;
  mesh: THREE.Mesh;
  group: THREE.Group;
  visible: boolean;
  semiMajor: number;
  originalEccentricity: number;
  eccentricity: number;
  orbitPath: THREE.Object3D | null;
  parentBody: CelestialBody | null;
  update(
    delta: number,
    isCircular: boolean,
    simSpeed: number,
    spinFactor: number,
  ): void;
  setSelected(selected: boolean): void;
  setVisible(visible: boolean): void;
  getWorldPosition(target?: THREE.Vector3): THREE.Vector3;
  resetAngle(): void;
  setOrbitPath(pathMesh: THREE.Object3D | null): void;
  dispose(): void;
}
