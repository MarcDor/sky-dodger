import { Application, Container, Graphics, Sprite, Texture } from "pixi.js";
import { PlanetSurface } from "./draw/planet";
import { drawBackdrop, drawPlanetHalo, drawUfos, drawVfx } from "./draw/scene";
import { buyUfo, createGame, incomePerSecond, step, ufoCost, wound } from "./sim/game";

interface FlyBit {
  sprite: Sprite;
  vx: number;
  vy: number;
  spin: number;
  life: number;
}

export async function mountCinder(host: HTMLElement): Promise<void> {
  const app = new Application();
  await app.init({
    antialias: true,
    background: 0x14233c,
    resizeTo: host,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
  });
  host.appendChild(app.canvas);
  app.canvas.style.display = "block";
  app.canvas.style.width = "100%";
  app.canvas.style.height = "100%";

  const stars = Array.from({ length: 48 }, () => ({
    x: Math.random(),
    y: Math.random(),
    s: Math.random() < 0.7 ? 1.2 : 2.2,
  }));

  const bg = new Graphics();
  const world = new Container();
  const halo = new Graphics();
  const surface = new PlanetSurface();
  surface.rebuild(200);
  let planetTex = Texture.from(surface.canvas);
  const planet = new Sprite(planetTex);
  planet.anchor.set(0.5);
  const bits = new Container();
  const vfx = new Graphics();
  const ships = new Graphics();
  world.addChild(halo, planet, bits, vfx, ships);
  app.stage.addChild(bg, world);

  const flying: FlyBit[] = [];
  const game = createGame();
  const goldVal = document.getElementById("goldVal");
  const planetVal = document.getElementById("planetVal");
  const planetFill = document.getElementById("planetFill");
  const ufoVal = document.getElementById("ufoVal");
  const incomeVal = document.getElementById("incomeVal");
  const buyBtn = document.getElementById("buyUfo");
  const shotsVal = document.getElementById("shotsVal");

  buyBtn?.addEventListener("click", () => {
    buyUfo(game);
    syncShop();
  });

  const syncShop = (): void => {
    const cost = ufoCost(game.ufos.length);
    if (buyBtn instanceof HTMLButtonElement) {
      buyBtn.textContent = `UFO holen · ${cost}`;
      buyBtn.disabled = game.gold < cost;
    }
  };
  syncShop();

  let last = performance.now();
  const tick = (): void => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const w = app.renderer.width;
    const h = app.renderer.height;
    const view = {
      cx: w * 0.5,
      cy: h * 0.54,
      r: Math.min(w, h) * 0.26,
    };

    if (Math.abs(view.r - surface.radius) > 3) {
      surface.rebuild(view.r);
      planetTex.destroy(true);
      planetTex = Texture.from(surface.canvas);
      planet.texture = planetTex;
    }

    step(game, dt, view);

    for (const br of game.breaks) {
      const stamps = surface.carve(br.x, br.y, br.r);
      const out = Math.atan2(br.y, br.x);
      for (const st of stamps) {
        const spr = new Sprite(Texture.from(st.canvas));
        spr.anchor.set(0.5);
        spr.position.set(view.cx + st.localX, view.cy + st.localY);
        bits.addChild(spr);
        const spd = 130 + Math.random() * 170;
        const spread = out + (Math.random() - 0.5) * 0.9;
        flying.push({
          sprite: spr,
          vx: Math.cos(spread) * spd,
          vy: Math.sin(spread) * spd,
          spin: (Math.random() - 0.5) * 9,
          life: 1.15 + Math.random() * 0.55,
        });
      }
    }
    game.breaks.length = 0;
    planetTex.source.update();

    for (let i = flying.length - 1; i >= 0; i -= 1) {
      const bit = flying[i];
      bit.life -= dt;
      bit.sprite.x += bit.vx * dt;
      bit.sprite.y += bit.vy * dt;
      bit.sprite.rotation += bit.spin * dt;
      bit.sprite.alpha = Math.min(1, bit.life * 1.4);
      if (bit.life > 0) continue;
      bit.sprite.destroy({ texture: true });
      flying.splice(i, 1);
    }

    drawBackdrop(bg, w, h, stars);
    drawPlanetHalo(halo, view);
    const punch = game.shake;
    world.position.set((Math.random() - 0.5) * punch * 18, (Math.random() - 0.5) * punch * 18);
    planet.position.set(view.cx, view.cy);
    planet.scale.set(1 - punch * 0.04);
    drawVfx(vfx, game.shots, game.booms, game.chips, game.cracks);
    drawUfos(ships, game, view);

    const wnd = wound(game, view.r);
    if (goldVal) goldVal.textContent = Math.floor(game.gold).toLocaleString("de-DE");
    if (planetVal) planetVal.textContent = `${Math.round((1 - wnd) * 100)}%`;
    if (planetFill) planetFill.style.width = `${Math.max(0, (1 - wnd) * 100)}%`;
    if (ufoVal) ufoVal.textContent = String(game.ufos.length);
    if (incomeVal) incomeVal.textContent = `+${incomePerSecond(game).toFixed(0)}/s`;
    if (shotsVal) shotsVal.textContent = String(game.shotsFired);
    syncShop();

    requestAnimationFrame(tick);
  };
  tick();
}
