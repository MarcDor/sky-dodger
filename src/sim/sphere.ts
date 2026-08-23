/** Ray-sphere and equirect UV helpers. Independent of Three.js. */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function length(a: Vec3): number {
  return Math.hypot(a.x, a.y, a.z);
}

export function normalize(a: Vec3): Vec3 {
  const l = length(a) || 1;
  return { x: a.x / l, y: a.y / l, z: a.z / l };
}

export function sub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function scale(a: Vec3, s: number): Vec3 {
  return { x: a.x * s, y: a.y * s, z: a.z * s };
}

/** Smallest t >= 0 along ray origin+t*dir hitting a sphere, or null. dir must be unit. */
export function raySphere(
  origin: Vec3,
  dir: Vec3,
  center: Vec3,
  radius: number,
): number | null {
  const oc = sub(origin, center);
  const b = dot(oc, dir);
  const c = dot(oc, oc) - radius * radius;
  const disc = b * b - c;
  if (disc < 0) return null;
  const s = Math.sqrt(disc);
  const t0 = -b - s;
  const t1 = -b + s;
  if (t0 > 1e-4) return t0;
  if (t1 > 1e-4) return t1;
  return null;
}

/**
 * UV matching THREE.SphereGeometry: north pole v=1, u from atan2(z, -x).
 * Used only in tests; the live app prefers intersection.uv from Three.
 */
export function sphereUv(normal: Vec3): { u: number; v: number } {
  const n = normalize(normal);
  let phi = Math.atan2(n.z, -n.x);
  if (phi < 0) phi += Math.PI * 2;
  const u = phi / (Math.PI * 2);
  const v = 1 - Math.acos(Math.min(1, Math.max(-1, n.y))) / Math.PI;
  return { u, v };
}
