import * as THREE from "three";
import type { CelestialBody, RhythmBand } from "./types";

type Segment = { p1: THREE.Vector3; p2: THREE.Vector3; time: number };

const VERT_SRC = /* glsl */ `
  attribute vec4 aColor;
  varying vec4 vColor;
  void main() {
    vColor = aColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG_SRC = /* glsl */ `
  varying vec4 vColor;
  void main() {
    gl_FragColor = vColor;
  }
`;

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
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;
  line: THREE.LineSegments;
  private pos = new Float32Array(6);
  private col = new Float32Array(8);
  private readonly _p1 = new THREE.Vector3();
  private readonly _p2 = new THREE.Vector3();
  private readonly maxSegments = 4000;

  constructor(scene: THREE.Scene, body1: CelestialBody, body2: CelestialBody, color = 0x88ffaa) {
    this.scene = scene;
    this.body1 = body1;
    this.body2 = body2;
    this.color = new THREE.Color(color);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    this.geometry.setAttribute("aColor", new THREE.BufferAttribute(this.col, 4));
    this.geometry.setDrawRange(0, 0);

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT_SRC,
      fragmentShader: FRAG_SRC,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
    });

    this.line = new THREE.LineSegments(this.geometry, this.material);
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
    const need = Math.max(1, count) * 6;
    if (this.pos.length < need) {
      const cap = Math.max(need, this.pos.length * 2);
      this.pos = new Float32Array(cap);
      this.col = new Float32Array((cap / 3) * 4);
      this.geometry.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
      this.geometry.setAttribute("aColor", new THREE.BufferAttribute(this.col, 4));
    }

    let v = 0;
    let c = 0;
    const col = this.color;
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
      this.col[c++] = col.r;
      this.col[c++] = col.g;
      this.col[c++] = col.b;
      this.col[c++] = alpha;
      this.col[c++] = col.r;
      this.col[c++] = col.g;
      this.col[c++] = col.b;
      this.col[c++] = alpha;
    }

    const posAttr = this.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = this.geometry.getAttribute("aColor") as THREE.BufferAttribute;
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    this.geometry.setDrawRange(0, (v / 3) | 0);
    this.geometry.computeBoundingSphere();
  }

  setColor(newColor: THREE.ColorRepresentation): void {
    this.color.set(newColor);
  }

  setBaseAlpha(alpha: number): void {
    this.baseAlpha = THREE.MathUtils.clamp(alpha, 0, 1);
  }

  setVisible(isVisible: boolean): void {
    this.visible = isVisible;
    this.line.visible = isVisible;
  }

  segmentCount(): number {
    return this.segments.length;
  }

  clear(): void {
    this.segments = [];
    this.weaveAcc = 0;
    this.geometry.setDrawRange(0, 0);
  }

  dispose(): void {
    this.scene.remove(this.line);
    this.geometry.dispose();
    this.material.dispose();
  }
}
