export interface Ufo {
  id: number;
  angle: number;
  omega: number;
  orbitMul: number;
  wobble: number;
  wobbleSpeed: number;
  cooldown: number;
  period: number;
}

export interface Crater {
  x: number;
  y: number;
  r: number;
  heat: number;
}

export interface Shot {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  life: number;
}

export interface Boom {
  x: number;
  y: number;
  age: number;
  life: number;
  size: number;
}

export interface Chip {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  rot: number;
  spin: number;
}

export interface Game {
  gold: number;
  time: number;
  nextId: number;
  shake: number;
  ufos: Ufo[];
  craters: Crater[];
  shots: Shot[];
  booms: Boom[];
  chips: Chip[];
  shotsFired: number;
}

export interface View {
  cx: number;
  cy: number;
  r: number;
}

const MAX_CRATERS = 36;
const INCOME_PER_UFO = 3.2;

export function ufoCost(owned: number): number {
  return 15 + owned * 15;
}

export function createGame(): Game {
  return {
    gold: 40,
    time: 0,
    nextId: 2,
    shake: 0,
    ufos: [makeUfo(1)],
    craters: [],
    shots: [],
    booms: [],
    chips: [],
    shotsFired: 0,
  };
}

/** Deterministic per id — each ship gets its own radius, spin and rhythm. */
export function makeUfo(id: number): Ufo {
  const r = (k: number): number => {
    const n = Math.sin(id * 97.13 + k * 19.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const dir = r(3) < 0.5 ? -1 : 1;
  return {
    id,
    angle: r(1) * Math.PI * 2,
    omega: dir * (0.22 + r(2) * 0.62),
    orbitMul: 1.32 + r(4) * 0.72,
    wobble: 0.025 + r(5) * 0.055,
    wobbleSpeed: 1.05 + r(6) * 1.6,
    cooldown: 0.15 + r(7) * 0.55,
    period: 0.72 + r(8) * 0.5,
  };
}

export function buyUfo(game: Game): boolean {
  const cost = ufoCost(game.ufos.length);
  if (game.gold < cost) return false;
  game.gold -= cost;
  game.ufos.push(makeUfo(game.nextId));
  game.nextId += 1;
  return true;
}

export function incomePerSecond(game: Game): number {
  return game.ufos.length * INCOME_PER_UFO;
}

export function wound(game: Game, planetR: number): number {
  if (planetR <= 0) return 0;
  const area = Math.PI * planetR * planetR;
  let covered = 0;
  for (const c of game.craters) covered += Math.PI * c.r * c.r * 0.55;
  return Math.min(1, covered / (area * 0.62));
}

export function ufoPos(ufo: Ufo, view: View, time: number): { x: number; y: number } {
  const orbit = view.r * (ufo.orbitMul + Math.sin(time * ufo.wobbleSpeed + ufo.id) * ufo.wobble);
  return {
    x: view.cx + Math.cos(ufo.angle) * orbit,
    y: view.cy + Math.sin(ufo.angle) * orbit,
  };
}

export function step(game: Game, dt: number, view: View): void {
  const t = Math.min(0.05, dt);
  game.time += t;
  game.gold += incomePerSecond(game) * t;
  game.shake = Math.max(0, game.shake - t * 4.2);

  for (const ufo of game.ufos) {
    ufo.angle += ufo.omega * t;
    ufo.cooldown -= t;
    if (ufo.cooldown > 0) continue;
    ufo.cooldown = ufo.period;
    fire(game, view, ufo);
  }

  for (const c of game.craters) c.heat = Math.max(0, c.heat - t * 1.4);

  for (const s of game.shots) s.life -= t;
  game.shots = game.shots.filter((s) => s.life > 0);

  for (const b of game.booms) b.age += t;
  game.booms = game.booms.filter((b) => b.age < b.life);

  for (const chip of game.chips) {
    chip.life -= t;
    chip.x += chip.vx * t;
    chip.y += chip.vy * t;
    chip.vy += 90 * t;
    chip.rot += chip.spin * t;
    chip.vx *= 0.99;
  }
  game.chips = game.chips.filter((c) => c.life > 0);
}

function fire(game: Game, view: View, ufo: Ufo): void {
  const from = ufoPos(ufo, view, game.time);
  const a = Math.random() * Math.PI * 2;
  const rad = view.r * Math.sqrt(Math.random()) * 0.78;
  const x = Math.cos(a) * rad;
  const y = Math.sin(a) * rad;
  const hitX = view.cx + x;
  const hitY = view.cy + y;
  const size = 18 + Math.random() * 12;

  game.shots.push({ x0: from.x, y0: from.y, x1: hitX, y1: hitY, life: 0.16 });
  stampCrater(game, x, y, size);
  game.booms.push({ x: hitX, y: hitY, age: 0, life: 0.42, size });
  spawnChips(game, hitX, hitY, x, y);
  game.shake = Math.min(1, game.shake + 0.62);
  game.shotsFired += 1;
  game.gold += 0.4;
}

function stampCrater(game: Game, x: number, y: number, size: number): void {
  for (const c of game.craters) {
    const d = Math.hypot(c.x - x, c.y - y);
    if (d < c.r + size * 0.45) {
      c.r = Math.min(52, c.r + size * 0.22);
      c.heat = 1;
      c.x = (c.x * c.r + x * size) / (c.r + size);
      c.y = (c.y * c.r + y * size) / (c.r + size);
      return;
    }
  }
  game.craters.push({ x, y, r: size * 0.55, heat: 1 });
  if (game.craters.length > MAX_CRATERS) game.craters.splice(0, game.craters.length - MAX_CRATERS);
}

function spawnChips(game: Game, x: number, y: number, lx: number, ly: number): void {
  const n = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < n; i += 1) {
    const a = Math.atan2(ly, lx) + (Math.random() - 0.5) * 1.6;
    const spd = 80 + Math.random() * 140;
    game.chips.push({
      x,
      y,
      vx: Math.cos(a) * spd,
      vy: Math.sin(a) * spd - 40,
      life: 0.35 + Math.random() * 0.25,
      rot: Math.random() * 6,
      spin: (Math.random() - 0.5) * 14,
    });
  }
}
