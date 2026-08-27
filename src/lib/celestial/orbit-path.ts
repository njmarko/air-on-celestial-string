import * as THREE from "three";
import { OrbitMath } from "./orbit-math";

export class OrbitPath {
  mesh: THREE.Line;
  private geometry: THREE.BufferGeometry;
  private material: THREE.LineBasicMaterial;

  constructor(host: THREE.Object3D, semiMajor: number, eccentricity = 0, color = 0x44aaff) {
    const points: THREE.Vector3[] = [];
    const segments = 256;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const pos = OrbitMath.getPosition(semiMajor, eccentricity, theta);
      points.push(new THREE.Vector3(pos.x, 0, pos.z));
    }

    this.geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.mesh = new THREE.Line(this.geometry, this.material);
    host.add(this.mesh);
  }

  setColor(color: THREE.ColorRepresentation): void {
    this.material.color.set(color);
  }

  dispose(): void {
    this.mesh.parent?.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
  }
}
