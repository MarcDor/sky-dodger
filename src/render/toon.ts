import * as THREE from "three";

/** 4-step ramp. Nearest filter keeps the bands graphic, not muddy. */
export function createToonRamp(): THREE.DataTexture {
  const steps = [
    [36, 52, 78, 255],
    [36, 52, 78, 255],
    [58, 96, 112, 255],
    [58, 96, 112, 255],
    [118, 168, 168, 255],
    [118, 168, 168, 255],
    [236, 238, 220, 255],
    [236, 238, 220, 255],
  ];
  const data = new Uint8Array(steps.flat());
  const tex = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

export function toonMaterial(
  color: number,
  ramp: THREE.DataTexture,
  extras: THREE.MeshToonMaterialParameters = {},
): THREE.MeshToonMaterial {
  return new THREE.MeshToonMaterial({
    color,
    gradientMap: ramp,
    ...extras,
  });
}

/** Inverted-hull outline. Scale is a uniform inflate. */
export function addOutline(
  mesh: THREE.Mesh,
  color = 0x12243a,
  inflate = 1.08,
): THREE.Mesh {
  const outline = new THREE.Mesh(
    mesh.geometry,
    new THREE.MeshBasicMaterial({ color, side: THREE.BackSide }),
  );
  outline.scale.setScalar(inflate);
  mesh.add(outline);
  return outline;
}
