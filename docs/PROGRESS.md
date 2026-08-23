# PROGRESS — LOCKSTEP Prototyp

Belegspalte = wie das DoD-Kriterium aus Blueprint Abschnitt 10 nachgewiesen wurde.

| DoD (Prototyp) | Status | Beleg |
| --- | --- | --- |
| Ring/Tape/Stations-Logik aus Abschnitt 2, unit-getestet | grün | `npm test`: 16 Tests (Tick-Reihenfolge, Fail-ohne-Crash, Streak) |
| 4 Stationstypen funktionsfähig | grün | `tests/unit/workpiece.test.ts` |
| 5–8 Level, alle solvability-geprüft | grün | 8 Level; Solver baut Layout und spielt N Erfolge durch |
| Grafik Abschnitt 3 (Vektor, kein Pixel-Art) | grün | Browser: Pixi `Graphics`, Antialias, Messing/Schiefer/Amber; Screenshot `lockstep_level1_empty_start.webp` |
| Drag + Tape-Toggle + Play/Pause im Browser | grün | Video `lockstep_level1_drag_play_solve.mp4`: Stanze auf Slot 2, Tape-Bit geht mit an, 4×, Play |
| Scoring 3 Achsen sichtbar und korrekt | grün | Overlay **Stabiler Lauf**: Cycles 40 · Area 1 · Tape 8 (S=8 × 5 Erfolge). HUD und `tests/unit/scoring.test.ts` |
| Dieses Dokument mit Belegspalte | grün | diese Datei |

Vollversion (45–70 Level, Ghosts, Sharing) ist **nicht** Teil dieses Auftrags.

Playtest-Fixes unterwegs: Tape blieb zuerst all-off; Overlay-Text lag hinter der Fläche. Beides in `docs/BUG_LOG.md`.
