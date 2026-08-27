import * as THREE from "three";
import { OrbitMath } from "./orbit-math";
import { SPIN_RATES } from "./planet-data";
import type { BodyTextures } from "./texture-pack";
import type { CelestialBody, PlanetDef } from "./types";
import { createPlanetTexture, createRingTexture } from "./textures";

export class Planet implements CelestialBody {
  name: string;
  mesh: THREE.Mesh;
  group: THREE.Group;
  visible = true;
  semiMajor: number;
  originalEccentricity: number;
  eccentricity: number;
  orbitPath: THREE.Object3D | null = null;
  parentBody: CelestialBody | null = null;

  private orbitSpeed: number;
  private spinSpeed: number;
  private meanAnomaly: number;
  private map: THREE.Texture;
  private ownsMap: boolean;
  private ringTex: THREE.Texture | null = null;
  private ownsRing = false;
  private rings: THREE.Mesh | null = null;
  private ringBrightness = 1.4;
  private atmosphere: THREE.Mesh | null = null;
  private clouds: THREE.Mesh | null = null;
  private selectionRing: THREE.Mesh;
  private readonly _world = new THREE.Vector3();

  constructor(def: PlanetDef, segments = 48, maps: BodyTextures = {}) {
    this.name = def.name;
    this.semiMajor = def.semiMajor;
    this.orbitSpeed = def.orbitSpeed;
    this.originalEccentricity = def.eccentricity;
    this.eccentricity = def.eccentricity;
    this.spinSpeed = SPIN_RATES[def.name] ?? 3;
    this.meanAnomaly = Math.random() * Math.PI * 2;

    this.group = new THREE.Group();
    this.group.name = def.name;

    const geometry = new THREE.SphereGeometry(def.radius, segments, Math.max(24, Math.floor(segments * 0.7)));
    this.ownsMap = !maps.map;
    this.map = maps.map ?? createPlanetTexture(def.name);
    const material = new THREE.MeshStandardMaterial({
      map: this.map,
      roughness: 0.72,
      metalness: 0.04,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.group.add(this.mesh);

    if (maps.clouds) this.createClouds(def.radius, maps.clouds, segments);
    if (def.atmosphere) this.createAtmosphere(def.radius, def.name, maps.atmosphere);
    if (def.rings) this.createRings(def.radius, maps.rings);

    this.selectionRing = this.createSelectionRing(def.radius);
    this.mesh.add(this.selectionRing);
    this.setSelected(false);

    this.group.rotation.x = THREE.MathUtils.degToRad(def.axialTilt);
  }

  private createClouds(radius: number, map: THREE.Texture, segments: number): void {
    const geo = new THREE.SphereGeometry(radius * 1.025, segments, Math.max(24, Math.floor(segments * 0.7)));
    const mat = new THREE.MeshStandardMaterial({
      map,
      alphaMap: map,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      roughness: 1,
      metalness: 0,
    });
    this.clouds = new THREE.Mesh(geo, mat);
    this.mesh.add(this.clouds);
  }

  private createAtmosphere(radius: number, name: string, map?: THREE.Texture): void {
    if (map) {
      const geo = new THREE.SphereGeometry(radius * 1.045, 48, 32);
      const mat = new THREE.MeshStandardMaterial({
        map,
        transparent: true,
        opacity: name === "Venus" ? 0.88 : 0.62,
        depthWrite: false,
        roughness: 0.9,
        metalness: 0,
      });
      this.atmosphere = new THREE.Mesh(geo, mat);
      this.mesh.add(this.atmosphere);
      return;
    }

    const tint =
      name === "Venus"
        ? new THREE.Color(0xe8c888)
        : name === "Uranus"
          ? new THREE.Color(0x9fd8d4)
          : name === "Neptune"
            ? new THREE.Color(0x6ea0e0)
            : new THREE.Color(0x99c8e8);
    const geo = new THREE.SphereGeometry(radius * 1.1, 32, 24);
    const mat = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: tint } },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.6);
          gl_FragColor = vec4(glowColor, intensity * 0.55);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    this.atmosphere = new THREE.Mesh(geo, mat);
    this.mesh.add(this.atmosphere);
  }

  private createRings(radius: number, map?: THREE.Texture): void {
    const inner = radius * 1.55;
    const outer = radius * 2.85;
    const geo = new THREE.RingGeometry(inner, outer, 96);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const l = Math.hypot(x, y);
      const radial = (l - inner) / (outer - inner);
      // SSS ring maps are a 1D radial strip (2048×125). Keep V centered so the
      // profile doesn't seam around the circle.
      uv.setXY(i, radial, 0.5);
    }
    uv.needsUpdate = true;
    this.ownsRing = !map;
    this.ringTex = map ?? createRingTexture();
    const mat = new THREE.MeshStandardMaterial({
      map: this.ringTex,
      alphaMap: this.ringTex,
      emissiveMap: this.ringTex,
      emissive: new THREE.Color(0xf2e6d0),
      emissiveIntensity: 0,
      color: new THREE.Color(0xf2ece0),
      side: THREE.DoubleSide,
      transparent: true,
      roughness: 0.48,
      metalness: 0.05,
      depthWrite: false,
    });
    this.rings = new THREE.Mesh(geo, mat);
    this.rings.rotation.x = Math.PI * 0.5;
    this.group.add(this.rings);
    this.applyRingBrightness();
  }

  setRingBrightness(value: number): void {
    this.ringBrightness = Math.max(0, value);
    this.applyRingBrightness();
  }

  private applyRingBrightness(): void {
    if (!this.rings) return;
    const mat = this.rings.material as THREE.MeshStandardMaterial;
    const v = this.ringBrightness;
    const gain = 0.5 + v * 0.9;
    mat.color.setRGB(gain, gain * 0.96, gain * 0.86);
    mat.emissiveIntensity = v * 0.62;
    mat.opacity = Math.min(1, 0.35 + v * 0.45);
    mat.needsUpdate = true;
  }

  private createSelectionRing(radius: number): THREE.Mesh {
    const geo = new THREE.RingGeometry(radius * 1.22, radius * 1.38, 64);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x8fd0da,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = Math.PI / 2;
    ring.visible = false;
    return ring;
  }

  applyTextures(maps: BodyTextures): void {
    if (maps.map && maps.map !== this.map) {
      if (this.ownsMap) this.map.dispose();
      this.map = maps.map;
      this.ownsMap = false;
      const material = this.mesh.material as THREE.MeshStandardMaterial;
      material.map = this.map;
      material.needsUpdate = true;
    }
    const radius = (this.mesh.geometry as THREE.SphereGeometry).parameters.radius;
    if (maps.clouds) {
      if (this.clouds) {
        const mat = this.clouds.material as THREE.MeshStandardMaterial;
        mat.map = maps.clouds;
        mat.alphaMap = maps.clouds;
        mat.needsUpdate = true;
      } else {
        this.createClouds(radius, maps.clouds, 48);
      }
    }
    if (maps.atmosphere && this.atmosphere) {
      const mat = this.atmosphere.material as THREE.MeshStandardMaterial;
      if (mat.map !== undefined) {
        mat.map = maps.atmosphere;
        mat.needsUpdate = true;
      }
    }
    if (maps.rings) {
      if (this.rings && this.ringTex !== maps.rings) {
        if (this.ownsRing) this.ringTex?.dispose();
        this.ringTex = maps.rings;
        this.ownsRing = false;
        const mat = this.rings.material as THREE.MeshStandardMaterial;
        mat.map = maps.rings;
        mat.alphaMap = maps.rings;
        mat.emissiveMap = maps.rings;
        mat.needsUpdate = true;
        this.applyRingBrightness();
      }
    }
  }

  setSelected(isSelected: boolean): void {
    this.selectionRing.visible = isSelected;
    const mat = this.mesh.material as THREE.MeshStandardMaterial;
    mat.emissive = isSelected ? new THREE.Color(0x3a6a70) : new THREE.Color(0x000000);
    mat.emissiveIntensity = isSelected ? 0.55 : 0;
  }

  update(delta: number, isCircular: boolean, simSpeed = 1, spinFactor = 0.01): void {
    this.meanAnomaly += this.orbitSpeed * delta * 22;
    const ecc = isCircular ? 0 : this.originalEccentricity;
    const pos = OrbitMath.getPosition(this.semiMajor, ecc, this.meanAnomaly);
    this.group.position.x = pos.x;
    this.group.position.z = pos.z;
    this.mesh.rotation.y += this.spinSpeed * simSpeed * spinFactor * delta * 25;
    if (this.clouds) this.clouds.rotation.y += delta * 0.08;
    if (this.atmosphere && this.name === "Venus") this.atmosphere.rotation.y += delta * 0.03;
  }

  getWorldPosition(target = this._world): THREE.Vector3 {
    return this.group.getWorldPosition(target);
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.group.visible = visible;
    if (this.orbitPath) this.orbitPath.visible = visible;
  }

  resetAngle(): void {
    this.meanAnomaly = Math.random() * Math.PI * 2;
  }

  setOrbitPath(pathMesh: THREE.Object3D | null): void {
    this.orbitPath = pathMesh;
  }

  dispose(): void {
    this.group.parent?.remove(this.group);
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    if (this.ownsMap) this.map.dispose();
    this.selectionRing.geometry.dispose();
    (this.selectionRing.material as THREE.Material).dispose();
    if (this.atmosphere) {
      this.atmosphere.geometry.dispose();
      (this.atmosphere.material as THREE.Material).dispose();
    }
    if (this.clouds) {
      this.clouds.geometry.dispose();
      (this.clouds.material as THREE.Material).dispose();
    }
    if (this.rings) {
      this.rings.geometry.dispose();
      (this.rings.material as THREE.Material).dispose();
    }
    if (this.ownsRing) this.ringTex?.dispose();
  }
}
