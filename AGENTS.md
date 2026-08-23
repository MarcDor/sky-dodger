# AGENTS.md

## Cursor Cloud specific instructions

Cinder is a client-only PixiJS 2D incremental (flat cartoon Earth, auto-firing UFOs). There is no backend, database, or login flow.

After `npm ci` (or `npm install` if `package-lock.json` is missing):

- `npm run dev` — Vite on port 5173 (`host: true`)
- `npm run lint` / `npm test` / `npm run build`

The Vite dev server is a long-running process. Do not start it from install/update scripts. If port 5173 is occupied, stop that process by PID or use `npm run preview` on port 4173 after a build.

Gameplay verification: a flat poster Earth sits in the center (teal disc, green circle-continents, thick ink outline). At least one UFO orbits and fires a red laser by itself. Gold ticks up. Click **UFO holen** to spawn another shooter. Craters appear as brown/orange bites. Audio may be blocked until the first gesture.
