# AGENTS.md

## Cursor Cloud specific instructions

Cinder is a client-only Three.js prototype (Earth + orbital laser). There is no backend, database, or login flow.

After `npm ci` (or `npm install` if `package-lock.json` is missing):

- `npm run dev` — Vite on port 5173 (`host: true`)
- `npm run lint` / `npm test` / `npm run build`

The Vite dev server is a long-running process. Do not start it from install/update scripts. If port 5173 is occupied, stop that process by PID or use `npm run preview` on port 4173 after a build.

Gameplay verification: Earth is visible with atmosphere and clouds. Hold left mouse on the globe to fire the laser. Confirm a scorch, then a glowing crater, ejecta, and the HUD heat/crust meters moving. Right-drag orbits. Audio may be blocked until the first gesture.
