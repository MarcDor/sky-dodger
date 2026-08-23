import * as THREE from "three";

export function createLaser(): {
  core: THREE.Mesh;
  glow: THREE.Mesh;
  impact: THREE.Mesh;
  light: THREE.PointLight;
} {
  const coreGeo = new THREE.CylinderGeometry(0.006, 0.006, 1, 12, 1, true);
  const glowGeo = new THREE.CylinderGeometry(0.024, 0.016, 1, 14, 1, true);
  coreGeo.translate(0, 0.5, 0);
  glowGeo.translate(0, 0.5, 0);

  const core = new THREE.Mesh(
    coreGeo,
    new THREE.MeshBasicMaterial({
      color: 0xfff6d8,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const glow = new THREE.Mesh(
    glowGeo,
    new THREE.MeshBasicMaterial({
      color: 0xff4e18,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  core.visible = false;
  glow.visible = false;

  const impact = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 12),
    new THREE.MeshBasicMaterial({
      color: 0xffc878,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  impact.visible = false;

  const light = new THREE.PointLight(0xff7a30, 0, 1.8, 2);
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
