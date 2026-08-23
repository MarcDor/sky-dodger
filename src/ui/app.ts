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
import { drawSparks, drawStationGlyph } from "./icons";
import { COLORS, FONT, STATION_META } from "./theme";

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
  );

  const labels = createLabels();
  for (const text of Object.values(labels)) gfx.texts.addChild(text);

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

  function slotAngle(slot: number, S: number): number {
    return -Math.PI / 2 + (slot / S) * Math.PI * 2;
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
    if (dist >= ringR * 0.62 && dist <= ringR * 1.08) return { slot, zone: "tape" };
    if (dist > ringR * 1.08 && dist <= ringR * 1.62) return { slot, zone: "station" };
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
      if (hitButton(e.global.x, e.global.y, x, wave.y0, wave.bw, 36)) {
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
    gfx.bg.rect(0, 0, w, h);
    gfx.bg.fill({ color: COLORS.bg });
    gfx.bg.circle(cx, cy, ringR * 2.4);
    gfx.bg.fill({ color: COLORS.bgLift, alpha: 0.55 });

    gfx.hud.clear();
    drawPanel(gfx.hud, 18, 18, 196, 70);
    drawPanel(gfx.hud, w / 2 - 210, 16, 420, 70);
    drawPanel(gfx.hud, 18, 98, 196, h - 196);
    drawPanel(gfx.hud, w - 214, 98, 196, 280);
    drawPanel(gfx.hud, 18, h - 92, w - 36, 74);

    drawRing(gfx.ring, cx, cy, ringR, level().S, layout.tape, run.t);
    drawStations(cx, cy, ringR);
    drawWorkpiece(cx, cy, ringR);
    drawWave(w, h);
    drawHudText(w, h);
    drawOverlay(w, h);
  }

  function drawRing(g: Graphics, cx: number, cy: number, r: number, S: number, tape: boolean[], t: number): void {
    g.clear();
    g.circle(cx, cy, r + 18);
    g.fill({ color: COLORS.brassLo });
    g.circle(cx, cy, r + 16);
    g.fill({ color: COLORS.brass });
    g.circle(cx, cy, r + 2);
    g.fill({ color: COLORS.brassMid });
    g.circle(cx, cy, r - 10);
    g.fill({ color: COLORS.groove });
    g.ellipse(cx - r * 0.18, cy - r * 0.22, r * 0.55, r * 0.22);
    g.fill({ color: COLORS.brassHi, alpha: 0.13 });

    for (let i = 0; i < S; i += 1) {
      const a0 = slotAngle(i - 0.5, S);
      const a1 = slotAngle(i + 0.5, S);
      const mid = slotAngle(i, S);
      const on = tape[i];
      const inner = r - 4;
      const outer = r + 10;
      g.moveTo(cx + Math.cos(a0) * inner, cy + Math.sin(a0) * inner);
      g.arc(cx, cy, inner, a0, a1, false);
      g.lineTo(cx + Math.cos(a1) * outer, cy + Math.sin(a1) * outer);
      g.arc(cx, cy, outer, a1, a0, true);
      g.closePath();
      g.fill({ color: on ? COLORS.tapeOn : COLORS.tapeOff, alpha: on ? 0.95 : 0.55 });
      if (t % S === i && (run.workpiece || playing)) {
        g.circle(cx + Math.cos(mid) * (r + 3), cy + Math.sin(mid) * (r + 3), 5);
        g.fill({ color: COLORS.amber, alpha: 0.9 });
      }
    }

    g.circle(cx, cy, 36);
    g.fill({ color: COLORS.brassMid });
    g.circle(cx, cy, 28);
    g.fill({ color: COLORS.groove });
    g.ellipse(cx - 6, cy - 8, 14, 7);
    g.fill({ color: COLORS.brassHi, alpha: 0.25 });
  }

  function drawStations(cx: number, cy: number, r: number): void {
    gfx.stations.clear();
    gfx.glyphs.removeChildren();
    gfx.sparks.clear();
    const S = level().S;

    for (let i = 0; i < S; i += 1) {
      const a = slotAngle(i, S);
      const x = cx + Math.cos(a) * (r + 58);
      const y = cy + Math.sin(a) * (r + 58);
      gfx.stations.circle(x, y, 5);
      gfx.stations.fill({ color: COLORS.panelEdge, alpha: 0.7 });
    }

    for (const station of layout.stations) {
      const a = slotAngle(station.position, S);
      const x = cx + Math.cos(a) * (r + 58);
      const y = cy + Math.sin(a) * (r + 58);
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
      gfx.stations.roundRect(x - 28, y - 28, 56, 56, 10);
      gfx.stations.fill({ color: body });
      gfx.stations.roundRect(x - 28, y - 28, 56, 56, 10);
      gfx.stations.stroke({ width: ev?.outcome === "failed" ? 3 : 1.5, color: edge });
      if (!ev) {
        gfx.stations.ellipse(x - 8, y - 12, 16, 7);
        gfx.stations.fill({ color: 0xffffff, alpha: muted ? 0.04 : 0.1 });
      }
      const glyph = new Graphics();
      drawStationGlyph(glyph, station.type, ev?.outcome === "fired" ? COLORS.groove : COLORS.text);
      glyph.position.set(x, y);
      gfx.glyphs.addChild(glyph);
      if (ev?.outcome === "fired") {
        const sparks = new Graphics();
        drawSparks(sparks, station.position + run.t);
        sparks.position.set(x, y);
        gfx.glyphs.addChild(sparks);
      }
    }

    if (drag) {
      const ghost = new Graphics();
      ghost.roundRect(-28, -28, 56, 56, 10);
      ghost.fill({ color: COLORS.amber, alpha: 0.35 });
      drawStationGlyph(ghost, drag.type, COLORS.amberHi);
      ghost.position.set(pointer.x, pointer.y);
      gfx.glyphs.addChild(ghost);
    }
  }

  function drawWorkpiece(cx: number, cy: number, r: number): void {
    gfx.piece.clear();
    const S = level().S;
    const from = slotAngle(prevSlot, S);
    const to = slotAngle(displaySlot, S);
    const a = lerpAngle(from, to, ease(anim));
    const x = cx + Math.cos(a) * (r - 28);
    const y = cy + Math.sin(a) * (r - 28);
    const wp = run.workpiece;
    gfx.piece.roundRect(x - 16, y - 16, 32, 32, 8);
    gfx.piece.fill({ color: COLORS.workpiece });
    gfx.piece.roundRect(x - 16, y - 16, 32, 32, 8);
    gfx.piece.stroke({ width: 2, color: COLORS.brassLo });
    gfx.piece.ellipse(x - 5, y - 7, 10, 5);
    gfx.piece.fill({ color: 0xffffff, alpha: 0.28 });
    if (!wp) return;
    wp.holes.forEach((hole, i) => {
      gfx.piece.circle(x - 8 + i * 10, y + 4, 2 + hole.size);
      gfx.piece.fill({ color: COLORS.groove });
    });
    if (wp.rivets > 0) {
      gfx.piece.roundRect(x - 7, y - 2, 14, 3, 1);
      gfx.piece.fill({ color: COLORS.brass });
    }
    if (wp.stamped) {
      gfx.piece.roundRect(x + 8, y - 10, 6, 6, 1);
      gfx.piece.fill({ color: COLORS.amber });
    }
  }

  function drawWave(w: number, h: number): void {
    gfx.wave.clear();
    const { S, x0, y0, bw } = waveformLayout(w, h, level().S);
    for (let i = 0; i < S; i += 1) {
      const x = x0 + i * (bw + 4);
      const on = layout.tape[i];
      const playhead = run.t % S === i;
      gfx.wave.roundRect(x, y0, bw, 36, 4);
      gfx.wave.fill({ color: on ? COLORS.tapeOn : COLORS.tapeOff });
      if (playhead) {
        gfx.wave.roundRect(x, y0 - 6, bw, 48, 4);
        gfx.wave.stroke({ width: 2, color: COLORS.amber });
      }
    }
  }

  function drawHudText(w: number, h: number): void {
    const lv = level();
    const wp = run.workpiece ?? lv.start;
    labels.title.text = "LOCKSTEP";
    labels.subtitle.text = `${String(levelIndex + 1).padStart(2, "0")}  ${lv.name}`;
    labels.brief.text = wrap(lv.brief, 34);
    labels.brief.position.set(32, 250 + level().availableStations.length * 78);
    labels.scores.text = `CYCLES  ${run.scores.cycles}      AREA  ${run.scores.area}      TAPE  ${run.scores.tapeLength}`;
    labels.scores.position.set(w / 2, 40);
    labels.streak.text = `Serie  ${run.consecutiveSuccesses} / ${lv.successStreak}`;
    labels.streak.position.set(w - 116, 128);
    labels.target.text = `Ziel\n${describeTarget(lv.target)}\n\nJetzt\n${describeWorkpiece(wp)}`;
    labels.target.position.set(w - 116, 168);
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
    labels.waveCaption.position.set(318, h - 78);
    labels.best.text = save.best[lv.id]
      ? `Best  C${save.best[lv.id].cycles} · A${save.best[lv.id].area}`
      : save.completed.includes(lv.id)
        ? "Gelöst"
        : "Ungelöst";
    labels.best.position.set(w - 116, 348);

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
      gfx.hud.roundRect(item.x, item.y, item.w, item.h, 10);
      gfx.hud.fill({ color: COLORS.panel });
      gfx.hud.roundRect(item.x, item.y, item.w, item.h, 10);
      gfx.hud.stroke({ width: 1, color: COLORS.panelEdge });
      const icon = new Graphics();
      icon.roundRect(-20, -20, 40, 40, 8);
      icon.fill({ color: COLORS.slateLo });
      drawStationGlyph(icon, item.type, COLORS.text);
      icon.position.set(item.x + 36, item.y + 33);
      gfx.glyphs.addChild(icon);
    }

    gfx.hud.roundRect(28, h - 78, 88, 36, 8);
    gfx.hud.fill({ color: playing ? COLORS.amber : COLORS.slateLo });
    gfx.hud.roundRect(126, h - 78, 88, 36, 8);
    gfx.hud.fill({ color: COLORS.slateLo });
    gfx.hud.roundRect(224, h - 78, 88, 36, 8);
    gfx.hud.fill({ color: COLORS.slateLo });
    gfx.hud.roundRect(w - 168, 22, 64, 32, 8);
    gfx.hud.fill({ color: COLORS.slateLo });
    gfx.hud.roundRect(w - 96, 22, 64, 32, 8);
    gfx.hud.fill({ color: COLORS.slateLo });
  }

  function drawOverlay(w: number, h: number): void {
    gfx.overlay.clear();
    labels.overlayTitle.visible = overlayOpen;
    labels.overlayBody.visible = overlayOpen;
    labels.overlayRetry.visible = overlayOpen;
    labels.overlayNext.visible = overlayOpen;
    if (!overlayOpen) return;
    gfx.overlay.rect(0, 0, w, h);
    gfx.overlay.fill({ color: 0x000000, alpha: 0.55 });
    gfx.overlay.roundRect(w * 0.5 - 240, h * 0.5 - 140, 480, 280, 16);
    gfx.overlay.fill({ color: COLORS.panel });
    gfx.overlay.roundRect(w * 0.5 - 240, h * 0.5 - 140, 480, 280, 16);
    gfx.overlay.stroke({ width: 2, color: COLORS.brass });
    labels.overlayTitle.text = "Stabiler Lauf";
    labels.overlayTitle.position.set(w * 0.5, h * 0.5 - 96);
    labels.overlayBody.text = `Cycles ${run.scores.cycles}   ·   Area ${run.scores.area}   ·   Tape ${run.scores.tapeLength}`;
    labels.overlayBody.position.set(w * 0.5, h * 0.5 - 36);
    gfx.overlay.roundRect(w * 0.5 - 160, h * 0.62, 140, 44, 8);
    gfx.overlay.fill({ color: COLORS.slateLo });
    gfx.overlay.roundRect(w * 0.5 + 20, h * 0.62, 140, 44, 8);
    gfx.overlay.fill({ color: COLORS.amber });
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
    return {
      title: new Text({ text: "LOCKSTEP", style: { ...style(26, COLORS.tapeOn), letterSpacing: 3 } }),
      subtitle: new Text({ text: "", style: style(16, COLORS.textDim, "500") }),
      brief: new Text({ text: "", style: { ...style(13, COLORS.textDim, "400"), wordWrap: true, wordWrapWidth: 170, align: "left" } }),
      scores: center(new Text({ text: "", style: style(16, COLORS.text) })),
      streak: center(new Text({ text: "", style: style(16, COLORS.amber) })),
      target: center(new Text({ text: "", style: { ...style(13, COLORS.text, "400"), align: "center", lineHeight: 20 } })),
      controls: center(new Text({ text: "Play", style: style(14, COLORS.text) })),
      step: center(new Text({ text: "Schritt", style: style(14, COLORS.text) })),
      speed: center(new Text({ text: "1×", style: style(14, COLORS.text) })),
      prev: center(new Text({ text: "◀", style: style(16) })),
      next: center(new Text({ text: "▶", style: style(16) })),
      waveCaption: center(new Text({ text: "Tape", style: style(12, COLORS.textDim, "500") })),
      best: center(new Text({ text: "", style: style(12, COLORS.textDim, "400") })),
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

function drawPanel(g: Graphics, x: number, y: number, w: number, h: number): void {
  g.roundRect(x, y, w, h, 14);
  g.fill({ color: COLORS.panel, alpha: 0.92 });
  g.roundRect(x, y, w, h, 14);
  g.stroke({ width: 1, color: COLORS.panelEdge, alpha: 0.9 });
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
    x0: 330,
    y0: h - 70,
    bw: Math.max(10, (w - 360) / S - 4),
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
