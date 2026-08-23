/**
 * Equirectangular crust buffer.
 *
 * R = crater depth (ablated mass)
 * G = heat (cools every tick)
 * B = cracks / fracture
 *
 * The laser does not punch a boolean hole. It deposits energy; once heat
 * crosses the vaporization band, leftover energy becomes crater depth.
 * Dwell grows the melt pool because radius scales with local heat.
 */

export const DAMAGE_W = 1024;
export const DAMAGE_H = 512;

export interface SplatResult {
  addedDamage: number;
  peakHeat: number;
  u: number;
  v: number;
  radiusPx: number;
}

export class DamageField {
  readonly width = DAMAGE_W;
  readonly height = DAMAGE_H;
  readonly pixels: Uint8Array;
  totalEnergy = 0;
  craterEvents = 0;

  constructor() {
    this.pixels = new Uint8Array(this.width * this.height * 4);
  }

  sample(u: number, v: number): { damage: number; heat: number; crack: number } {
    const x = wrapX(Math.round(fract(u) * this.width), this.width);
    const y = clampY(Math.round((1 - clamp01(v)) * (this.height - 1)), this.height);
    const i = (y * this.width + x) * 4;
    return {
      damage: this.pixels[i] / 255,
      heat: this.pixels[i + 1] / 255,
      crack: this.pixels[i + 2] / 255,
    };
  }

  meanDamage(): number {
    let sum = 0;
    const n = this.width * this.height;
    for (let p = 0; p < n; p += 1) sum += this.pixels[p * 4];
    return sum / n / 255;
  }

  meanHeat(): number {
    let sum = 0;
    const n = this.width * this.height;
    for (let p = 0; p < n; p += 1) sum += this.pixels[p * 4 + 1];
    return sum / n / 255;
  }

  /** dt in seconds, energy ~ 0.4–1.2 per frame while the beam is on. */
  splat(u: number, v: number, energy: number): SplatResult {
    const local = this.sample(u, v);
    const radiusPx = 9 + local.heat * 34 + local.damage * 10;
    const r = Math.ceil(radiusPx);
    const latScale = Math.max(0.22, Math.cos((v - 0.5) * Math.PI));
    let added = 0;
    let peakHeat = local.heat;

    for (let dy = -r; dy <= r; dy += 1) {
      for (let dx = -r; dx <= r; dx += 1) {
        const dist = Math.hypot(dx * latScale, dy);
        if (dist > radiusPx) continue;
        const g = Math.exp((-dist * dist) / (2 * (radiusPx * 0.38) ** 2));
        const x = wrapX(Math.round(fract(u) * this.width + dx), this.width);
        const y = clampY(Math.round((1 - clamp01(v)) * (this.height - 1) + dy), this.height);
        const i = (y * this.width + x) * 4;

        const heatAdd = energy * g * 42;
        const nextHeat = Math.min(255, this.pixels[i + 1] + heatAdd);
        const vapor = Math.max(0, nextHeat - 90);
        const dmgAdd = vapor * g * 0.22;
        const nextDmg = Math.min(255, this.pixels[i] + dmgAdd);
        added += nextDmg - this.pixels[i];
        this.pixels[i] = nextDmg;
        this.pixels[i + 1] = nextHeat;
        if (nextDmg > 70 && g > 0.45) {
          this.pixels[i + 2] = Math.min(255, this.pixels[i + 2] + g * 18);
        }
        this.pixels[i + 3] = 255;
        peakHeat = Math.max(peakHeat, nextHeat / 255);
      }
    }

    this.paintCracks(u, v, radiusPx, energy);
    this.totalEnergy += energy;
    if (added > 80) this.craterEvents += 1;
    return { addedDamage: added / 255, peakHeat, u, v, radiusPx };
  }

  cool(dt: number): void {
    const keep = Math.exp(-1.35 * dt);
    const n = this.width * this.height;
    for (let p = 0; p < n; p += 1) {
      const i = p * 4;
      if (this.pixels[i + 1] === 0) continue;
      this.pixels[i + 1] = Math.max(0, this.pixels[i + 1] * keep);
    }
  }

  private paintCracks(u: number, v: number, radiusPx: number, energy: number): void {
    const walks = energy > 0.6 ? 3 : 1;
    for (let w = 0; w < walks; w += 1) {
      let x = fract(u) * this.width;
      let y = (1 - clamp01(v)) * (this.height - 1);
      let ang = Math.random() * Math.PI * 2;
      const steps = 8 + Math.floor(radiusPx * 0.5);
      for (let s = 0; s < steps; s += 1) {
        ang += (Math.random() - 0.5) * 0.7;
        x += Math.cos(ang) * 1.6;
        y += Math.sin(ang) * 1.6;
        const ix = wrapX(Math.round(x), this.width);
        const iy = clampY(Math.round(y), this.height);
        const i = (iy * this.width + ix) * 4;
        if (this.pixels[i] < 40) continue;
        this.pixels[i + 2] = Math.min(255, this.pixels[i + 2] + 70);
        this.pixels[i] = Math.min(255, this.pixels[i] + 6);
      }
    }
  }
}

export function fract(v: number): number {
  return v - Math.floor(v);
}

export function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function wrapX(x: number, w: number): number {
  return ((x % w) + w) % w;
}

function clampY(y: number, h: number): number {
  return Math.min(h - 1, Math.max(0, y));
}
