# LOCKSTEP

Offenes Automations-Puzzle: ein gemeinsames Tape treibt alle Stationen, die Montageposition ist der Phasenversatz.

Prototyp nach `docs/LOCKSTEP_BUILD_BLUEPRINT.md` — TypeScript + PixiJS, Grafik per `Graphics`-API, keine importierten Bilddateien.

## Entwicklung

```bash
npm install
npm run dev
```

Das Spiel läuft unter [http://localhost:5173](http://localhost:5173).

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Vite auf Port 5173 |
| `npm run lint` | ESLint |
| `npm test` | Vitest (Simulation, Scoring, Solvability) |
| `npm run build` | TypeScript-Check + Production-Bundle |
| `npm run preview` | Build auf Port 4173 |

## Steuerung

- Station aus der linken Palette auf einen Ring-Slot ziehen (setzt das Tape-Bit an derselben Position)
- Auf den Ring (innere Nut) oder die Wellenform klicken: Tape-Loch an/aus
- Station vom Ring ziehen: entfernen
- Play / Schritt / Tempo, oder Leertaste, `.` / Pfeil rechts, `1` `2` `3`

## Ordner

- `src/core` — Simulation, pixi-frei
- `src/levels` — Kampagnendaten
- `src/ui` — PixiJS-Darstellung
- `src/save` — localStorage
- `tests/unit` und `tests/solvability`
- `docs/` — Blueprint, GDD, Fortschritt
