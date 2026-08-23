import * as THREE from "three";
import { PAL } from "./palette";
import { toonMaterial } from "./toon";

const MAX = 280;

export class Debris {
  readonly mesh: THREE.InstancedMesh;
  private readonly dummy = new THREE.Object3D();
  private readonly pos = new Float32Array(MAX * 3);
  private readonly vel = new Float32Array(MAX * 3);
  private readonly life = new Float32Array(MAX);
  private readonly spin = new Float32Array(MAX * 3);
  private readonly scale = new Float32Array(MAX);
  private readonly rot = new Float32Array(MAX * 3);
  private cursor = 0;

  constructor(ramp: THREE.DataTexture) {
    const geo = new THREE.BoxGeometry(0.028, 0.02, 0.016);
    const mat = toonMaterial(PAL.craterTan, ramp);
    this.mesh = new THREE.InstancedMesh(geo, mat, MAX);
    this.mesh.frustumCulled = false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.dummy.scale.setScalar(0);
    this.dummy.updateMatrix();
    const hide = this.dummy.matrix.clone();
    const tan = new THREE.Color(PAL.craterTan);
    for (let i = 0; i < MAX; i += 1) {
      this.mesh.setMatrixAt(i, hide);
      this.mesh.setColorAt(i, tan);
    }
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  burst(origin: THREE.Vector3, normal: THREE.Vector3, count: number, hot: number): void {
    const n = Math.min(28, Math.max(6, Math.floor(count * 0.45)));
    const tan = new THREE.Color(PAL.craterTan);
    const lava = new THREE.Color(PAL.craterCore);
    for (let i = 0; i < n; i += 1) {
      const k = this.cursor;
      this.cursor = (this.cursor + 1) % MAX;
      const spread = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(0.4)
        .add(normal.clone().multiplyScalar(0.85 + Math.random() * 0.5))
        .normalize();
      const speed = 0.28 + Math.random() * 0.9 + hot * 0.5;
      this.pos[k * 3] = origin.x;
      this.pos[k * 3 + 1] = origin.y;
      this.pos[k * 3 + 2] = origin.z;
      this.vel[k * 3] = spread.x * speed;
      this.vel[k * 3 + 1] = spread.y * speed;
      this.vel[k * 3 + 2] = spread.z * speed;
      this.life[k] = 0.55 + Math.random() * 0.7;
      this.spin[k * 3] = (Math.random() - 0.5) * 8;
      this.spin[k * 3 + 1] = (Math.random() - 0.5) * 8;
      this.spin[k * 3 + 2] = (Math.random() - 0.5) * 8;
      this.scale[k] = 0.7 + Math.random() * 1.1;
      this.rot[k * 3] = Math.random() * 6;
      this.rot[k * 3 + 1] = Math.random() * 6;
      this.rot[k * 3 + 2] = Math.random() * 6;
      this.write(k);
      this.mesh.setColorAt(k, Math.random() < 0.55 + hot * 0.3 ? lava : tan);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  update(dt: number): void {
    let dirty = false;
    for (let i = 0; i < MAX; i += 1) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      this.rot[i * 3] += this.spin[i * 3] * dt;
      this.rot[i * 3 + 1] += this.spin[i * 3 + 1] * dt;
      this.rot[i * 3 + 2] += this.spin[i * 3 + 2] * dt;
      this.vel[i * 3] *= 0.985;
      this.vel[i * 3 + 1] *= 0.985;
      this.vel[i * 3 + 2] *= 0.985;
      if (this.life[i] <= 0) this.scale[i] = 0;
      this.write(i);
      dirty = true;
    }
    if (dirty) this.mesh.instanceMatrix.needsUpdate = true;
  }

  private write(i: number): void {
    this.dummy.position.set(this.pos[i * 3], this.pos[i * 3 + 1], this.pos[i * 3 + 2]);
    this.dummy.rotation.set(this.rot[i * 3], this.rot[i * 3 + 1], this.rot[i * 3 + 2]);
    this.dummy.scale.setScalar(this.scale[i]);
    this.dummy.updateMatrix();
    this.mesh.setMatrixAt(i, this.dummy.matrix);
  }
}
