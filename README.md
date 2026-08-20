# Sky Dodger

Kawaii-Doodle-Arcade im Browser: weiche den fallenden Wolken, Sternen und Tropfen aus, so lange du kannst.

Gebaut mit **Phaser 3** (3.90). Kein Backend nötig — `index.html` ist der Einstiegspunkt.

## Entwicklung

```bash
npm install
npm run dev
```

Das Spiel läuft unter [http://localhost:5173](http://localhost:5173). Vite liefert Hot Reload.

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | lokaler Dev-Server |
| `npm run lint` | ESLint |
| `npm test` | Vitest (Schwierigkeit, Kollision, Score) |
| `npm run build` | TypeScript-Check + Production-Bundle |

## Steuerung

- Desktop: Pfeiltaste links / rechts
- Mobile: Finger auf dem Bildschirm halten und ziehen
- Start und Neustart: Tippen oder Klicken irgendwo, oder den Kenney-Button

## Ordner

- `src/` — Spiellogik, Szenen, UI-Helfer
- `assets/` — eigene SVGs und ausgewählte Kenney-Dateien (siehe `ASSETS.md`)
- `index.html` — HTML-Einstieg

## Lizenz der Third-Party-Grafiken

Kenney-Packs stehen unter CC0. Details in `ASSETS.md`.
