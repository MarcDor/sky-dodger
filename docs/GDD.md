# LOCKSTEP — GDD (Prototyp)

**Stand:** 23. August 2026  
**Scope:** Prototyp laut `docs/LOCKSTEP_BUILD_BLUEPRINT.md` Abschnitt 10, nicht die Vollversion.

Abschnitt 2 des Blueprints ist verbindlich. Hier stehen nur die offenen Entscheidungen aus Abschnitt 9 und die Präzisierungen, ohne die die Simulation nicht eindeutig wäre.

---

## 9. Offene Fragen — Entscheidungen

### Mehrere Stationen an derselben Position

**Entscheidung:** Im Prototyp höchstens eine Station pro Ring-Position. Ein Drop auf einen belegten Slot **ersetzt** die alte Station.

**Begründung:** Einfachste der drei Blueprint-Optionen. Konflikt-Auflösung (Reihenfolge, Fehlerzustand) wäre eine zweite Regel, die der Spieler lernen muss, bevor die Kernregel sitzt. Vollversion kann Konkurrenz wieder öffnen.

### Gleichzeitige Werkstücke

**Entscheidung:** Genau ein Werkstück auf dem Ring. Das nächste startet im Beat **nach** dem Output des vorherigen.

**Begründung:** Blueprint-Vorgabe für den Prototyp. Mehrfach-Durchsatz bleibt Vollversions-Scope.

### Input-Rate vs. S

**Entscheidung:** Output nach genau einer Umdrehung (`S` Beats auf dem Ring). Input-Position = 0. Output-Position ist konzeptionell wieder 0, aber das Werkstück wird **vor** einem zweiten Besuch von Position 0 entladen. `t` läuft global weiter; das nächste Werkstück startet bei fortgesetztem `t`. Wegen `tape[t mod S]` und Position = Beat-Alter bleibt die Ausrichtung zum Tape über alle fünf Erfolgswerkstücke identisch.

---

## Präzisierungen zu Abschnitt 2

### Takt-Reihenfolge in einem Beat

1. Fehlt ein Werkstück und das Level ist nicht gelöst: Spawn an Position 0 mit der Start-Form.
2. `pulse = tape[t mod S]` (wörtlich wie Blueprint 2.2).
3. Station an der Werkstück-Position versucht zu feuern, wenn `pulse` wahr ist.
4. Voraussetzung erfüllt → Transformation. Sonst kein Daten-Effekt, aber ein Fail-Event für die Grafik.
5. Werkstück-Alter um 1 erhöhen. Liegt das Alter bei `S`, Output und Ziel-Vergleich, dann despawn.
6. `t += 1`.

Damit besucht ein Werkstück jede Position genau einmal. Phase = Montageposition: die Station an Slot `p` kommt genau dann an die Reihe, wenn `t mod S === p` (erstes Werkstück) bzw. analog versetzt bei Folge-Werkstücken, die nach vollen Umdrehungen starten.

### Tape und Phasenversatz

Mit einem Werkstück und `S` = Ringlänge fällt `tape[t mod S]` am Slot `p` mit `tape[p]` zusammen. Das ist kein Spec-Bruch, sondern die Konsequenz aus Blueprint 2.1–2.2 plus „ein Werkstück“. Die geteilte Loop bleibt: alle Stationen hören dasselbe Tape; wer wo sitzt, bestimmt die Phase. Spieler-Aktion „Klick auf Ring-Position toggelt Loch“ entspricht genau diesem Array.

`S` ist im Prototyp **pro Level fest** (Level-Feld `S`, zugleich `max. S`). Spieler-gewählte Tape-Länge wäre Vollversion; die Score-Achse „Tape-Länge“ zeigt trotzdem `S`.

### Werkstück-Modell

Blueprint 2.4 mischt `holes += 1` und `holes[last].size`. Kanonisch hier:

```
holes: { size: number }[]
rivets: number
stamped: boolean
```

- Punch: hängt `{ size: 1 }` an.
- Drill: wenn `holes.length >= 1`, `holes[last].size += 1`.
- Rivet: wenn `holes.length >= 2`, `rivets += 1` (Löcher bleiben).
- Stamp: `stamped = true`.

Ziel-Form: `holes` (Anzahl), `rivets`, `stamped`, optional `holeSizes: number[]` für exakte Lochgrößen (Drill-Level). Vergleich ist exakt, kein ≥ außer über explizite `holeSizes`.

### Scoring

- **Cycles:** globaler `t` im Moment des N-ten Erfolg-Outputs (`N = successStreak`, Default 5).
- **Area:** Anzahl Ring-Positionen mit einer Station.
- **Tape-Länge:** `S`.

Anzeige während des Laufs; Bestwerte nach dem Lösen in localStorage.

### Audio

Kein Audio im Prototyp. Kein DoD-Kriterium. Synthese bleibt Vollversion.

### Edit während Play

Jede Änderung an Tape oder Stationen setzt den Lauf zurück. Sonst wären Streak und Cycles nicht mehr dem aktuellen Layout zuzuordnen.
