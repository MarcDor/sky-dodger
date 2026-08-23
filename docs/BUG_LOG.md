# BUG_LOG

| ID | Symptom | Ursache | Status |
| --- | --- | --- | --- |
| B-01 | Punch feuerte nicht, Serie blieb 0 | Tape startete all-off; Spieler musste das Loch extra toggeln | behoben: Platzieren setzt `tape[p]=true`; Wellenform ist klickbar |
| B-02 | Speed-Label las sich als „1× Tape“ | Caption `Tape` saß auf der Tempo-Taste | behoben: Wellenform und Caption nach rechts/oben |
| B-03 | Serie und Ziel überlappten im rechten Panel | `target` war mittig verankert und ragte in die Streak-Zeile | behoben: top-align + wordWrap |
| B-04 | Ghost-Platte auf Slot 0 vor dem Start | `drawWorkpiece` zeichnete immer, auch ohne `run.workpiece` | behoben: nur zeichnen wenn ein Teil existiert |
| B-05 | Overlay „Stabiler Lauf“ ohne lesbaren Text | `gfx.overlay` lag über `gfx.texts` | behoben: Overlay-Labels in eigenem Container darüber |

Keine offenen Laufzeitfehler nach dem zweiten Browser-Lauf (Level 1, Cycles 40 / Area 1 / Tape 8).
