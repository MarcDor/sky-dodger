import * as THREE from "three";

export function createSatellite(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xb8c0cc,
    metalness: 0.85,
    roughness: 0.28,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xc4a46a,
    metalness: 0.9,
    roughness: 0.22,
    emissive: 0x221408,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.18), bodyMat);
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16), gold);
  dish.rotation.x = Math.PI / 2;
  dish.position.z = -0.11;
  const panelL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.004, 0.1), gold);
  const panelR = panelL.clone();
  panelL.position.x = -0.22;
  panelR.position.x = 0.22;
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.16, 10), bodyMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = -0.2;
  g.add(body, dish, panelL, panelR, barrel);
  g.traverse((obj) => {
    if (obj instanceof THREE.Mesh) obj.castShadow = false;
  });
  return g;
}

export function createStars(): THREE.Points {
  const n = 3500;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i += 1) {
    const r = 18 + Math.random() * 24;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(p) * Math.cos(t);
    pos[i * 3 + 1] = r * Math.cos(p);
    pos[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: 0xcdd8ff,
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    }),
  );
}

export function createSun(): THREE.Mesh {
  const mat = new THREE.MeshBasicMaterial({ color: 0xfff1c8 });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 16), mat);
  mesh.position.set(-8, 3.2, 4.5);
  return mesh;
}
