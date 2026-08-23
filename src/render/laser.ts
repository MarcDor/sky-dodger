import * as THREE from "three";
import { PAL } from "./palette";

export function createLaser(): {
  core: THREE.Mesh;
  glow: THREE.Mesh;
  impact: THREE.Mesh;
  light: THREE.PointLight;
} {
  const coreGeo = new THREE.CylinderGeometry(0.012, 0.02, 1, 14, 1, true);
  const glowGeo = new THREE.CylinderGeometry(0.038, 0.07, 1, 16, 1, true);
  coreGeo.translate(0, 0.5, 0);
  glowGeo.translate(0, 0.5, 0);

  const core = new THREE.Mesh(
    coreGeo,
    new THREE.MeshBasicMaterial({
      color: PAL.laserHot,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    }),
  );
  const glow = new THREE.Mesh(
    glowGeo,
    new THREE.MeshBasicMaterial({
      color: PAL.laser,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    }),
  );
  core.visible = false;
  glow.visible = false;

  const impact = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 12),
    new THREE.MeshBasicMaterial({
      color: 0xffc070,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    }),
  );
  impact.visible = false;

  const light = new THREE.PointLight(PAL.laser, 0, 2.2, 2);
  return { core, glow, impact, light };
}

const Y_UP = new THREE.Vector3(0, 1, 0);
const _dir = new THREE.Vector3();
const _quat = new THREE.Quaternion();

export function aimBeam(
  core: THREE.Mesh,
  glow: THREE.Mesh,
  from: THREE.Vector3,
  to: THREE.Vector3,
): void {
  _dir.subVectors(to, from);
  const dist = _dir.length();
  if (dist < 1e-4) return;
  _dir.multiplyScalar(1 / dist);
  _quat.setFromUnitVectors(Y_UP, _dir);
  for (const mesh of [core, glow]) {
    mesh.position.copy(from);
    mesh.quaternion.copy(_quat);
    mesh.scale.set(1, dist, 1);
    mesh.visible = true;
  }
}
