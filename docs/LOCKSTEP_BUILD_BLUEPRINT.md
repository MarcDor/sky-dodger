# LOCKSTEP — Build Blueprint

**Version: v1.0** — Entstanden aus RESEARCH_BRIEFING → RESEARCH_PROPOSAL.md, Konzept "LOCKSTEP" (Idee 2 von 5).

**Status:** Ziel dieses Dokuments ist zunächst ein **funktionierender Prototyp**, kein sofort vollständiges 5-10h-Spiel. Abschnitt 10 definiert explizit, was für den Prototyp reicht und was für die Vollversion noch fehlt. Bau nicht mehr als für die jeweilige Stufe nötig.

**Verhältnis zu anderen Dokumenten:** Dieses Blueprint ersetzt NICHT `MASTER_BRIEFING_incremental_game.md` — das bleibt für Incremental-Games gültig. Übernommen werden hier bewährte, genre-unabhängige Muster daraus (Gedächtnis-System, Agenten-Rollen, Blueprint-Feedback-Protokoll), aber Spielmechanik, Grafikstil und Teststrategie sind komplett neu, weil LOCKSTEP ein offenes Automations-Puzzle ist, kein Idle-Game.

---

## 1. Ziel & Kontext

Aus der Recherche: offenes Automations-Puzzle, Hook = eine geteilte Zeitschleife treibt alle Stationen mit festem Phasenversatz statt individueller Programme pro Station. Zielpreis 4,99, Zielspielzeit 5-10h über eine Kampagne offener Optimierungsaufgaben (~45-70 Level), Reskin-Test bestanden (siehe RESEARCH_PROPOSAL.md, Idee 2 für die volle Begründung — wird hier nicht wiederholt).

**Reale Referenz, kein Zufall:** Das Prinzip entspricht einem echten Fertigungskonzept — einem Rundtakt-/Rundschalttisch (rotary indexing machine): ein Werkstückträger rückt schrittweise weiter, während feste Stationen an unterschiedlichen Positionen jeweils ihren Arbeitsschritt ausführen. Das gibt dem Hook eine intuitive, nachvollziehbare Grundlage, keine willkürliche Abstraktion.

---

## 2. Spielprinzip — formale Spezifikation

Das ist die wichtigste Sektion. Ohne diese Präzisierung bleibt "geteilte Loop mit Phasenversatz" zu vage zum Implementieren.

### 2.1 Der Ring

- Ein Level hat einen Ring mit **S diskreten Positionen** (0 bis S-1), S wird pro Level festgelegt (Richtwert 8-32).
- Ein globaler Takt-Zähler `t` erhöht sich um 1 pro Simulationsschritt ("Beat").
- **Das Tape** ist ein Array der Länge S, jede Position ist `true` (Loch/Puls) oder `false` (kein Loch) — das ist das vom Spieler gestaltete Muster.
- Bei jedem Beat rückt der Ring um genau eine Position weiter (alles, was auf dem Ring liegt, bewegt sich physisch mit).

### 2.2 Stationen

- Eine Station wird vom Spieler an einer **festen Ring-Position** (0 bis S-1) montiert — das ist gleichzeitig ihr Phasenversatz. Physische Position = Phasenversatz sind dieselbe Zahl, keine getrennten Konzepte.
- Eine Station **feuert an Beat t genau dann**, wenn: (a) an ihrer Ring-Position gerade ein Werkstück liegt, UND (b) `tape[t mod S]` an dieser Position `true` ist.
- Mehrere Stationen an derselben Ring-Position sind erlaubt, aber sie konkurrieren um dasselbe Werkstück am selben Beat — das ist eine bewusste Design-Spannung, keine zu verhindernde Ausnahme. Wie genau das aufgelöst wird (Reihenfolge? Konflikt-Fehler?) ist eine offene Frage für die Prototyp-Phase, siehe Abschnitt 9.
- **Mindestens 4 Stationstypen für den Prototyp:** Punch (fügt ein Loch-Merkmal hinzu), Drill (erweitert ein Loch), Rivet (verbindet zwei Merkmale), Stamp (markiert eine Fläche). Jede transformiert das Werkstück deterministisch, siehe 2.4.

