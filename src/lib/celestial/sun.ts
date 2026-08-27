import * as THREE from "three";
import type { CelestialBody } from "./types";
import { createGlowTexture, createSunTexture } from "./textures";

export class Sun implements CelestialBody {
  name = "Sun";
  mesh: THREE.Mesh;
  group: THREE.Group;
  visible = true;
  semiMajor = 0;
  originalEccentricity = 0;
  eccentricity = 0;
  orbitPath: THREE.Object3D | null = null;
  parentBody: CelestialBody | null = null;

  private light: THREE.PointLight;
  private corona: THREE.Sprite;
  private glowTex: THREE.Texture;
  private map: THREE.Texture;
  private ownsMap: boolean;
  private readonly _world = new THREE.Vector3();
  private pulse = 1;

  constructor(scene: THREE.Scene, map?: THREE.Texture) {
    this.group = new THREE.Group();
    this.group.name = "Sun";

    this.ownsMap = !map;
    this.map = map ?? createSunTexture();
    const geometry = new THREE.SphereGeometry(38, 64, 48);
    const material = new THREE.MeshBasicMaterial({ map: this.map });
    this.mesh = new THREE.Mesh(geometry, material);
    this.group.add(this.mesh);

    this.light = new THREE.PointLight(0xfff1d0, 4.8, 0, 1.6);
    this.light.castShadow = true;
    this.light.shadow.mapSize.set(1024, 1024);
    this.light.shadow.camera.near = 40;
    this.light.shadow.camera.far = 1400;
    this.light.shadow.bias = -0.0002;
    this.group.add(this.light);

    this.glowTex = createGlowTexture();
    const spriteMat = new THREE.SpriteMaterial({
      map: this.glowTex,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.9,
    });
    this.corona = new THREE.Sprite(spriteMat);
    this.corona.scale.set(220, 220, 1);
    this.group.add(this.corona);

    scene.add(this.group);
  }

  setMap(map?: THREE.Texture): void {
    if (!map || map === this.map) return;
    if (this.ownsMap) this.map.dispose();
    this.map = map;
    this.ownsMap = false;
    const material = this.mesh.material as THREE.MeshBasicMaterial;
    material.map = map;
    material.needsUpdate = true;
  }

  setPulse(amount: number): void {
    this.pulse = THREE.MathUtils.lerp(this.pulse, 1 + amount * 0.18, 0.2);
    this.corona.scale.setScalar(220 * this.pulse);
    this.light.intensity = 4.8 + amount * 2.4;
  }

  update(delta: number): void {
    this.mesh.rotation.y += delta * 0.045;
  }

  setSelected(selected: boolean): void {
    this.corona.material.opacity = selected ? 1 : 0.9;
    this.corona.scale.setScalar(selected ? 248 : 220 * this.pulse);
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.group.visible = visible;
  }

  getWorldPosition(target = this._world): THREE.Vector3 {
    return this.group.getWorldPosition(target);
  }

  resetAngle(): void {}

  setOrbitPath(pathMesh: THREE.Object3D | null): void {
    this.orbitPath = pathMesh;
  }

  dispose(): void {
    this.group.parent?.remove(this.group);
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    if (this.ownsMap) this.map.dispose();
    this.glowTex.dispose();
    (this.corona.material as THREE.Material).dispose();
  }
}
