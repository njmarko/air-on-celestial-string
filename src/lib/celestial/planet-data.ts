import type { PlanetDef, RhythmBand } from "./types";

export const BAND_HZ: Record<Exclude<RhythmBand, "custom">, [number, number]> = {
  bass: [20, 220],
  mid: [220, 800],
  high: [800, 6000],
  all: [20, 8000],
};

export function presetFromHz(min: number, max: number): RhythmBand {
  for (const [key, range] of Object.entries(BAND_HZ) as Array<[Exclude<RhythmBand, "custom">, [number, number]]>) {
    if (range[0] === min && range[1] === max) return key;
  }
  return "custom";
}

export function hzForPreset(preset: RhythmBand): [number, number] {
  if (preset === "custom") return [20, 8000];
  return BAND_HZ[preset];
}

export const PLANET_DEFS: PlanetDef[] = [
  {
    name: "Mercury",
    radius: 4.8,
    semiMajor: 80,
    orbitSpeed: 0.04,
    axialTilt: 0.0,
    rotationPeriodDays: 58.65,
    eccentricity: 0.2056,
    rings: false,
    atmosphere: false,
  },
  {
    name: "Venus",
    radius: 9.2,
    semiMajor: 120,
    orbitSpeed: 0.015,
    axialTilt: 177.3,
    rotationPeriodDays: -243.02,
    eccentricity: 0.0068,
    rings: false,
    atmosphere: true,
  },
  {
    name: "Earth",
    radius: 9.8,
    semiMajor: 170,
    orbitSpeed: 0.01,
    axialTilt: 23.4,
    rotationPeriodDays: 0.997,
    eccentricity: 0.0167,
    rings: false,
    atmosphere: true,
  },
  {
    name: "Moon",
    radius: 2.7,
    semiMajor: 28,
    orbitSpeed: 0.25,
    axialTilt: 6.7,
    rotationPeriodDays: 27.32,
    eccentricity: 0.0549,
    rings: false,
    atmosphere: false,
    parent: "Earth",
  },
  {
    name: "Mars",
    radius: 5.2,
    semiMajor: 230,
    orbitSpeed: 0.008,
    axialTilt: 25.2,
    rotationPeriodDays: 1.026,
    eccentricity: 0.0934,
    rings: false,
    atmosphere: false,
  },
  {
    name: "Jupiter",
    radius: 28,
    semiMajor: 340,
    orbitSpeed: 0.002,
    axialTilt: 3.1,
    rotationPeriodDays: 0.413,
    eccentricity: 0.0489,
    rings: false,
    atmosphere: false,
  },
  {
    name: "Saturn",
    radius: 24,
    semiMajor: 460,
    orbitSpeed: 0.0009,
    axialTilt: 26.7,
    rotationPeriodDays: 0.444,
    eccentricity: 0.0565,
    rings: true,
    atmosphere: false,
  },
  {
    name: "Uranus",
    radius: 16,
    semiMajor: 580,
    orbitSpeed: 0.0004,
    axialTilt: 97.8,
    rotationPeriodDays: 0.718,
    eccentricity: 0.0463,
    rings: false,
    atmosphere: true,
  },
  {
    name: "Neptune",
    radius: 15.5,
    semiMajor: 680,
    orbitSpeed: 0.0002,
    axialTilt: 28.3,
    rotationPeriodDays: 0.671,
    eccentricity: 0.0097,
    rings: false,
    atmosphere: true,
  },
];

export const SPIN_RATES: Record<string, number> = {
  Mercury: 1.8,
  Venus: -0.35,
  Earth: 3.2,
  Moon: 0.6,
  Mars: 2.9,
  Jupiter: 14.5,
  Saturn: 12.8,
  Uranus: 5.8,
  Neptune: 5.4,
};

export type WeavePair = {
  a: string;
  b: string;
  rhythm: RhythmBand;
  color: number;
};

export const DEFAULT_WEAVE: WeavePair[] = [
  { a: "Mercury", b: "Venus", rhythm: "all", color: 0x8ec9e8 },
];

export const PATH_COLORS: Record<string, string> = {
  sun: "#e8dcc0",
  mercury: "#b7aaa0",
  venus: "#d4c4a8",
  earth: "#8ec4d4",
  moon: "#c8c8c8",
  mars: "#d4a08c",
  jupiter: "#d4c0a0",
  saturn: "#e0d4b0",
  uranus: "#9fd0d0",
  neptune: "#7ea0d0",
};
