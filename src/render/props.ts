import * as THREE from "three";
import { PAL } from "./palette";
import { addOutline, toonMaterial } from "./toon";

export function createUfo(ramp: THREE.DataTexture): THREE.Group {
  const g = new THREE.Group();
  const teal = toonMaterial(PAL.teal, ramp);
  const tealLite = toonMaterial(PAL.tealLite, ramp);
  const gold = toonMaterial(PAL.gold, ramp, { emissive: new THREE.Color(0x3a2808) });

  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.032, 28), teal);
  addOutline(disc, 0x12243a, 1.06);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.014, 10, 28), gold);
  rim.rotation.x = Math.PI / 2;
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.068, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), gold);
  dome.position.y = 0.012;
  addOutline(dome, 0x12243a, 1.07);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 10, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5), tealLite);
  belly.position.y = -0.006;
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.014, 0.07, 10), gold);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, -0.012, -0.16);

  g.add(disc, rim, dome, belly, barrel);
  for (let i = 0; i < 10; i += 1) {
    const a = (i / 10) * Math.PI * 2;
    const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 6), gold);
    rivet.position.set(Math.cos(a) * 0.138, 0.01, Math.sin(a) * 0.138);
    g.add(rivet);
  }
  return g;
}

export function createStars(): THREE.Group {
  const group = new THREE.Group();
  const n = 220;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i += 1) {
    const r = 16 + Math.random() * 18;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(p) * Math.cos(t);
    pos[i * 3 + 1] = r * Math.cos(p);
    pos[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  group.add(
    new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xd6e7ff,
        size: 0.07,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    ),
  );

  const sparkleTex = makeSparkleTexture();
  const sparkleMat = new THREE.SpriteMaterial({
    map: sparkleTex,
    color: 0xfff7d2,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  for (let i = 0; i < 14; i += 1) {
    const spr = new THREE.Sprite(sparkleMat);
    const r = 10 + Math.random() * 8;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    spr.position.set(r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t));
    spr.scale.setScalar(0.28 + Math.random() * 0.22);
    group.add(spr);
  }
  return group;
}

export function createSun(): THREE.Group {
  const g = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0xfff1b0 }),
  );
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 24, 16),
    new THREE.MeshBasicMaterial({
      color: 0xffc85a,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    }),
  );
  g.add(core, halo);
  g.position.set(-8, 3.2, 4.5);
  return g;
}

function makeSparkleTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2d canvas fehlt");
  ctx.clearRect(0, 0, 64, 64);
  ctx.translate(32, 32);
  ctx.fillStyle = "#fff8dc";
  for (let i = 0; i < 2; i += 1) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(3, 0);
    ctx.lineTo(0, 28);
    ctx.lineTo(-3, 0);
    ctx.closePath();
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
