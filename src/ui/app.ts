import {
  Application,
  Container,
  Graphics,
  Rectangle,
  Text,
  type FederatedPointerEvent,
} from "pixi.js";
import {
  createRun,
  emptyLayout,
  step,
  type FireEvent,
  type Layout,
  type LevelDefinition,
  type StationType,
} from "../core";
import { CAMPAIGN, nextLevel } from "../levels/campaign";
import { describeTarget, describeWorkpiece } from "../core/workpiece";
import { loadSave, recordSolve, type SaveData } from "../save/storage";
import {
  drawCamWave,
  drawEmptyMount,
  drawGauge,
  drawInstrument,
  drawMachineRing,
  drawMetalButton,
  drawWorkshopFloor,
  drawWorkpiecePlate,
  slotAngle,
} from "./draw";
import { drawSparks, drawStationGlyph, drawStationMachine } from "./icons";
import { COLORS, FONT, MONO, STATION_META } from "./theme";

const BEAT_MS = 420;
const SPEEDS = [1, 2, 4] as const;

interface DragState {
  type: StationType;
  from: number | null;
}

export async function mountLockstep(host: HTMLElement): Promise<void> {
  const app = new Application();
  await app.init({
    antialias: true,
    background: COLORS.bg,
    resizeTo: host,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
  });
  host.appendChild(app.canvas);
  app.canvas.style.display = "block";
  app.canvas.style.width = "100%";
  app.canvas.style.height = "100%";

  const world = new Container();
  app.stage.addChild(world);
  world.eventMode = "static";
  world.hitArea = new Rectangle(0, 0, 100, 100);

  let save: SaveData = loadSave();
  let levelIndex = 0;
  let layout = emptyLayout(CAMPAIGN[0].S);
  let run = createRun(CAMPAIGN[0], layout);
  let playing = false;
  let speedIndex = 0;
  let acc = 0;
  let drag: DragState | null = null;
  let pointer = { x: 0, y: 0 };
  let displaySlot = 0;
  let prevSlot = 0;
  let anim = 1;
  let flash: FireEvent[] = [];
  let flashAge = 0;
  let overlayOpen = false;
  let mood = 0;

  const gfx = {
    bg: new Graphics(),
    ring: new Graphics(),
    stations: new Graphics(),
    glyphs: new Container(),
    sparks: new Graphics(),
    piece: new Graphics(),
    hud: new Graphics(),
    wave: new Graphics(),
    overlay: new Graphics(),
    texts: new Container(),
    overlayTexts: new Container(),
  };

  world.addChild(
    gfx.bg,
    gfx.hud,
    gfx.ring,
    gfx.stations,
    gfx.glyphs,
    gfx.sparks,
    gfx.piece,
    gfx.wave,
    gfx.texts,
    gfx.overlay,
    gfx.overlayTexts,
  );

  const labels = createLabels();
  const overlayKeys = new Set(["overlayTitle", "overlayBody", "overlayRetry", "overlayNext"]);
  for (const [key, text] of Object.entries(labels)) {
    (overlayKeys.has(key) ? gfx.overlayTexts : gfx.texts).addChild(text);
  }

  const slotLabels: Text[] = [];
  function ensureSlotLabels(count: number): void {
    while (slotLabels.length < count) {
      const text = new Text({
        text: "",
        style: { fontFamily: FONT, fontSize: 11, fill: COLORS.brass, fontWeight: "600" },
      });
      text.anchor.set(0.5);
      gfx.texts.addChild(text);
      slotLabels.push(text);
    }
    for (let i = 0; i < slotLabels.length; i += 1) {
      slotLabels[i].visible = i < count;
    }
  }

  function level(): LevelDefinition {
    return CAMPAIGN[levelIndex];
  }

  function resetRun(): void {
    run = createRun(level(), layout);
    overlayOpen = false;
    flash = [];
    displaySlot = 0;
    prevSlot = 0;
    anim = 1;
  }

  function editLayout(mutate: (next: Layout) => void): void {
    const next: Layout = {
      tape: [...layout.tape],
      stations: layout.stations.map((s) => ({ ...s })),
    };
    mutate(next);
    layout = next;
    playing = false;
    resetRun();
  }

  function placeStation(type: StationType, position: number): void {
    if (!level().availableStations.includes(type)) return;
    editLayout((next) => {
      next.stations = next.stations.filter((s) => s.position !== position);
      next.stations.push({ type, position });
      next.tape[position] = true;
    });
  }

  function removeStation(position: number): void {
    editLayout((next) => {
      next.stations = next.stations.filter((s) => s.position !== position);
    });
  }

  function toggleTape(position: number): void {
    editLayout((next) => {
      next.tape[position] = !next.tape[position];
    });
  }

  function beat(): void {
    if (run.solved) {
      playing = false;
      overlayOpen = true;
      save = recordSolve(level().id, run.scores);
      return;
    }
    const before = run;
    run = step(run);
    prevSlot = displaySlot;
    if (run.workpiece) displaySlot = Math.max(0, run.workpieceAge - 1);
    else if (run.lastOutputMatched !== null) displaySlot = run.S - 1;
    else displaySlot = before.workpiece ? before.workpieceAge : 0;
    anim = 0;
    flash = run.lastEvents.filter((e) => e.outcome === "fired" || e.outcome === "failed");
    flashAge = 0;
    if (run.solved) {
      playing = false;
      overlayOpen = true;
      save = recordSolve(level().id, run.scores);
    }
  }

  function layoutSlots() {
    const w = app.renderer.width;
    const h = app.renderer.height;
    const cx = w * 0.5;
    const cy = h * 0.48;
    const ringR = Math.min(w, h) * 0.26;
    return { w, h, cx, cy, ringR };
  }

  function slotFromEvent(e: FederatedPointerEvent): { slot: number; zone: "tape" | "station" | "none" } {
    const { cx, cy, ringR } = layoutSlots();
    const dx = e.global.x - cx;
    const dy = e.global.y - cy;
    const dist = Math.hypot(dx, dy);
    const S = level().S;
    let ang = Math.atan2(dy, dx) + Math.PI / 2;
    if (ang < 0) ang += Math.PI * 2;
    const slot = Math.round((ang / (Math.PI * 2)) * S) % S;
    if (dist >= ringR * 0.55 && dist <= ringR * 1.14) return { slot, zone: "tape" };
    if (dist > ringR * 1.14 && dist <= ringR * 1.95) return { slot, zone: "station" };
    return { slot, zone: "none" };
  }

  function onPointerDown(e: FederatedPointerEvent): void {
    pointer = { x: e.global.x, y: e.global.y };
    if (overlayOpen) {
      const { w, h } = layoutSlots();
      if (hitButton(e.global.x, e.global.y, w * 0.5 - 160, h * 0.62, 140, 44)) {
        resetRun();
        return;
      }
      if (hitButton(e.global.x, e.global.y, w * 0.5 + 20, h * 0.62, 140, 44)) {
        const nxt = nextLevel(level().id);
        if (nxt) {
          levelIndex = CAMPAIGN.findIndex((l) => l.id === nxt.id);
          layout = emptyLayout(level().S);
          resetRun();
        }
        return;
      }
    }

    const { w, h } = layoutSlots();
    const wave = waveformLayout(w, h, level().S);
    for (let i = 0; i < wave.S; i += 1) {
      const x = wave.x0 + i * (wave.bw + 4);
      if (hitButton(e.global.x, e.global.y, x, wave.y0 - 8, wave.bw, 50)) {
        toggleTape(i);
        return;
      }
    }
    if (hitButton(e.global.x, e.global.y, 28, h - 78, 88, 36)) {
      playing = !playing;
      return;
    }
    if (hitButton(e.global.x, e.global.y, 126, h - 78, 88, 36)) {
      playing = false;
      beat();
      return;
    }
    if (hitButton(e.global.x, e.global.y, 224, h - 78, 88, 36)) {
      speedIndex = (speedIndex + 1) % SPEEDS.length;
      return;
    }
    if (hitButton(e.global.x, e.global.y, w - 168, 22, 64, 32) && levelIndex > 0) {
      levelIndex -= 1;
      layout = emptyLayout(level().S);
      resetRun();
      return;
    }
    if (hitButton(e.global.x, e.global.y, w - 96, 22, 64, 32) && levelIndex < CAMPAIGN.length - 1) {
      levelIndex += 1;
      layout = emptyLayout(level().S);
      resetRun();
      return;
    }

    const palette = paletteRects();
    for (const item of palette) {
      if (hitButton(e.global.x, e.global.y, item.x, item.y, item.w, item.h)) {
        drag = { type: item.type, from: null };
        return;
      }
    }

    const hit = slotFromEvent(e);
    const existing = layout.stations.find((s) => s.position === hit.slot);
    if (hit.zone === "station" && existing) {
      drag = { type: existing.type, from: hit.slot };
      return;
    }
    if (hit.zone === "tape") toggleTape(hit.slot);
  }

  function onPointerMove(e: FederatedPointerEvent): void {
    pointer = { x: e.global.x, y: e.global.y };
  }

  function onPointerUp(e: FederatedPointerEvent): void {
    if (!drag) return;
    const hit = slotFromEvent(e);
    if (hit.zone === "station" || hit.zone === "tape") {
      if (drag.from !== null && drag.from !== hit.slot) removeStation(drag.from);
      placeStation(drag.type, hit.slot);
    } else if (drag.from !== null) {
      removeStation(drag.from);
    }
    drag = null;
  }

  function paletteRects() {
    return level().availableStations.map((type, i) => ({
      type,
      x: 28,
      y: 108 + i * 78,
      w: 150,
      h: 66,
    }));
  }

  world.on("pointerdown", onPointerDown);
  world.on("pointermove", onPointerMove);
  world.on("pointerup", onPointerUp);
  world.on("pointerupoutside", onPointerUp);

  window.addEventListener("keydown", (ev) => {
    if (ev.code === "Space") {
      ev.preventDefault();
      playing = !playing;
    } else if (ev.code === "Period" || ev.code === "ArrowRight") {
      playing = false;
      beat();
    } else if (ev.code === "Digit1") speedIndex = 0;
    else if (ev.code === "Digit2") speedIndex = 1;
    else if (ev.code === "Digit3") speedIndex = 2;
  });

  app.ticker.add((ticker) => {
    const dt = ticker.deltaMS;
    flashAge += dt;
    mood += dt;
    anim = Math.min(1, anim + dt / (BEAT_MS / SPEEDS[speedIndex]));
    if (playing) {
      acc += dt * SPEEDS[speedIndex];
      while (acc >= BEAT_MS && playing) {
        acc -= BEAT_MS;
        beat();
      }
    } else {
      acc = 0;
    }
    draw();
  });

  function draw(): void {
    const { w, h, cx, cy, ringR } = layoutSlots();
    world.hitArea = new Rectangle(0, 0, w, h);

    gfx.bg.clear();
    drawWorkshopFloor(gfx.bg, w, h, cx, cy, ringR, mood);

    gfx.hud.clear();
    drawInstrument(gfx.hud, 18, 18, 196, 70);
    drawInstrument(gfx.hud, w / 2 - 216, 14, 432, 78);
    drawInstrument(gfx.hud, 18, 98, 196, h - 196);
    drawInstrument(gfx.hud, w - 214, 98, 196, 292);
    drawInstrument(gfx.hud, 18, h - 96, w - 36, 80);

    gfx.ring.clear();
    drawMachineRing(
      gfx.ring,
      cx,
      cy,
      ringR,
      level().S,
      layout.tape,
      run.t,
      mood,
      Boolean(run.workpiece || playing),
    );
    placeSlotLabels(cx, cy, ringR, level().S);
    drawStations(cx, cy, ringR);
    drawWorkpiece(cx, cy, ringR);
    drawWave(w, h);
    drawHudText(w, h);
    drawOverlay(w, h);
  }

  function placeSlotLabels(cx: number, cy: number, r: number, S: number): void {
    ensureSlotLabels(S);
    for (let i = 0; i < S; i += 1) {
      const a = slotAngle(i, S);
      slotLabels[i].text = String(i);
      slotLabels[i].position.set(cx + Math.cos(a) * (r + 34), cy + Math.sin(a) * (r + 34));
    }
  }

  function drawStations(cx: number, cy: number, r: number): void {
    gfx.stations.clear();
    gfx.glyphs.removeChildren();
    gfx.sparks.clear();
    const S = level().S;

    for (let i = 0; i < S; i += 1) {
      const a = slotAngle(i, S);
      const x = cx + Math.cos(a) * (r + 74);
      const y = cy + Math.sin(a) * (r + 74);
      if (!layout.stations.some((s) => s.position === i)) drawEmptyMount(gfx.stations, x, y);
    }

    for (const station of layout.stations) {
      const a = slotAngle(station.position, S);
      const x = cx + Math.cos(a) * (r + 74);
      const y = cy + Math.sin(a) * (r + 74);
      const ev = flash.find((e) => e.position === station.position && flashAge < 220);
      const muted = !layout.tape[station.position];
      let body = muted ? COLORS.slateLo : COLORS.slate;
      let edge = COLORS.panelEdge;
      if (ev?.outcome === "fired") {
        body = COLORS.amber;
        edge = COLORS.amberHi;
      } else if (ev?.outcome === "failed") {
        body = COLORS.slateLo;
        edge = COLORS.fail;
      }
      gfx.stations.moveTo(cx + Math.cos(a) * (r + 20), cy + Math.sin(a) * (r + 20));
      gfx.stations.lineTo(x, y);
      gfx.stations.stroke({ width: 5, color: COLORS.brassLo, alpha: 0.85 });
      gfx.stations.moveTo(cx + Math.cos(a) * (r + 20), cy + Math.sin(a) * (r + 20));
      gfx.stations.lineTo(x, y);
      gfx.stations.stroke({ width: 2, color: COLORS.brass, alpha: 0.7 });

      const machine = new Graphics();
      drawStationMachine(machine, station.type, {
        body,
        edge,
        fired: ev?.outcome === "fired",
        failed: ev?.outcome === "failed",
        muted,
      });
      machine.position.set(x, y);
      machine.rotation = a + Math.PI / 2;
      gfx.glyphs.addChild(machine);
      if (ev?.outcome === "fired") {
        const sparks = new Graphics();
        drawSparks(sparks, station.position + run.t);
        sparks.position.set(x, y);
        sparks.rotation = a + Math.PI / 2;
        gfx.glyphs.addChild(sparks);
      }
    }

    if (drag) {
      const ghost = new Graphics();
      drawStationMachine(ghost, drag.type, {
        body: COLORS.amber,
        edge: COLORS.amberHi,
        fired: false,
        failed: false,
        muted: false,
      });
      ghost.alpha = 0.7;
      ghost.position.set(pointer.x, pointer.y);
      gfx.glyphs.addChild(ghost);
    }
  }

  function drawWorkpiece(cx: number, cy: number, r: number): void {
    gfx.piece.clear();
    const wp = run.workpiece;
    if (!wp) return;
    const S = level().S;
    const from = slotAngle(prevSlot, S);
    const to = slotAngle(displaySlot, S);
    const a = lerpAngle(from, to, ease(anim));
    const x = cx + Math.cos(a) * (r - 28);
    const y = cy + Math.sin(a) * (r - 28);
    drawWorkpiecePlate(gfx.piece, x, y, wp.holes, wp.rivets, wp.stamped);
  }

  function drawWave(w: number, h: number): void {
    gfx.wave.clear();
    const { S, x0, y0, bw } = waveformLayout(w, h, level().S);
    drawCamWave(gfx.wave, x0, y0, bw, S, layout.tape, run.t % S);
  }

  function drawHudText(w: number, h: number): void {
    const lv = level();
    const wp = run.workpiece ?? lv.start;
    labels.title.text = "LOCKSTEP";
    labels.subtitle.text = `${String(levelIndex + 1).padStart(2, "0")}  ${lv.name}`;
    labels.brief.text = wrap(lv.brief, 34);
    labels.brief.position.set(32, 250 + level().availableStations.length * 78);
    const gauges = [
      { cap: labels.gCyclesCap, val: labels.gCyclesVal, name: "CYCLES", value: String(run.scores.cycles) },
      { cap: labels.gAreaCap, val: labels.gAreaVal, name: "AREA", value: String(run.scores.area) },
      { cap: labels.gTapeCap, val: labels.gTapeVal, name: "TAPE", value: String(run.scores.tapeLength) },
    ];
    gauges.forEach((gauge, i) => {
      const gx = w / 2 - 198 + i * 136;
      drawGauge(gfx.hud, gx, 24, 128, 56);
      gauge.cap.text = gauge.name;
      gauge.cap.position.set(gx + 64, 30);
      gauge.val.text = gauge.value;
      gauge.val.position.set(gx + 64, 46);
    });
    labels.streak.text = `Serie  ${run.consecutiveSuccesses} / ${lv.successStreak}`;
    labels.streak.position.set(w - 116, 112);
    labels.target.text = `Ziel\n${describeTarget(lv.target)}\n\nJetzt\n${describeWorkpiece(wp)}`;
    labels.target.position.set(w - 116, 148);
    labels.controls.text = playing ? "Pause" : "Play";
    labels.step.text = "Schritt";
    labels.speed.text = `${SPEEDS[speedIndex]}×`;
    labels.controls.position.set(72, h - 60);
    labels.step.position.set(170, h - 60);
    labels.speed.position.set(268, h - 60);
    labels.prev.text = "◀";
    labels.next.text = "▶";
    labels.prev.position.set(w - 136, 38);
    labels.next.position.set(w - 64, 38);
    labels.waveCaption.text = "Tape";
    labels.waveCaption.position.set(360, h - 94);
    labels.best.text = save.best[lv.id]
      ? `Best  C${save.best[lv.id].cycles} · A${save.best[lv.id].area}`
      : save.completed.includes(lv.id)
        ? "Gelöst"
        : "Ungelöst";
    labels.best.position.set(w - 116, 352);

    const pal = paletteRects();
    const palLabels = [labels.pal0, labels.pal1, labels.pal2, labels.pal3];
    for (let i = 0; i < palLabels.length; i += 1) {
      const text = palLabels[i];
      const item = pal[i];
      if (!item) {
        text.visible = false;
        continue;
      }
      text.visible = true;
      text.text = STATION_META[item.type].label;
      text.position.set(item.x + 92, item.y + 33);
    }

    for (const item of pal) {
      gfx.hud.roundRect(item.x, item.y + 2, item.w, item.h, 10);
      gfx.hud.fill({ color: 0x000000, alpha: 0.28 });
      gfx.hud.roundRect(item.x, item.y, item.w, item.h, 10);
      gfx.hud.fill({ color: COLORS.panel });
      gfx.hud.roundRect(item.x, item.y, item.w, item.h, 10);
      gfx.hud.stroke({ width: 1.4, color: COLORS.brassMid, alpha: 0.7 });
      gfx.hud.roundRect(item.x + 10, item.y + 8, 50, 50, 8);
      gfx.hud.fill({ color: COLORS.slateLo });
      const icon = new Graphics();
      drawStationGlyph(icon, item.type, COLORS.text);
      icon.position.set(item.x + 35, item.y + 33);
      gfx.glyphs.addChild(icon);
    }

    drawMetalButton(gfx.hud, 28, h - 78, 88, 36, playing);
    drawMetalButton(gfx.hud, 126, h - 78, 88, 36, false);
    drawMetalButton(gfx.hud, 224, h - 78, 88, 36, false);
    drawMetalButton(gfx.hud, w - 168, 22, 64, 32, false);
    drawMetalButton(gfx.hud, w - 96, 22, 64, 32, false);
  }

  function drawOverlay(w: number, h: number): void {
    gfx.overlay.clear();
    labels.overlayTitle.visible = overlayOpen;
    labels.overlayBody.visible = overlayOpen;
    labels.overlayRetry.visible = overlayOpen;
    labels.overlayNext.visible = overlayOpen;
    if (!overlayOpen) return;
    gfx.overlay.rect(0, 0, w, h);
    gfx.overlay.fill({ color: 0x000000, alpha: 0.58 });
    drawInstrument(gfx.overlay, w * 0.5 - 240, h * 0.5 - 140, 480, 280);
    labels.overlayTitle.text = "Stabiler Lauf";
    labels.overlayTitle.position.set(w * 0.5, h * 0.5 - 96);
    labels.overlayBody.text = `Cycles ${run.scores.cycles}   ·   Area ${run.scores.area}   ·   Tape ${run.scores.tapeLength}`;
    labels.overlayBody.position.set(w * 0.5, h * 0.5 - 36);
    drawMetalButton(gfx.overlay, w * 0.5 - 160, h * 0.62, 140, 44, false);
    drawMetalButton(gfx.overlay, w * 0.5 + 20, h * 0.62, 140, 44, true);
    labels.overlayRetry.text = "Nochmal";
    labels.overlayRetry.position.set(w * 0.5 - 90, h * 0.62 + 22);
    labels.overlayNext.text = nextLevel(level().id) ? "Weiter" : "Fertig";
    labels.overlayNext.position.set(w * 0.5 + 90, h * 0.62 + 22);
  }

  function createLabels() {
    const style = (
      size: number,
      fill = COLORS.text,
      weight: "400" | "500" | "600" | "700" = "600",
    ) => ({
      fontFamily: FONT,
      fontSize: size,
      fill,
      fontWeight: weight,
      align: "center" as const,
    });
    const center = (text: Text) => {
      text.anchor.set(0.5);
      return text;
    };
    const topCenter = (text: Text) => {
      text.anchor.set(0.5, 0);
      return text;
    };
    return {
      title: new Text({ text: "LOCKSTEP", style: { ...style(26, COLORS.tapeOn), letterSpacing: 3 } }),
      subtitle: new Text({ text: "", style: style(16, COLORS.textDim, "500") }),
      brief: new Text({ text: "", style: { ...style(13, COLORS.textDim, "400"), wordWrap: true, wordWrapWidth: 170, align: "left" } }),
      gCyclesCap: topCenter(new Text({ text: "", style: style(10, COLORS.brass, "600") })),
      gCyclesVal: topCenter(new Text({ text: "", style: { ...style(22, COLORS.text), fontFamily: MONO } })),
      gAreaCap: topCenter(new Text({ text: "", style: style(10, COLORS.brass, "600") })),
      gAreaVal: topCenter(new Text({ text: "", style: { ...style(22, COLORS.text), fontFamily: MONO } })),
      gTapeCap: topCenter(new Text({ text: "", style: style(10, COLORS.brass, "600") })),
      gTapeVal: topCenter(new Text({ text: "", style: { ...style(22, COLORS.text), fontFamily: MONO } })),
      streak: topCenter(new Text({ text: "", style: style(16, COLORS.amber) })),
      target: topCenter(new Text({
        text: "",
        style: { ...style(13, COLORS.text, "400"), align: "center", lineHeight: 18, wordWrap: true, wordWrapWidth: 176 },
      })),
      controls: center(new Text({ text: "Play", style: style(14, COLORS.text) })),
      step: center(new Text({ text: "Schritt", style: style(14, COLORS.text) })),
      speed: center(new Text({ text: "1×", style: style(14, COLORS.text) })),
      prev: center(new Text({ text: "◀", style: style(16) })),
      next: center(new Text({ text: "▶", style: style(16) })),
      waveCaption: new Text({ text: "Tape", style: { ...style(12, COLORS.textDim, "500"), align: "left" } }),
      best: topCenter(new Text({ text: "", style: style(12, COLORS.textDim, "400") })),
      overlayTitle: center(new Text({ text: "", style: style(28, COLORS.tapeOn) })),
      overlayBody: center(new Text({ text: "", style: style(16, COLORS.text) })),
      overlayRetry: center(new Text({ text: "", style: style(15) })),
      overlayNext: center(new Text({ text: "", style: style(15, COLORS.groove) })),
      pal0: center(new Text({ text: "", style: style(15) })),
      pal1: center(new Text({ text: "", style: style(15) })),
      pal2: center(new Text({ text: "", style: style(15) })),
      pal3: center(new Text({ text: "", style: style(15) })),
    };
  }

  labels.title.position.set(36, 32);
  labels.subtitle.position.set(36, 58);
  labels.brief.anchor.set(0, 0);

  draw();
}

function hitButton(x: number, y: number, bx: number, by: number, bw: number, bh: number): boolean {
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

function lerpAngle(a: number, b: number, t: number): number {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}

function ease(t: number): number {
  return t * t * (3 - 2 * t);
}

function waveformLayout(
  w: number,
  h: number,
  S: number,
): { S: number; x0: number; y0: number; bw: number } {
  return {
    S,
    x0: 360,
    y0: h - 68,
    bw: Math.max(10, (w - 390) / S - 4),
  };
}

function wrap(text: string, width: number): string {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > width) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.join("\n");
}