### 2.3 Werkstücke

- Ein Werkstück betritt den Ring an einer festen **Input-Position** (Ring-Position 0, o.B.d.A.) mit einer Start-Form aus der Level-Definition.
- Es reitet auf dem Ring (rückt mit jedem Beat eine Position weiter), wird von Stationen transformiert, wenn es an ihnen vorbeikommt UND diese feuern.
- Es verlässt den Ring an einer **Output-Position** (kann = Input-Position nach einer vollen Umdrehung sein, oder früher, je nach Level-Definition).
- **Werkstück-Datenmodell:** eine einfache Liste von Merkmalen (`features: string[]` oder ein kleines strukturiertes Objekt — z. B. `{holes: number, rivets: number, stamped: boolean}`), keine grafische Geometrie nötig für die Logik-Ebene. Rendering ist davon komplett getrennt (siehe Abschnitt 3).

### 2.4 Stations-Transformationen (Minimalkatalog für Prototyp)

| Station | Voraussetzung am Werkstück | Effekt |
|---|---|---|
| Punch | keine | `holes += 1` |
| Drill | `holes >= 1` | vergrößert das letzte Loch (`holes[last].size += 1`) |
| Rivet | `holes >= 2` | verbindet zwei Löcher (`rivets += 1`) |
| Stamp | keine | `stamped = true` |

Trifft ein Werkstück auf eine Station, deren Voraussetzung nicht erfüllt ist: Station feuert NICHT (kein Fehlerzustand, einfach kein Effekt) — das verhindert Softlocks durch Reihenfolgefehler, macht sie aber sichtbar als "das hat nicht geklappt", was der Spieler beim Debuggen seines Layouts sehen muss (siehe Grafik-Spec, Abschnitt 3).

### 2.5 Levelziel & Erfolg

- Eine Level-Definition gibt eine **Ziel-Form** vor (z. B. `{holes: 2, rivets: 1, stamped: true}`).
- Ein Durchlauf gilt als erfolgreich, wenn das Werkstück beim Verlassen des Rings exakt die Ziel-Form hat.
- Ein Level ist gelöst, wenn N aufeinanderfolgende Werkstücke (Richtwert N=5) korrekt verarbeitet werden — nicht nur einmalig, das erzwingt einen wirklich stabilen, wiederholbaren Aufbau statt eines Zufallstreffers.

### 2.6 Scoring (drei Achsen, aus der Recherche übernommen)

- **Cycles:** Beats bis zum N-fachen Erfolg (Abschnitt 2.5) — Geschwindigkeit.
- **Area:** Anzahl belegter Ring-Positionen (wie kompakt ist der Aufbau).
- **Tape-Länge:** S selbst — je kleiner die Schleife, desto besser, das erzwingt Minimalismus im Muster-Design.

Alle drei sind unabhängig optimierbar, nach Lösen freigeschaltet (Zachtronics-Prinzip: erst lösen, dann optimieren, kein Zwang zur perfekten Erstlösung).

---

## 3. Grafik-Spezifikation

**Explizite Korrektur gegenüber dem Incremental-Blueprint:** Die dortige Pixel-Art-Pipeline (32×32, harte Pixelkanten, feste Palette, siehe `MASTER_BRIEFING_incremental_game.md` Abschnitt 2.6/2.7) gilt für LOCKSTEP NICHT. Grund: Diese Stilrichtung wirkt bei unzureichender Detailtiefe leicht "billig"/generisch. Für LOCKSTEP passt ein **sauberer Vektor-/Technik-Look** besser zum Thema und ist unter derselben Pure-Code-Vorgabe umsetzbar — oft sogar einfacher, weil PixiJS' native `Graphics`-API echte Vektorformen zeichnet, kein Pixel-Raster gepflegt werden muss.

**Referenz-Bild:** `lockstep_polished_mockup.png` (im Projekt-Root abzulegen, dient als Kalibrierungs-Zielbild — kein einzuladendes Asset, nur Referenz für den Agenten).

