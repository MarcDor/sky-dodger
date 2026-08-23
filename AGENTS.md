# AGENTS.md

## Cursor Cloud specific instructions

LOCKSTEP is a client-only PixiJS puzzle. There is no backend, database, or login flow.

After `npm ci` (or `npm install` if `package-lock.json` is missing), the useful commands are in `README.md` and `package.json`:

- `npm run dev` — Vite on port 5173 (`host: true`, so it binds on all interfaces)
- `npm run lint` / `npm test` / `npm run build`

The Vite dev server is a long-running process. Do not start it from install/update scripts. If a previous session left port 5173 occupied, stop that process or use `npm run preview` on port 4173 after a build.

Gameplay verification: open level 1, drag Punch onto a ring slot, click the matching tape notch so it lights, press Play, confirm the workpiece is punched and the streak counts to 5, then reach the solve overlay. Audio is not part of the prototype.
