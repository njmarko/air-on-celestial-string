import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { OrbitMath } from "./orbit-math";

export class OrbitPath {
  mesh: Line2;
  private geometry: LineGeometry;
  private material: LineMaterial;

  constructor(host: THREE.Object3D, semiMajor: number, eccentricity = 0, color = 0x44aaff, width = 1.5) {
    const points: THREE.Vector3[] = [];
    const segments = 256;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const pos = OrbitMath.getPosition(semiMajor, eccentricity, theta);
      points.push(new THREE.Vector3(pos.x, 0, pos.z));
    }

    this.geometry = new LineGeometry();
    this.geometry.setFromPoints(points);
    this.material = new LineMaterial({
      color,
      linewidth: width,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    this.mesh = new Line2(this.geometry, this.material);
    host.add(this.mesh);
  }

  setColor(color: THREE.ColorRepresentation): void {
    this.material.color.set(color);
  }

  setWidth(width: number): void {
    this.material.linewidth = Math.max(0.25, width);
  }

  dispose(): void {
    this.mesh.parent?.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
  }
}
