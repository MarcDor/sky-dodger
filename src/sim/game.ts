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

export interface Crack {
  x: number;
  y: number;
  rays: { angle: number; len: number }[];
  life: number;
}

/** Planet-local punch. The renderer copies pixels, then cuts. */
export interface Break {
  x: number;
  y: number;
  r: number;
}

export interface Game {
  gold: number;
  time: number;
  nextId: number;
  shake: number;
  hitStop: number;
  carved: number;
  ufos: Ufo[];
  shots: Shot[];
  booms: Boom[];
  chips: Chip[];
  cracks: Crack[];
  breaks: Break[];
  shotsFired: number;
}

export interface View {
  cx: number;
  cy: number;
  r: number;
}

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
    hitStop: 0,
    carved: 0,
    ufos: [makeUfo(1)],
    shots: [],
    booms: [],
    chips: [],
    cracks: [],
    breaks: [],
    shotsFired: 0,
  };
}

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
    period: 1.15 + r(8) * 0.5,
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
  return Math.min(1, game.carved / (area * 0.72));
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
  if (game.hitStop > 0) {
    game.hitStop = Math.max(0, game.hitStop - t);
    game.shake = Math.max(game.shake, 0.75);
    ageFx(game, t * 0.35);
    return;
  }

  game.time += t;
  game.gold += incomePerSecond(game) * t;
  game.shake = Math.max(0, game.shake - t * 3.4);

  for (const ufo of game.ufos) {
    ufo.angle += ufo.omega * t;
    ufo.cooldown -= t;
    if (ufo.cooldown > 0) continue;
    ufo.cooldown = ufo.period;
    fire(game, view, ufo);
  }

  ageFx(game, t);
}

function ageFx(game: Game, t: number): void {
  for (const s of game.shots) s.life -= t;
  game.shots = game.shots.filter((s) => s.life > 0);
  for (const b of game.booms) b.age += t;
  game.booms = game.booms.filter((b) => b.age < b.life);
  for (const crack of game.cracks) crack.life -= t;
  game.cracks = game.cracks.filter((c) => c.life > 0);
  for (const chip of game.chips) {
    chip.life -= t;
    chip.x += chip.vx * t;
    chip.y += chip.vy * t;
    chip.rot += chip.spin * t;
  }
  game.chips = game.chips.filter((c) => c.life > 0);
}

function fire(game: Game, view: View, ufo: Ufo): void {
  const from = ufoPos(ufo, view, game.time);
  const a = Math.random() * Math.PI * 2;
  const rad = view.r * (0.2 + Math.sqrt(Math.random()) * 0.62);
  const x = Math.cos(a) * rad;
  const y = Math.sin(a) * rad;
  const hitX = view.cx + x;
  const hitY = view.cy + y;
  const size = 28 + Math.random() * 16;

  game.shots.push({ x0: from.x, y0: from.y, x1: hitX, y1: hitY, life: 0.18 });
  game.breaks.push({ x, y, r: size });
  game.carved += Math.PI * size * size * 0.55;
  game.booms.push({ x: hitX, y: hitY, age: 0, life: 0.48, size: size * 1.15 });
  game.cracks.push({
    x: hitX,
    y: hitY,
    life: 0.22,
    rays: [0, 1, 2, 3, 4].map((i) => ({
      angle: a + (i - 2) * 0.55 + (Math.random() - 0.5) * 0.4,
      len: size * (1.1 + Math.random() * 0.8),
    })),
  });
  spawnChips(game, hitX, hitY, x, y);
  game.shake = Math.min(1.25, game.shake + 0.9);
  game.hitStop = 0.05;
  game.shotsFired += 1;
  game.gold += 0.4;
}

function spawnChips(game: Game, x: number, y: number, lx: number, ly: number): void {
  const n = 4 + Math.floor(Math.random() * 3);
  const out = Math.atan2(ly, lx);
  for (let i = 0; i < n; i += 1) {
    const ang = out + (Math.random() - 0.5) * 1.8;
    const spd = 120 + Math.random() * 180;
    game.chips.push({
      x,
      y,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd,
      life: 0.55 + Math.random() * 0.35,
      rot: Math.random() * 6,
      spin: (Math.random() - 0.5) * 16,
    });
  }
}
