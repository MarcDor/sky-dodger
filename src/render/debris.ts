import * as THREE from "three";

const MAX = 2200;

export class Debris {
  readonly points: THREE.Points;
  private readonly pos: Float32Array;
  private readonly vel: Float32Array;
  private readonly life: Float32Array;
  private readonly col: Float32Array;
  private cursor = 0;

  constructor() {
    this.pos = new Float32Array(MAX * 3);
    this.vel = new Float32Array(MAX * 3);
    this.life = new Float32Array(MAX);
    this.col = new Float32Array(MAX * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(this.col, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.018,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
  }

  burst(origin: THREE.Vector3, normal: THREE.Vector3, count: number, hot: number): void {
    const n = Math.min(80, Math.max(8, Math.floor(count)));
    for (let i = 0; i < n; i += 1) {
      const k = this.cursor;
      this.cursor = (this.cursor + 1) % MAX;
      const spread = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      )
        .normalize()
        .multiplyScalar(0.45)
        .add(normal.clone().multiplyScalar(0.8 + Math.random() * 0.6))
        .normalize();
      const speed = 0.35 + Math.random() * 1.4 + hot * 0.8;
      this.pos[k * 3] = origin.x;
      this.pos[k * 3 + 1] = origin.y;
      this.pos[k * 3 + 2] = origin.z;
      this.vel[k * 3] = spread.x * speed;
      this.vel[k * 3 + 1] = spread.y * speed;
      this.vel[k * 3 + 2] = spread.z * speed;
      this.life[k] = 0.5 + Math.random() * 0.9;
      const lava = Math.random() < 0.65;
      this.col[k * 3] = lava ? 1 : 0.35;
      this.col[k * 3 + 1] = lava ? 0.35 + Math.random() * 0.4 : 0.22;
      this.col[k * 3 + 2] = lava ? 0.05 : 0.12;
    }
    (this.points.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    (this.points.geometry.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;
  }

  update(dt: number): void {
    for (let i = 0; i < MAX; i += 1) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      this.vel[i * 3] *= 0.985;
      this.vel[i * 3 + 1] *= 0.985;
      this.vel[i * 3 + 2] *= 0.985;
      if (this.life[i] <= 0) {
        this.pos[i * 3] = 0;
        this.pos[i * 3 + 1] = 0;
        this.pos[i * 3 + 2] = 0;
      }
    }
    (this.points.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
  }
}
