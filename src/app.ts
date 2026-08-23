import { Application, Graphics, Sprite, Texture } from "pixi.js";
import { paintPlanet } from "./draw/planet";
import { drawBackdrop, drawPlanetHalo, drawUfos, drawVfx } from "./draw/scene";
import { buyUfo, createGame, incomePerSecond, step, ufoCost, wound } from "./sim/game";

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
  const halo = new Graphics();
  const canvas = document.createElement("canvas");
  paintPlanet(canvas, 200, []);
  const planetTex = Texture.from(canvas);
  const planet = new Sprite(planetTex);
  planet.anchor.set(0.5);
  const vfx = new Graphics();
  const ships = new Graphics();
  app.stage.addChild(bg, halo, planet, vfx, ships);

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
    const dt = (now - last) / 1000;
    last = now;
    const w = app.renderer.width;
    const h = app.renderer.height;
    const view = {
      cx: w * 0.5,
      cy: h * 0.54,
      r: Math.min(w, h) * 0.26,
    };
    step(game, dt, view);

    drawBackdrop(bg, w, h, stars);
    drawPlanetHalo(halo, view);
    paintPlanet(canvas, view.r, game.craters);
    planetTex.source.update();
    planet.texture = planetTex;
    const punch = game.shake;
    planet.position.set(view.cx + (Math.random() - 0.5) * punch * 10, view.cy + (Math.random() - 0.5) * punch * 10);
    planet.scale.set(1 - punch * 0.035);
    drawVfx(vfx, game.shots, game.booms, game.chips);
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
