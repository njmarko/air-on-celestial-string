import * as THREE from "three";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import type { CelestialBody, RhythmBand } from "./types";

type Segment = { p1: THREE.Vector3; p2: THREE.Vector3; time: number };

export class Connection {
  id = "";
  body1: CelestialBody;
  body2: CelestialBody;
  color: THREE.Color;
  baseAlpha = 1;
  maxAge = 60;
  visible = true;
  rhythmType: RhythmBand = "all";
  minFreq = 20;
  maxFreq = 8000;
  energy = 0;
  lastBeat = 0;
  weaveAcc = 0;
  beatCallbacks: Array<{ type: RhythmBand; callback: () => void }> = [];

  private scene: THREE.Scene;
  private segments: Segment[] = [];
  private geometry: LineSegmentsGeometry;
  private material: LineMaterial;
  line: LineSegments2;
  private pos: Float32Array;
  private col: Float32Array;
  private readonly _p1 = new THREE.Vector3();
  private readonly _p2 = new THREE.Vector3();
  private readonly maxSegments = 12000;

  constructor(scene: THREE.Scene, body1: CelestialBody, body2: CelestialBody, color = 0x88ffaa, width = 2) {
    this.scene = scene;
    this.body1 = body1;
    this.body2 = body2;
    this.color = new THREE.Color(color);

    this.pos = new Float32Array(this.maxSegments * 6);
    this.col = new Float32Array(this.maxSegments * 6);
    this.geometry = new LineSegmentsGeometry();
    this.geometry.setPositions(this.pos);
    this.geometry.setColors(this.col);
    this.geometry.instanceCount = 0;

    this.material = new LineMaterial({
      color: 0xffffff,
      linewidth: width,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });

    this.line = new LineSegments2(this.geometry, this.material);
    this.line.frustumCulled = false;
    scene.add(this.line);
  }

  addSegment(): void {
    if (!this.visible) return;
    const p1 = this.body1.getWorldPosition(this._p1).clone();
    const p2 = this.body2.getWorldPosition(this._p2).clone();
    this.segments.push({ p1, p2, time: performance.now() });
    if (this.segments.length > this.maxSegments) {
      this.segments.splice(0, this.segments.length - this.maxSegments);
    }
  }

  update(): void {
    const now = performance.now();
    if (this.maxAge > 0) {
      const maxMs = this.maxAge * 1000;
      this.segments = this.segments.filter((seg) => now - seg.time <= maxMs);
    }

    const count = this.segments.length;
    const col = this.color;
    let drawn = 0;
    let v = 0;
    let c = 0;
    for (let i = 0; i < count; i++) {
      const seg = this.segments[i]!;
      const age = (now - seg.time) / 1000;
      let fade = 1;
      if (this.maxAge > 0) fade = Math.max(0, 1 - age / this.maxAge);
      const alpha = fade * this.baseAlpha;
      if (alpha <= 0.01) continue;
      this.pos[v++] = seg.p1.x;
      this.pos[v++] = seg.p1.y;
      this.pos[v++] = seg.p1.z;
      this.pos[v++] = seg.p2.x;
      this.pos[v++] = seg.p2.y;
      this.pos[v++] = seg.p2.z;
      const r = col.r * alpha;
      const g = col.g * alpha;
      const b = col.b * alpha;
      this.col[c++] = r;
      this.col[c++] = g;
      this.col[c++] = b;
      this.col[c++] = r;
      this.col[c++] = g;
      this.col[c++] = b;
      drawn++;
    }

    const start = this.geometry.getAttribute("instanceStart");
    const colorStart = this.geometry.getAttribute("instanceColorStart");
    if (start) start.needsUpdate = true;
    if (colorStart) colorStart.needsUpdate = true;
    this.geometry.instanceCount = drawn;
    this.line.visible = this.visible && drawn > 0;
  }

  setColor(newColor: THREE.ColorRepresentation): void {
    this.color.set(newColor);
  }

  setBaseAlpha(alpha: number): void {
    this.baseAlpha = THREE.MathUtils.clamp(alpha, 0, 1);
  }

  setWidth(width: number): void {
    this.material.linewidth = Math.max(0.25, width);
  }

  setVisible(isVisible: boolean): void {
    this.visible = isVisible;
    this.line.visible = isVisible && this.segments.length > 0;
  }

  segmentCount(): number {
    return this.segments.length;
  }

  clear(): void {
    this.segments = [];
    this.weaveAcc = 0;
    this.geometry.instanceCount = 0;
    this.line.visible = false;
  }

  dispose(): void {
    this.scene.remove(this.line);
    this.geometry.dispose();
    this.material.dispose();
  }
}