### 3.1 Rendering-Ansatz

- **PixiJS `Graphics`-API direkt zur Laufzeit**, nicht node-canvas/pngjs-Sprites wie im Incremental-Blueprint. Formen (Kreise, abgerundete Rechtecke, Pfade) werden als Vektor gezeichnet, nicht als Bitmap vorgeneriert. Das skaliert sauber bei Zoom (relevant, falls Spieler komplexe Layouts vergrößern wollen) und braucht keine separate Asset-Gen-Pipeline für die Kernformen.
- **Funktionale Verläufe erlaubt, aber sparsam:** ein einfacher linearer Verlauf zur Andeutung von Licht von oben (z. B. auf Stationskörpern, auf dem Ring selbst) ist Teil des Zielstils — das unterscheidet "poliert" von "flach/billig". Kein Bloom, kein Glow-Filter, kein Partikel-Nebel — ein einzelner heller Glanzpunkt (kleine halbtransparente Ellipse) reicht, siehe Referenzbild.
- **Kein hartes Pixel-Rendering, kein `SCALE_MODES.NEAREST`.** Antialiasing ist hier erwünscht (Gegenteil der Vorgabe im Incremental-Blueprint) — `antialias: true` bei `Application.init()`.

### 3.2 Palette (enger, aber nicht auf Retro-Pixel-Zahl begrenzt)

Angelehnt ans Referenzbild: Messing/Bronze (Ring, Grundmetall), Kreideweiß (HUD-Text), Schiefer-Blaugrau (inaktive Stationen), Bernstein/Amber (aktive Station), dunkles Blauschwarz (Hintergrund, Outlines). Kein hartes Limit auf N Farben wie im Pixel-Art-Stil — stattdessen: jede Farbe kommt als 2-3-stufiger Verlauf vor (hell/mittel/dunkel derselben Farbfamilie), keine zusätzlichen, unpassenden Töne.

### 3.3 Was jede Station visuell zeigen muss

- **Ruhezustand:** gedämpfte Farbe (Schiefer-Blaugrau), kein Glanz.
- **Aktiv (feuert gerade):** Farbwechsel zu Amber, kurzer heller Glanzpunkt, 2-3 kleine Linien/Splitter als Funken-Andeutung (siehe Referenzbild) — kein Partikelsystem nötig, ein paar `Graphics.lineTo()`-Striche reichen.
- **Fehlgeschlagen (Voraussetzung nicht erfüllt, siehe 2.4):** eigener, klar unterscheidbarer visueller Zustand nötig (z. B. kurzes Rot-Aufblitzen des Stationsrahmens) — sonst kann der Spieler Layout-Fehler nicht debuggen. Das ist kein optionales Polish-Detail, sondern UI-Notwendigkeit angesichts des Puzzle-Charakters.

### 3.4 HUD

- Wellenform-Readout (das Tape-Muster als Rechteckwelle, siehe Referenzbild) läuft mit dem Takt mit — zeigt dieselbe Information wie der Ring, aber linear statt kreisförmig, hilfreich zum Debuggen des eigenen Musters.
- Cycle-Zähler, aktive Station, laufender Score (alle drei Achsen aus 2.6) sichtbar.

---

## 4. Technischer Stack

- TypeScript + PixiJS (Graphics-API-first, siehe 3.1), kein Backend, kein Server.
- `/src/core` bleibt strikt PixiJS-frei (wie im Incremental-Blueprint) — reine Simulation (Ring, Tape, Stationen, Werkstücke, Tick-Logik), damit Solvability-Checks (Abschnitt 8) headless in Node laufen.
- Level-Definitionen als einfache JSON/TS-Objekte (Input-Form, Ziel-Form, verfügbare Stationstypen, max. S) — keine externe Datenbank.
- Speichern: localStorage, Level-Fortschritt + beste Scores pro Level, Export als String.

---

## 5. Ordnerstruktur

