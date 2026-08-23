# BLUEPRINT_FEEDBACK — LOCKSTEP_BUILD_BLUEPRINT v1.0

Format: Befund, Schwere, Vorschlag. Das Blueprint ist neu und wurde hier zum ersten Mal gebaut.

## Was getragen hat

- Abschnitt 2 ist als Spezifikation brauchbar genug, um eine tickbare Simulation ohne Raten der Kernregel zu schreiben.
- Prototyp vs. Vollversion (Abschnitt 10) verhindert Scope-Creep.
- Solvability statt Playtime-Bot ist die richtige Teststrategie für ein Logik-Puzzle.
- Grafik-Korrektur (Vektor statt Pixel-Art) passt zum Thema und zu PixiJS.

## Befunde

### B1 — Tape-Index und „an dieser Position“ sind mehrdeutig

**Schwere:** hoch (Implementierung)

Abschnitt 2.2 sagt: Station feuert wenn Werkstück an ihrer Position **und** `tape[t mod S]` an dieser Position true ist. `tape[t mod S]` ist ein Zeitindex, „an dieser Position“ klingt nach Raumindex `tape[p]`.

Mit Prototyp-Regeln (ein Werkstück, Spawn bei t-Vielfachen von S, Position = Alter) fallen beide Lesarten zusammen: am Slot `p` gilt `t mod S === p`. Das ist zufällig sauber, aber nicht ausgeschrieben. Sobald mehrere Werkstücke oder ein frei gewähltes S kommen, divergieren die Lesarten.

**Vorschlag:** Eine Zeile mit der kanonischen Formel, z. B. `fires = workpiece.pos == p && tape[t % S]`. Phasenversatz als Satz: „Die Station an p kommt genau in den Beats an die Reihe, in denen das Werkstück bei p ist.“

### B2 — Punch/Drill-Datenmodell widerspricht sich

**Schwere:** mittel

2.4: Punch macht `holes += 1` (Zahl), Drill macht `holes[last].size += 1` (Array). 2.3 erlaubt beides. Ohne Festlegung sind Drill-Level nicht testbar („exakte Ziel-Form“).

**Vorschlag:** Im Blueprint das Array-Modell kanonisch machen und Ziel-Formen mit optionalem `holeSizes` zeigen.

### B3 — Tape-Länge als Score, S aber Level-Konstante

**Schwere:** mittel (Design)

2.6 belohnt kleines S. Level-Definitionen haben `max. S`. Im Prototyp ist S fest — die Achse ist dann keine Spielerentscheidung, nur ein Level-Label.

**Vorschlag:** Entweder „S im Prototyp fest, Score trotzdem anzeigen“ explizit schreiben (so gebaut) oder einen S-Stepper schon im Prototyp verlangen.

### B4 — Referenzbild fehlte

**Schwere:** mittel (Grafik)

`lockstep_polished_mockup.png` war nicht im Projekt-Root und nicht im Upload. Palette und Zustände aus §3 waren trotzdem umsetzbar; „exakt im Stil des Referenzbilds“ ohne Bild nicht wörtlich erfüllbar.

**Vorschlag:** Bild mitliefern oder §3 als einzige Quelle bezeichnen.

### B5 — N=5 macht die erste Verifikation langsam

**Schwere:** niedrig (Test/UX)

Richtwert 5 richtige Teile hintereinander: bei S=8 und 420 ms/Beat ~17 s plus Aufbau. Für Solvability egal, für manuelle DoD-Videos lang.

**Vorschlag:** Tutorial-Level `successStreak: 3` erlauben, Rest bei 5.

### B6 — MASTER_BRIEFING nicht im Repo

**Schwere:** niedrig (Prozess)

Gedächtnis-Dateien und Feedback-Format sollten aus dem Incremental-Blueprint kommen. Die Datei liegt hier nicht. Die `docs/*`-Liste aus Abschnitt 5 wurde trotzdem angelegt; Feedback folgt diesem Dokument.

**Vorschlag:** Den benötigten Abschnitt 10 als Anhang in dieses Blueprint kopieren oder die Datei ins Repo legen.

### B7 — Stations-Konflikt bleibt richtig offen

**Schwere:** niedrig

„Eine Station pro Slot, Drop ersetzt“ ist die einfachste Prototyp-Antwort. Bitte im Blueprint als Default markieren, damit der nächste Lauf nicht wieder von vorn entscheidet.

## Nicht geändert ohne Dokumentation

Keine stillen Abweichungen von Ring/Tape/Feuer-Regel. Abweichungen und Lücken stehen in `docs/GDD.md`.
