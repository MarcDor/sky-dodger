export interface Ufo {
  id: number;
  angle: number;
  ring: number;
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
}

export interface Game {
  gold: number;
  nextId: number;
  ufos: Ufo[];
  craters: Crater[];
  shots: Shot[];
  booms: Boom[];
  shotsFired: number;
}

export interface View {
  cx: number;
  cy: number;
  r: number;
}

const MAX_CRATERS = 140;
const INCOME_PER_UFO = 3.2;

export function ufoCost(owned: number): number {
  return 15 + owned * 15;
}

export function createGame(): Game {
  return {
    gold: 40,
    nextId: 2,
    ufos: [makeUfo(1, 0, 0)],
    craters: [],
    shots: [],
    booms: [],
    shotsFired: 0,
  };
}

export function makeUfo(id: number, angle: number, ring: number): Ufo {
  return {
    id,
    angle,
    ring,
    cooldown: 0.25 + (id % 5) * 0.08,
    period: 0.48 + (id % 4) * 0.07,
  };
}

export function buyUfo(game: Game): boolean {
  const cost = ufoCost(game.ufos.length);
  if (game.gold < cost) return false;
  game.gold -= cost;
  const angle = game.ufos.length * 0.9;
  const ring = game.ufos.length % 3;
  game.ufos.push(makeUfo(game.nextId, angle, ring));
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

export function step(game: Game, dt: number, view: View): void {
  const t = Math.min(0.05, dt);
  game.gold += incomePerSecond(game) * t;

  for (const ufo of game.ufos) {
    const orbit = view.r * (1.52 + ufo.ring * 0.16);
    ufo.angle += t * (0.55 - ufo.ring * 0.08);
    ufo.cooldown -= t;
    if (ufo.cooldown > 0) continue;
    ufo.cooldown = ufo.period;
    fire(game, view, ufo.angle, orbit);
  }

  for (const c of game.craters) c.heat = Math.max(0, c.heat - t * 1.8);

  for (const s of game.shots) s.life -= t;
  game.shots = game.shots.filter((s) => s.life > 0);

  for (const b of game.booms) b.age += t;
  game.booms = game.booms.filter((b) => b.age < 0.28);
}

function fire(game: Game, view: View, angle: number, orbit: number): void {
  const x0 = view.cx + Math.cos(angle) * orbit;
  const y0 = view.cy + Math.sin(angle) * orbit;
  const a = Math.random() * Math.PI * 2;
  const rad = view.r * Math.sqrt(Math.random()) * 0.82;
  const x = Math.cos(a) * rad;
  const y = Math.sin(a) * rad;
  game.shots.push({ x0, y0, x1: view.cx + x, y1: view.cy + y, life: 0.09 });
  game.craters.push({ x, y, r: 9 + Math.random() * 9, heat: 1 });
  if (game.craters.length > MAX_CRATERS) game.craters.splice(0, game.craters.length - MAX_CRATERS);
  game.booms.push({ x: view.cx + x, y: view.cy + y, age: 0 });
  game.shotsFired += 1;
  game.gold += 0.4;
}
