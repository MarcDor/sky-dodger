# AGENTS.md

## Cursor Cloud specific instructions

Sky Dodger is a client-only Phaser 3 game. There is no backend, database, or login flow.

After `npm ci` (or `npm install` if `package-lock.json` is missing), the useful commands are in `README.md` and `package.json`:

- `npm run dev` — Vite on port 5173 (`host: true`, so it binds on all interfaces)
- `npm run lint` / `npm test` / `npm run build`

The Vite dev server is a long-running process. Do not start it from install/update scripts. If a previous session left port 5173 occupied, stop that process or use `npm run preview` on port 4173 after a build.

Gameplay verification: open the start screen, click/tap to start, move with arrow keys or pointer drag, confirm the score ticks up, then collide with a falling obstacle to reach Game Over and restart. Audio may be blocked until the first user gesture; that is expected in Chromium.
