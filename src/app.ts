import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DamageField } from "./sim/damageField";
import { createEarth } from "./render/earth";
import { Debris } from "./render/debris";
import { createStars, createSun, createUfo } from "./render/props";
import { aimBeam, createLaser } from "./render/laser";
import { buildStylePack } from "./render/styleMaps";
import { createToonRamp } from "./render/toon";
import { PAL } from "./render/palette";

const SUN = new THREE.Vector3(-8, 3.2, 4.5);

export function mountCinder(host: HTMLElement): void {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAL.space);
  const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, 0.05, 80);
  camera.position.set(0.35, 0.55, 2.85);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 1.45;
  controls.maxDistance = 7;
  controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
  controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
  controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
  controls.target.set(0, 0, 0);

  const pack = buildStylePack();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  pack.albedo.anisotropy = maxAniso;

  const field = new DamageField();
  const damageTex = new THREE.DataTexture(
    field.pixels as unknown as ArrayBuffer,
    field.width,
    field.height,
    THREE.RGBAFormat,
  );
  damageTex.magFilter = THREE.LinearFilter;
  damageTex.minFilter = THREE.LinearFilter;
  damageTex.wrapS = THREE.RepeatWrapping;
  damageTex.wrapT = THREE.ClampToEdgeWrapping;
  damageTex.needsUpdate = true;
  damageTex.colorSpace = THREE.NoColorSpace;

  const globe = createEarth(pack, damageTex);
  const planet = new THREE.Group();
  const ramp = createToonRamp();
  planet.add(globe.outline, globe.earth, globe.atmosphere);
  scene.add(planet);
  scene.add(createStars());
  scene.add(createSun());

  scene.add(new THREE.HemisphereLight(0x8fd4ee, 0x243050, 0.85));
  const key = new THREE.DirectionalLight(0xfff2d0, 2.4);
  key.position.copy(SUN);
  scene.add(key);

  const sat = createUfo(ramp);
  sat.scale.setScalar(2.15);
  sat.position.set(1.05, 0.22, 1.45);
  scene.add(sat);

  const laser = createLaser();
  scene.add(laser.core, laser.glow, laser.impact, laser.light);

  const debris = new Debris(ramp);
  scene.add(debris.mesh);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const satAim = new THREE.Vector3();
  let firing = false;
  let audio: LaserAudio | null = null;

  renderer.domElement.addEventListener("pointermove", (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  });
  renderer.domElement.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    firing = true;
    audio ??= createAudio();
    audio.start();
  });
  window.addEventListener("pointerup", () => {
    firing = false;
    audio?.stop();
  });

  const crustVal = document.getElementById("crustVal");
  const heatVal = document.getElementById("heatVal");
  const goldVal = document.getElementById("goldVal");
  const stats = document.getElementById("stats");
  const woundDial = document.getElementById("woundDial");
  const heatDial = document.getElementById("heatDial");

  const clock = new THREE.Clock();
  const sunDir = SUN.clone().normalize();

  const tick = (): void => {
    const dt = Math.min(0.05, clock.getDelta());
    globe.uniforms.time.value = clock.elapsedTime;
    globe.uniforms.sunDir.value.copy(sunDir);

    planet.rotation.y += dt * 0.045;

    satAim.copy(camera.position).multiplyScalar(0.1);
    sat.position.lerp(new THREE.Vector3(1.02, 0.18, 1.38).add(satAim), 0.08);
    sat.lookAt(0, 0, 0);

    field.cool(dt);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(globe.earth, false);
    const hit = hits[0];
    const hitNormal = hit?.normal;

    if (firing && hit?.uv && hitNormal) {
      const energy = 52 * dt;
      const result = field.splat(hit.uv.x, hit.uv.y, energy);
      damageTex.needsUpdate = true;
      const muzzle = new THREE.Vector3(0, -0.02, -0.18).applyQuaternion(sat.quaternion).add(sat.position);
      aimBeam(laser.core, laser.glow, muzzle, hit.point);
      laser.impact.visible = true;
      laser.impact.position.copy(hit.point).add(hitNormal.clone().multiplyScalar(0.03));
      laser.light.position.copy(hit.point);
      laser.light.intensity = 2.4 + result.peakHeat * 4;
      laser.impact.scale.setScalar(0.8 + Math.sin(clock.elapsedTime * 24) * 0.22 + result.peakHeat);
      (laser.core.material as THREE.MeshBasicMaterial).opacity = 0.75 + result.peakHeat * 0.2;
      if (result.addedDamage > 0.35) {
        debris.burst(hit.point, hitNormal, 10 + result.addedDamage * 6, result.peakHeat);
      }
    } else {
      laser.core.visible = false;
      laser.glow.visible = false;
      laser.impact.visible = false;
      laser.light.intensity = 0;
    }

    debris.update(dt);
    controls.update();

    const aim = hit?.uv ? field.sample(hit.uv.x, hit.uv.y) : { damage: 0, heat: 0, crack: 0 };
    const wound = aim.damage;
    const heat = aim.heat;
    if (crustVal) crustVal.textContent = `${(wound * 100).toFixed(0)}%`;
    if (heatVal) heatVal.textContent = `${Math.min(100, heat * 100).toFixed(0)}%`;
    if (goldVal) goldVal.textContent = Math.floor(field.totalEnergy * 18).toLocaleString("de-DE");
    setDial(woundDial, wound);
    setDial(heatDial, Math.min(1, heat));
    if (stats) {
      stats.innerHTML = `Energie ${(field.totalEnergy * 4.2).toFixed(1)} MJ<br />Impulse ${field.craterEvents}`;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();

  window.addEventListener("resize", () => {
    camera.aspect = host.clientWidth / Math.max(1, host.clientHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(host.clientWidth, host.clientHeight);
  });
}

function setDial(el: HTMLElement | null, t: number): void {
  if (!el) return;
  const p = Math.round(Math.min(1, Math.max(0, t)) * 100);
  el.style.setProperty("--p", `${p}%`);
}

interface LaserAudio {
  start: () => void;
  stop: () => void;
}

function createAudio(): LaserAudio {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = "sawtooth";
  osc.frequency.value = 92;
  filter.type = "lowpass";
  filter.frequency.value = 720;
  gain.gain.value = 0;
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  return {
    start: () => {
      void ctx.resume();
      gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.05);
    },
    stop: () => {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
    },
  };
}