```
/src
  /core        (Ring, Tape, Station-Logik, Werkstück-Transformationen, reine Funktionen)
  /levels      (Level-Definitionen als Daten, keine Logik)
  /ui          (PixiJS Rendering, Graphics-Zeichenfunktionen, HUD, Drag-Interaktion)
  /save        (Fortschritt, Scores, Export/Import)
/tests
  /unit        (Transformations-Logik, Tick-Berechnung, Score-Formeln)
  /solvability (siehe Abschnitt 8 — löst JEDES Level automatisiert, kein Playtime-Bot wie im Incremental-Blueprint)
/docs
  GDD.md, PROGRESS.md, BUG_LOG.md, AGENT_LOG.md, RESUME.md, BACKLOG.md,
  BLUEPRINT_FEEDBACK.md (Format wie in MASTER_BRIEFING_incremental_game.md Abschnitt 10)
```

---

## 6. Content-Progression (Ziel Vollversion, nicht Prototyp)

Aus der Recherche übernommen: Kampagne mit **steigendem Constraint durch neue Stationstypen**, nicht durch eine wachsende Befehlssprache (die Regel selbst — "eine Station feuert bei Puls UND Werkstück" — bleibt über die ganze Kampagne gleich, das hält die Lernkurve fair).

| Phase | Umfang | Neue Elemente |
|---|---|---|
| Einführung | ~8-10 Level | Punch, Drill, Grundregel erklärt anhand einfachster Ziel-Formen |
| Kombinieren | ~15-20 Level | Rivet, Stamp, erste Mehrstationen-Layouts |
| Enge Ringe | ~15-20 Level | kleines S erzwingt Positions-Konflikte, Score-Optimierung relevant |
| Meisterschaft | ~10-15 Level | alle Stationstypen, komplexe Ziel-Formen, freie Score-Jagd |

~45-70 Level gesamt, Richtwert aus der Recherche für 5-10h bei "einfach lösen + etwas optimieren".

---

## 7. UI/Interaktion

- Stationen aus einer Palette per Drag auf eine Ring-Position ziehen (Snapping auf diskrete Positionen, kein Freihand-Platzieren — das Raster IST die Spielmechanik).
- Tape-Muster: Klick auf eine Ring-Position toggelt Loch an/aus.
- Play/Pause/Geschwindigkeit (wie im Diagramm-Beispiel aus dem Chat vorher) zum Testen des eigenen Aufbaus.
- Score-Anzeige nach erfolgreichem Lauf, Vergleich zu bisherigem Bestwert.

---

## 8. Teststrategie — angepasst, kein Playtime-Bot

**Wichtiger Unterschied zum Incremental-Blueprint:** Dort simuliert ein Bot Spielverhalten über Zeit (Abschnitt 6.2, Vorschau-Simulation für Prestige-Timing). Das passt hier nicht — LOCKSTEP ist ein Logik-Puzzle, keine Ressourcen-Optimierung über Zeit. Was stattdessen gebraucht wird:

- **Solvability-Check pro Level (Pflicht vor Freischaltung):** Ein automatisierter Solver (Brute-Force oder einfache Suche über Stations-Platzierungen + Tape-Muster bei kleinem S) muss nachweisen, dass JEDES Level lösbar ist, BEVOR es in die Kampagne aufgenommen wird. Ein unlösbares Level ist ein harter Fehler, kein Balancing-Detail.
- **Kein-Softlock-Check:** Da Stationen bei nicht erfüllter Voraussetzung einfach nicht feuern (2.4), keine Fehlerzustände — das UNIT-testen (kein Crash, kein NaN, egal welche Reihenfolge).
- **Schwierigkeitsgrad-Näherung:** Wo ein Playtime-Bot beim Incremental-Game die Balance prüft, prüft hier die MINIMALE Lösungskomplexität (wie viele Stationen/wie großes S braucht die einfachste gefundene Lösung) als Proxy für Levelschwierigkeit — grob steigend über die Kampagne, nicht exakt, aber als Sanity-Check gegen "Level 5 ist zufällig schwerer als Level 30".

---

## 9. Offene Design-Fragen für die Prototyp-Phase

