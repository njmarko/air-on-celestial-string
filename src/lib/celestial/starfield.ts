import * as THREE from "three";

export class Starfield {
  layers: THREE.Points[] = [];
  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.PointsMaterial[] = [];

  constructor(scene: THREE.Scene) {
    this.createLayer(scene, 2200, 1.1, 0.7, 2800, 3600);
    this.createLayer(scene, 3000, 0.7, 0.45, 3600, 4300);
    this.createLayer(scene, 4000, 0.4, 0.28, 4300, 4900);
  }

  private createLayer(
    scene: THREE.Scene,
    count: number,
    size: number,
    opacity: number,
    minRadius: number,
    maxRadius: number,
  ): void {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = minRadius + Math.random() * (maxRadius - minRadius);
      const i3 = i * 3;
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      const warmth = Math.random();
      const b = 0.72 + Math.random() * 0.28;
      colors[i3] = b;
      colors[i3 + 1] = b * (0.94 + warmth * 0.06);
      colors[i3 + 2] = b * (0.9 + (1 - warmth) * 0.1);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    points.renderOrder = -1;
    points.frustumCulled = false;
    scene.add(points);
    this.layers.push(points);
    this.geometries.push(geometry);
    this.materials.push(material);
  }

  update(cameraPos: THREE.Vector3, delta = 0): void {
    this.layers.forEach((layer, i) => {
      const factor = 0.00055 * (i + 1);
      layer.position.x = -cameraPos.x * factor;
      layer.position.z = -cameraPos.z * factor;
      layer.rotation.y += delta * 0.003 * (i + 1);
    });
  }

  setVisible(visible: boolean): void {
    for (const layer of this.layers) layer.visible = visible;
  }

  dispose(): void {
    for (const layer of this.layers) layer.parent?.remove(layer);
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
    this.layers = [];
  }
}
