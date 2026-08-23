# AGENTS.md

## Cursor Cloud specific instructions

Cinder is a client-only Three.js prototype (Earth + orbital laser). There is no backend, database, or login flow.

After `npm ci` (or `npm install` if `package-lock.json` is missing):

- `npm run dev` — Vite on port 5173 (`host: true`)
- `npm run lint` / `npm test` / `npm run build`

The Vite dev server is a long-running process. Do not start it from install/update scripts. If port 5173 is occupied, stop that process by PID or use `npm run preview` on port 4173 after a build.

Gameplay verification: Earth is a cel-shaded cartoon globe (teal ocean, blob continents, cyan halo) — not a NASA photo. Hold left mouse on the globe to fire the cherry-red laser from the gold/teal UFO. Confirm a tan cartoon crater with an orange core, chunky debris, and the gold HUD meters moving. Right-drag orbits. Audio may be blocked until the first gesture.
