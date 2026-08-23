import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DamageField } from "./sim/damageField";
import { createEarth } from "./render/earth";
import { Debris } from "./render/debris";
import { createSatellite, createStars, createSun } from "./render/props";
import { aimBeam, createLaser } from "./render/laser";

const SUN = new THREE.Vector3(-8, 3.2, 4.5);

export async function mountCinder(host: HTMLElement): Promise<void> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02040a);
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

  const loader = new THREE.TextureLoader();
  const [day, normal, spec, clouds] = await Promise.all([
    loader.loadAsync("/earth/earth_atmos_2048.jpg"),
    loader.loadAsync("/earth/earth_normal_2048.jpg"),
    loader.loadAsync("/earth/earth_specular_2048.jpg"),
    loader.loadAsync("/earth/earth_clouds_1024.png"),
  ]);
  day.colorSpace = THREE.SRGBColorSpace;
  clouds.colorSpace = THREE.SRGBColorSpace;
  for (const t of [day, normal, spec, clouds]) {
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    t.wrapS = THREE.RepeatWrapping;
  }
  normal.colorSpace = THREE.NoColorSpace;
  spec.colorSpace = THREE.NoColorSpace;

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

  const globe = createEarth({ day, normal, spec, clouds, damage: damageTex });
  const planet = new THREE.Group();
  planet.add(globe.earth, globe.clouds, globe.atmosphere);
  scene.add(planet);
  scene.add(createStars());
  scene.add(createSun());

  const ambient = new THREE.AmbientLight(0x1a2233, 0.35);
  const key = new THREE.DirectionalLight(0xfff2d8, 2.1);
  key.position.copy(SUN);
  scene.add(ambient, key);

  const sat = createSatellite();
  sat.position.set(1.55, 0.62, 1.85);
  scene.add(sat);

  const laser = createLaser();
  scene.add(laser.core, laser.glow, laser.impact, laser.light);

  const debris = new Debris();
  scene.add(debris.points);

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

  const crustFill = document.getElementById("crustFill");
  const crustVal = document.getElementById("crustVal");
  const heatFill = document.getElementById("heatFill");
  const heatVal = document.getElementById("heatVal");
  const stats = document.getElementById("stats");

  const clock = new THREE.Clock();
  const sunDir = SUN.clone().normalize();

  const tick = (): void => {
    const dt = Math.min(0.05, clock.getDelta());
    globe.uniforms.time.value = clock.elapsedTime;
    globe.uniforms.sunDir.value.copy(sunDir);

    planet.rotation.y += dt * 0.045;
    globe.clouds.rotation.y += dt * 0.02;

    satAim.copy(camera.position).multiplyScalar(0.12);
    sat.position.lerp(new THREE.Vector3(1.35, 0.48, 1.7).add(satAim), 0.08);
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
      aimBeam(laser.core, laser.glow, sat.position, hit.point);
      laser.impact.visible = true;
      laser.impact.position.copy(hit.point).add(hitNormal.clone().multiplyScalar(0.02));
      laser.light.position.copy(hit.point);
      laser.light.intensity = 2.4 + result.peakHeat * 4;
      const pulse = 0.04 + result.peakHeat * 0.05;
      laser.impact.scale.setScalar(0.7 + Math.sin(clock.elapsedTime * 24) * 0.25 + result.peakHeat);
      (laser.core.material as THREE.MeshBasicMaterial).opacity = 0.7 + pulse;
      if (result.addedDamage > 0.35) {
        debris.burst(hit.point, hitNormal, 12 + result.addedDamage * 8, result.peakHeat);
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
    if (crustFill) crustFill.style.width = `${(wound * 100).toFixed(1)}%`;
    if (crustVal) crustVal.textContent = `${(wound * 100).toFixed(1)}%`;
    if (heatFill) heatFill.style.width = `${Math.min(100, heat * 100).toFixed(1)}%`;
    if (heatVal) heatVal.textContent = `${Math.min(100, heat * 100).toFixed(0)}%`;
    if (stats) {
      stats.innerHTML = `Energie deponiert ${(field.totalEnergy * 4.2).toFixed(1)} MJ<br />Impulse ${field.craterEvents}`;
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
