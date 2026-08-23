import * as THREE from "three";
import { ATMO_FRAG, ATMO_VERT, CLOUD_FRAG, CLOUD_VERT, EARTH_FRAG, EARTH_VERT } from "./shaders";
import type { StylePack } from "./styleMaps";

export interface EarthBundle {
  earth: THREE.Mesh;
  clouds: THREE.Mesh;
  atmosphere: THREE.Mesh;
  outline: THREE.Mesh;
  uniforms: {
    sunDir: THREE.IUniform<THREE.Vector3>;
    time: THREE.IUniform<number>;
    damage: THREE.IUniform<THREE.Texture>;
  };
}

export function createEarth(pack: StylePack, damage: THREE.DataTexture): EarthBundle {
  const sunDir = { value: new THREE.Vector3(-0.65, 0.28, 0.7).normalize() };
  const time = { value: 0 };
  const dmg = { value: damage };

  const earthMat = new THREE.ShaderMaterial({
    uniforms: {
      uAlbedo: { value: pack.albedo },
      uStyle: { value: pack.style },
      uDamage: dmg,
      uSunDir: sunDir,
      uTime: time,
      uDisplace: { value: 0.08 },
    },
    vertexShader: EARTH_VERT,
    fragmentShader: EARTH_FRAG,
  });

  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), earthMat);

  const outline = new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 64),
    new THREE.MeshBasicMaterial({ color: 0x12243a, side: THREE.BackSide }),
  );
  outline.scale.setScalar(1.028);

  const cloudMat = new THREE.ShaderMaterial({
    uniforms: {
      uClouds: { value: pack.clouds },
      uDamage: dmg,
      uSunDir: sunDir,
    },
    vertexShader: CLOUD_VERT,
    fragmentShader: CLOUD_FRAG,
    transparent: true,
    depthWrite: false,
  });
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.03, 80, 56), cloudMat);

  const atmoMat = new THREE.ShaderMaterial({
    uniforms: {
      uSunDir: sunDir,
      uIntensity: { value: 1.05 },
    },
    vertexShader: ATMO_VERT,
    fragmentShader: ATMO_FRAG,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.12, 64, 48), atmoMat);

  return { earth, clouds, atmosphere, outline, uniforms: { sunDir, time, damage: dmg } };
}
