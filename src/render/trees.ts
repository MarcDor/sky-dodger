import * as THREE from "three";
import { PAL } from "./palette";
import { sampleLand, uvToSphere, type StylePack } from "./styleMaps";
import { addOutline, toonMaterial } from "./toon";

const Y_UP = new THREE.Vector3(0, 1, 0);
const _n = new THREE.Vector3();
const _q = new THREE.Quaternion();

export function createTrees(pack: StylePack, ramp: THREE.DataTexture): THREE.Group {
  const group = new THREE.Group();
  const trunkMat = toonMaterial(0x7a4a22, ramp);
  const leafMat = toonMaterial(PAL.tree, ramp);
  const trunkGeo = new THREE.CylinderGeometry(0.005, 0.007, 0.022, 6);
  const leafGeo = new THREE.ConeGeometry(0.02, 0.038, 6);
  trunkGeo.translate(0, 0.01, 0);
  leafGeo.translate(0, 0.036, 0);

  const spots: { u: number; v: number }[] = [];
  for (let i = 0; i < 900 && spots.length < 70; i += 1) {
    const u = hash2(i, 3.1);
    const v = 0.22 + hash2(i, 7.7) * 0.52;
    if (sampleLand(pack, u, v) < 0.78) continue;
    spots.push({ u, v });
  }

  for (const s of spots) {
    const p = uvToSphere(s.u, s.v);
    _n.set(p.x, p.y, p.z);
    _q.setFromUnitVectors(Y_UP, _n);
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    addOutline(leaf, 0x12243a, 1.12);
    tree.add(trunk, leaf);
    tree.position.set(p.x, p.y, p.z).multiplyScalar(1.012);
    tree.quaternion.copy(_q);
    const sc = 0.85 + hash2(s.u * 99, s.v * 17) * 0.45;
    tree.scale.setScalar(sc);
    group.add(tree);
  }
  return group;
}

function hash2(a: number, b: number): number {
  const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