Ehrlich benannt, nicht vorentschieden — das ist Teil der Aufgabe des ersten Agenten-Laufs, nicht dieses Dokuments:

- Was passiert bei Stations-Konflikt (mehrere Stationen an derselben Position, Abschnitt 2.2)? Fehlerzustand, First-Come-Priorität, oder architektonisch verhindert (nur eine Station pro Position erlaubt, einfachste Lösung für den Prototyp)?
- Wie viele Werkstücke gleichzeitig auf dem Ring erlaubt (nur eins nach dem anderen, oder mehrere versetzt)? Für den Prototyp: ein Werkstück nach dem anderen, N=1 gleichzeitig — Mehrfach-Durchsatz ist Vollversions-Scope.
- Genaue Kollisionsregel zwischen Input-Rate und Ring-Länge S.

---

## 10. Prototyp-Scope vs. Vollversion (DoD, gestaffelt)

### Prototyp (dieser Auftrag)
- [ ] Ring/Tape/Stations-Logik aus Abschnitt 2 vollständig implementiert, unit-getestet
- [ ] Mindestens 4 Stationstypen (2.4) funktionsfähig
- [ ] 5-8 Level spielbar, alle solvability-geprüft (Abschnitt 8)
- [ ] Grafik exakt im Stil aus Abschnitt 3 (Referenzbild), NICHT Pixel-Art, NICHT unpoliert-flach
- [ ] Drag-Platzierung + Tape-Toggle + Play/Pause funktionieren im Browser (echte Verifikation wie im Incremental-Blueprint 6.4, Screenshot/Video-Beleg)
- [ ] Scoring (alle 3 Achsen) sichtbar und korrekt berechnet
- [ ] docs/PROGRESS.md mit Belegspalte (wie Incremental-Blueprint v1.1)

### Vollversion (später, nicht jetzt)
- Volle Kampagne (45-70 Level, Abschnitt 6)
- Alle offenen Fragen aus Abschnitt 9 entschieden und dokumentiert
- Ghost-Replays, Sharing-Export von Lösungen
- Kommerzieller-Anspruch-Test (analog Incremental-Blueprint 2.2c)

---

## 11. Master-Prompt

```
Du baust einen Prototyp von LOCKSTEP nach docs/LOCKSTEP_BUILD_BLUEPRINT.md im
Projektroot. Ziel dieser Session ist Abschnitt 10 "Prototyp", NICHT die
Vollversion — bau nicht mehr als dort gefordert.

Lies zuerst docs/RESUME.md, docs/PROGRESS.md falls vorhanden, sonst starte
als Architekt.

Kritisch: Abschnitt 2 (Spielprinzip) ist die verbindliche Spezifikation -
Ring, Tape, Stationen, Werkstück-Transformationen genau wie dort beschrieben,
keine Abweichung ohne Dokumentation in docs/GDD.md warum.

Kritisch: Abschnitt 3 (Grafik) gilt statt der Pixel-Art-Pipeline aus
MASTER_BRIEFING_incremental_game.md. PixiJS Graphics-API direkt, Antialiasing
an, Verläufe erlaubt, KEIN SCALE_MODES.NEAREST, KEINE 32x32-Pixel-Optik.
Referenzbild lockstep_polished_mockup.png als Kalibrierung nutzen.

Abschnitt 8 (Teststrategie) ersetzt die Playtime-Simulation aus dem
Incremental-Blueprint durch Solvability-Checks pro Level - kein Bot,
der "spielt", sondern ein Solver, der beweist dass ein Level lösbar ist.

Abschnitt 9 sind offene Fragen - triff eine Entscheidung, dokumentiere sie
in docs/GDD.md mit Begründung, bevor du weiterbaust.

Am Ende: docs/PROGRESS.md mit Belegspalte pro DoD-Kriterium aus Abschnitt 10
"Prototyp" (nicht "Vollversion"). Schreibe docs/BLUEPRINT_FEEDBACK.md gemäß
demselben Format wie im Incremental-Blueprint Abschnitt 10, auch für dieses
Dokument - es ist neu und ungetestet, Feedback ist besonders wertvoll.
```
