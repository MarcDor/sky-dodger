# RESEARCH PROPOSAL — Phase 0: Konzeptwahl

**Stand:** 23. August 2026  
**Phase:** Recherche und Entscheidung, keine Umsetzung  
**Rahmen:** TypeScript + PixiJS, rein prozedurale Grafik per Code, Audio nur synthetisiert oder weggelassen, Zielpreis 2,99–4,99, 5–10 Stunden sinnvoller Inhalt, 60 fps auf Mid-Range-Hardware

Dieses Dokument ist die begründete Auswahl, nicht eine Menükarte. Abschnitt 3 fasst die Marktlage mit Quellen. Abschnitt 5 beschreibt fünf Kandidaten im Pflichtformat. Abschnitt 6 rangiert sie und legt sich fest.

Es existiert keine `GENERATED_GAMES_REGISTRY.md`. Vorherige Titel aus diesem Repository wurden für diese Auswahl nicht herangezogen.

---

## 3. Rechercheergebnisse

Recherche über Steam-Storeseiten, Verkaufs-/Review-Tracker und Indie-Marktanalysen, Stand 23. August 2026. Verkaufszahlen ohne Valve-Transparenz sind Schätzungen Dritter; sie dienen als Größenordnung, nicht als Buchhaltung. Review-Zahlen und Preise stammen soweit möglich von den jeweiligen Store-Seiten.

### 3.1 Was 2025/2026 auf Steam tatsächlich kauft

Chris Zukowski (`How to Market a Game`) wertet quartalsweise Indie-Titel mit **mindestens 1000 Steam-Reviews** aus — ein grober, aber harter Filter für „hat sich verkauft“. Für 2025 Q2 (und Q1-Titel, die erst im Q2 die 1000er-Marke knackten) sind zwei Muster dominant:

1. **Paid Idle / Incremental.** 2022 und 2023 je 3 Idle-Hits über 1000 Reviews, 2024 schon 16, 2025 bis Mitte Jahr bereits 12. Von den Idle-Hits 2025 waren nur 3 kostenlos; die übrigen 9 zahlten im Schnitt **3,89 USD**. Zukowski: Steam-Spieler wollen für Idler bezahlen, es gab kein Race-to-the-bottom trotz viraler Gratis-Clicker. Gleichzeitig schreibt er ausdrücklich, der Boom könne schon vorbei sein.
2. **Tower Defense + City Builder / Colony / Roguelite.** Klassisches „Turm bauen, Gold, upgraden“ (Bloons TD, Kingdom Rush) reicht nicht mehr. Die Titel, die 2025 die 1000er-Marke knacken, mischen Verteidigung mit Stadt, Run-Meta oder Colony. Beispiele im selben Text: Border Pioneer, Nordhold, Drill Core; kurz danach *The King is Watching*.

Zusätzlich, außerhalb dieser zwei Wellen, bleiben **systemische 2D-Spiele mit starkem Moment-zu-Moment** kommerziell belastbar — nur nicht als kurzlebiger Trend, sondern als Evergreen: Transport-Netzwerke, Factory/Automation, Mini-Tactics, offene Optimierungsrätsel, Tile-Laying. Sie sitzen oft bei 8–15 USD, nicht bei 3–5. Genau das ist die Preis-Lücke, in der diese Phase operieren muss.

Quellen:

- [2025 Q2 games that are selling — How to Market a Game](https://howtomarketagame.com/2025/08/04/2025-q2-games-that-are-selling/)
- [Gnomes: Tower Defense, 10 Monate Dev, 367.484 USD Gross](https://howtomarketagame.com/2025/08/13/gnomes-tower-defense-with-10-month-dev-time-hits-367484/)
- [Minami Lane: 6 Monate, 750.000 USD Gross bei 4,99 USD](https://howtomarketagame.com/2024/12/18/minami-lane-6-months-of-development-750k-revenue/)

### 3.2 Genreweise: Belege, nicht Bauchgefühl

#### A. Minimalistische Netzwerk-/Transportsims

| Titel | Preis | Reviews / Score | Signal | Spielzeit |
| --- | --- | --- | --- | --- |
| *Mini Metro* | 9,99 USD (Steam, itch.io); Mobile iOS 3,99 USD, Android 0,99 USD | Steam ~96 % positiv, ~16k Reviews gesamt; itch.io 4,7/5 | SteamPulse: bis ~913k Einheiten, ~6 Mio. USD VGI-Revenue; VORYTHIC ~991k | HowLongToBeat: Main ~6 h, Main+ ~13 h, Completionist ~43 h |
| *Mini Motorways* | 9,99 USD | ~96 % positiv, ~23,7k Reviews | SteamPulse: 500k–1M Owner-Band, Avg. Playtime ~43 h | Evergreen, Bundle mit *Mini Metro* |
| *ISLANDERS* | **4,99 USD** | ~95 % positiv, ~16,7k Reviews | VORYTHIC ~1,1 Mio. Einheiten; Wikipedia: Top-20 New Releases Steam April 2019 | Main ~3,2 h, Completionist ~7 h — **unter** unserem 5–10-h-Ziel |

**Lesart:** Das Genre verkauft, die Grafik *ist* das Produkt (Schemata, Flächen, Linien), und generative Audio ist hier kein Kompromiss, sondern Vorbild (*Mini Metro*, Soundtrack von Disasterpeace, reagiert auf das Netz). Der Preis 4,99 ist durch *ISLANDERS* belegt — aber *ISLANDERS* ist zu kurz für die Vorgabe 5–10 h. *Mini Metro* trifft die Spielzeit, liegt aber doppelt so teuer. Die Lücke: ein Netzwerkspiel mit *Mini-Metro*-Dichte und einem **nicht austauschbaren** Physik-Hook, preislich unter 9,99.

Quellen: [Mini Metro Steam](https://store.steampowered.com/app/287980/Mini_Metro/), [SteamPulse Mini Metro](https://steampulse.org/game/287980), [HowLongToBeat Mini Metro](https://howlongtobeat.com/game/21050), [Mini Metro itch.io](https://dinopoloclub.itch.io/minimetro), [Mini Metro iOS](https://apps.apple.com/us/app/mini-metro/id837860959), [ISLANDERS Steam](https://store.steampowered.com/app/1046030/ISLANDERS/), [VORYTHIC ISLANDERS](https://vorythic.com/games/1069/islanders), [Wikipedia Islanders](https://en.wikipedia.org/wiki/Islanders_(video_game)), [Mini Motorways Steam](https://store.steampowered.com/app/1127500/Mini_Motorways/).

#### B. Factory / Automation (2D, geometrisch)

| Titel | Preis | Reviews / Score | Signal |
| --- | --- | --- | --- |
| *shapez* | Launch 3,99 USD (Juni 2020), später 4,99 / 6,99, heute 9,99 USD | ~96 % positiv, ~15,7k Reviews | Ursprünglich **kostenloses Web-JS-Spiel**; Gamedeveloper: ~1 Mio. USD; Raijin ~326k Steam-Einheiten / ~2,8 Mio. USD; VORYTHIC höher (bis ~919k). Main ~25 h |
| *shapez 2* | 29,99 USD | ~97 % positiv, ~8,7k+ English / ~14,8k gesamt je nach Tracker | Offiziell 700k+ Spieler seit EA; 1.0 am 23. April 2026 |

**Lesart:** Geometrische Automation ist der **beste technische Fit** für „pure code, PixiJS, 60 fps“ — *shapez* selbst ist der Existenzbeweis (JS/WebGL, keine gemalten Sprites, Shapes *sind* der Content). Kommerziell ist die Nische aber von genau diesem Franchise besetzt. Ein *shapez*-Klon bei 4,99 wäre ein Reskin mit schlechterer Discovery. Brauchbar ist Automation nur mit einem **anderen** Kernconstraint als Gürtel + Cutter + Mixer.

Quellen: [shapez Steam](https://store.steampowered.com/app/1318690/shapez/), [Deep dive: Shapez.io web → Steam](https://www.gamedeveloper.com/business/deep-dive-how-shapez-io-went-from-web-game-to-1-million-steam-hit), [shapez 2 Steam](https://store.steampowered.com/app/2162800/shapez_2__Factory/), [shapez2.com](https://shapez2.com/), [Raijin shapez](https://raijin.gg/app/1318690/shapez).

#### C. Offene Optimierungs- / Programmier-Puzzles

| Titel | Preis | Reviews / Score | Spielzeit |
| --- | --- | --- | --- |
| *Opus Magnum* | 19,99 USD | ~97 % positiv, ~6,4k Reviews (Steambase) | Raijin: Avg. ~40 h, Median ~24 h unter Reviewern |
| *Human Resource Machine* | 14,99 USD | ~94 % positiv, ~4,6k Reviews | Kampagne, eine Figur |
| *7 Billion Humans* | 14,99 USD | ~94 % positiv, ~2,1k Reviews | SteamPulse Avg. Playtime ~20 h; 60+ Level |

**Lesart:** Extrem hohe Zufriedenheit, kleineres Publikum als Idle/TD, Preis üblicherweise 15–20 USD. GIF-fähige Maschinen (*Opus Magnum*) sind ein kostenloser Marketingkanal. Content-Dichte kommt aus **offenen** Puzzles (viele gültige Lösungen + Optimierung), nicht aus 200 handgezeichneten Charakteren. Unter 5 USD ist das ein Value-Play gegen Zachtronics/Tomorrow Corporation — aber nur, wenn der Hook nicht „noch ein Visual-Assembler“ ist.

Quellen: [Opus Magnum Steam](https://store.steampowered.com/app/558990/Opus_Magnum/), [Steambase Opus Magnum](https://steambase.io/games/opus-magnum/reviews), [Raijin Opus Magnum Playtime](https://raijin.gg/app/558990/Opus_Magnum/playtime), [HRM Steambase](https://steambase.io/games/human-resource-machine/reviews), [7 Billion Humans Steam](https://store.steampowered.com/app/792100/7_Billion_Humans/).

#### D. Mini-Tactics auf kleinem Grid

| Titel | Preis | Reviews / Score | Signal |
| --- | --- | --- | --- |
| *Into the Breach* | 14,99 USD | ~94 % positiv, ~22k Reviews | Raijin ~463k Steam-Einheiten / ~4,2 Mio. USD; SteamPulse Avg. Playtime ~92 h Lifetime |
| *Slice & Dice* | 8,99 USD | ~96 % positiv, ~1,9k English Reviews | Solide, aber kein Massenhit; Würfel + Party, sehr code-freundliche Optik |

**Lesart:** Kleine Boards, wenige Entities, klares Feedback — PixiJS-ideal, Performance-trivial. Der Qualitätsanker heißt *Into the Breach*. Ein 4,99-Tactics ohne eigenen Zug-Constraint wirkt wie eine billige Kopie. Der Markt belohnt **eine** harte Regel (hier: Stoßen statt HP-Schwamm), nicht Generic-Fantasy-Grid.

Quellen: [Into the Breach Steam](https://store.steampowered.com/app/590380/Into_the_Breach/), [Raijin Into the Breach](https://raijin.gg/app/590380/Into_the_Breach), [Slice & Dice Steam](https://store.steampowered.com/app/1775490/Slice__Dice/).

#### E. Roguelike-Zahlen / Slots / Poker / Plinko (2024–2026)

| Titel | Preis | Reviews / Score | Signal |
| --- | --- | --- | --- |
| *Balatro* | 14,99 USD | ~98 % positiv, ~195–197k Reviews | >5 Mio. Kopien bis Jan 2025 (Wikipedia); Raijin ~4,5 Mio. Steam / ~40 Mio. USD |
| *Luck be a Landlord* | 9,99 USD | ~93 % positiv, ~11,5k Reviews | VORYTHIC ~682k; LocalThunk nannte es größten Einfluss auf *Balatro* |
| *Nubby's Number Factory* | **4,99 USD** | ~97 % positiv, ~19k Reviews | VORYTHIC ~609k; Plinko-Roguelike, Launch März 2025 — **der** 4,99-Beweis 2025 in dieser Familie |
| *Slots & Daggers* | 7,99 USD | ~94 % positiv, ~4,4k English Reviews | Store: 4–8 h Kampagne, Solo-Dev, bewusst kurz |
| *Inventorix* | 4,99 USD | 100 % von 126 Reviews | Preis trifft uns, Volumen nicht — 4,99 allein verkauft nichts |
| *Peglin* | 19,99 USD | ~88 % positiv, >10k English | Pachinko-Roguelike, teurer, gemischtere Recent Reviews |
| *Ballionaire* | ~12 USD | ~85 % positiv, ~1,8k English | Dieselbe Familie, deutlich kleiner |

**Lesart:** Synergie-Roguelikes mit einfachen Symbolen sind grafisch der zweitbeste Fit nach Mini-Metro/shapez. Kommerziell ist die Familie nach *Balatro*/*Nubby* **abgegrast**. *Inventorix* bei exakt 4,99 und 126 Reviews ist die Warnung: „Inventory + Zahlen + 4,99“ ist keine Strategie. Wer hierhin geht, braucht einen Hook, der in 10 Sekunden Trailer nicht wie *Balatro* oder *Nubby* aussieht.

Quellen: [Wikipedia Balatro](https://en.wikipedia.org/wiki/Balatro), [Raijin Balatro](https://raijin.gg/app/2379780/Balatro), [Luck be a Landlord Steam](https://store.steampowered.com/app/1404850/Luck_be_a_Landlord/), [Steambase LBaL](https://steambase.io/games/luck-be-a-landlord/reviews), [Nubby Steam](https://store.steampowered.com/app/3191030/Nubbys_Number_Factory/), [Steambase Nubby](https://steambase.io/games/nubbys-number-factory/reviews), [Slots & Daggers Steam](https://store.steampowered.com/app/3631290/Slots__Daggers/), [Inventorix Steam](https://store.steampowered.com/app/2500460/Inventorix/).

#### F. Survivor-likes / Bullet Heaven

| Titel | Preis | Reviews / Score |
| --- | --- | --- |
| *Vampire Survivors* | 4,99 USD | ~98 % positiv, >260k Reviews (Steambase ~263k) |
| *Brotato* | 4,99 USD | ~96 % positiv, ~30k English / >100k alle Sprachen |
| *Megabonk* | 9,99 USD | ~94 % positiv, ~57k English (Launch Sep 2025) |
| *BALL x PIT* | 14,99 USD | ~95 % positiv, ~26k; Presse: 1 Mio. Kopien in <2 Monaten (Breakout + Survivor + City) |
| *20 Minutes Till Dawn* | 4,99 USD | All-time ~91 %, **Recent Mixed (~51 %)** — Nachbrenner erlischt |

**Lesart:** Der Preis 4,99 ist hier kanonisch, die Nachfrage riesig, die Sättigung ebenso. Performance unter „tausende Entities, pure code, 60 fps konstant“ ist das höchste technische Risiko aller recherchierten Genres. Dazu der Reskin-Test: Setting tauschen, Auto-Attack + XP-Gem + Evolution bleibt. **Als Kandidat verworfen**, nicht weil es keinen Spaß macht, sondern weil Spaß *und* Markt *und* Machbarkeit hier nicht gleichzeitig haltbar sind.

Quellen: [Vampire Survivors Steam](https://store.steampowered.com/app/1794680/Vampire_Survivors/), [Steambase VS Reviews](https://steambase.io/games/vampire-survivors/reviews), [Brotato Steam](https://store.steampowered.com/app/1942280), [Megabonk Steam](https://store.steampowered.com/app/3405340/Megabonk/), [Notebookcheck zu BALL x PIT](https://www.notebookcheck.net/Under-10-One-of-2025-s-biggest-surprise-hits-drops-to-a-new-all-time-low-on-Steam.1364549.0.html), [20 Minutes Till Dawn Steam](https://store.steampowered.com/app/1966900/20_Minutes_Till_Dawn/).

#### G. Tower Defense + Stadt / Roguelite (Welle 2025)

| Titel | Preis | Reviews / Score | Signal |
| --- | --- | --- | --- |
| *The King is Watching* | 14,99 USD | ~89–90 % positiv, ~8–10k Reviews | GamesIndustry.biz: **>500k Kopien** seit Juli 2025 |
| *Gnomes* | 9,99 USD | ~95 % positiv, ~1,7k Reviews | 2 Personen, ~10 Monate, **367.484 USD Gross**, Launch-Wishlists 14,5k, Demo + Next Fest |
| *Border Pioneer* | 14,99 USD | ~87 % positiv, ~1,9k Reviews | Club 250; TD + Frontier-Stadt |
| *Nordhold* | 19,99 USD (häufiger Sale ~11 USD) | ~87 % positiv, ~3,3k Reviews | Datahumble ~72k Einheiten / ~0,8 Mio. USD — trifft, aber nicht King-is-Watching-Skala |
| *Loopstructor* | 6,99 USD | ~82 % positiv, ~339 Reviews | TD + Loops/Fahrzeuge, unter 1000 Reviews — Hybrid allein reicht nicht |
| *Mechanines Tower Defense* | ~6 USD | 94 % von 34 Reviews | Signal: tot |

**Lesart:** Die Welle ist real und verdient Geld. Der erfolgreiche Preis liegt **über** unserem Korridor (10–15 USD). 4,99 gegen 14,99-*King is Watching* signalisiert „kleinerer Klon“, außer der Trailer zeigt in 5 Sekunden eine andere Verteidigungslogik. Art-Erwartung (Gnome, König, Nordics) arbeitet **gegen** pure Code-Grafik. Turn-basiert (*Gnomes*) ist performancetechnisch ungefährlich.

Quellen: [The King is Watching Steam](https://store.steampowered.com/app/2753900/The_King_is_Watching/), [GamesIndustry.biz 500k](https://www.gamesindustry.biz/how-steam-changes-and-a-china-strategy-helped-tinybuilds-the-king-is-watching-hit-500k-sales), [Gnomes Steam](https://store.steampowered.com/app/3133060/Gnomes/), [How to Market a Game: Gnomes](https://howtomarketagame.com/2025/08/13/gnomes-tower-defense-with-10-month-dev-time-hits-367484/), [Border Pioneer Club 250](https://club.steam250.com/app/2346410), [Nordhold Datahumble](https://datahumble.com/nordhold-3028310), [Loopstructor Steam](https://store.steampowered.com/app/2726870/Loopstructor/).

#### H. Paid Idle / Incremental (Welle 2025, unser Preis)

| Titel | Preis | Reviews / Score | Anmerkung |
| --- | --- | --- | --- |
| *Keep on Mining!* | 4,99 USD | ~91 % positiv, ~3,0k English | Launch Jul 2025, kurzes Incremental + Skilltree |
| *Incredicer* | 2,99 USD | ~85 % positiv, ~1,8k English | Launch Nov 2025, Würfel-Idle |
| *Melvor Idle* | 9,99 USD (Sale oft 4,99) | ~92 % positiv, ~8,5k English | Tief, lang, Skill-Geflecht — nicht 5–10 h, sondern Hunderte |
| *Cast n Chill* | 14,99 USD | ~95 % positiv, ~5–8k je nach Tracker | Semi-Idle + **handgemachte Pixel-Kunst als Verkaufsargument**; SteamData.AI ~432k / ~4,5 Mio. USD |

**Lesart:** Der Preis 2,99–4,99 ist hier der *Default*, nicht die Ausnahme. Reviews in den niedrigen Tausendern sind erreichbar. Zwei Probleme für *diese* Phase: (1) Moment-zu-Moment ist oft Warten und Menüs — kollidiert mit „über 5–10 h Spaß, nicht nur Dauer“. (2) Cozy-Idle-Hits wie *Cast n Chill* verkaufen **Art Direction**, die unter Pure-Code verboten ist. Ein Idle ohne räumliche, sichtbare Schleife wäre ein Papiersieg.

Quellen: [Keep on Mining Steam](https://store.steampowered.com/app/3769130/Keep_on_Mining/), [Incredicer Steam](https://store.steampowered.com/app/3929760/Incredicer/), [Melvor Idle Steam](https://store.steampowered.com/app/1267910), [Cast n Chill Steam](https://store.steampowered.com/app/3483740/Cast_n_Chill/), Zukowski Q2 2025 (s. 3.1).

#### I. Tile-Laying / Relaxed Spatial Scoring

| Titel | Preis | Reviews / Score | Spielzeit |
| --- | --- | --- | --- |
| *Dorfromantik* | 13,99 USD | ~96 % positiv, ~29,5k Reviews | SteamPulse Avg. ~125 h Lifetime; Datahumble Avg. ~10,6 h |
| *ISLANDERS* | 4,99 USD | s. Abschnitt A | Zu kurz für 5–10 h ohne Extra-Schicht |
| *Stacklands* | 7,99 USD | ~96 % positiv, ~29k Reviews | Store: 5–7 h; VORYTHIC Main ~6,7 h — trifft die Zeitspanne |

**Lesart:** Räumliches Legen verkauft, wenn das Bild wächst und schön ist. *Dorfromantik* bewirbt ausdrücklich handgemalte Tiles — Nachteil für Pure-Code. *Stacklands* zeigt, dass **Karten als Gebäude** (also Code-Geometrie) 5–7 h und sehr hohe Scores tragen. Ein reines Hex-Legen ohne zeitliche Dynamik fällt durch den Reskin-Test (Wald↔Lava, Mechanik bleibt).

Quellen: [Dorfromantik Steam](https://store.steampowered.com/app/1455840/Dorfromantik/), [SteamPulse Dorfromantik](https://steampulse.org/game/1455840), [Stacklands Steam](https://store.steampowered.com/app/1948280/Stacklands/).

#### J. Hand-authorierte Logik-Kampagnen (Baba, Taiji, Hexcells, Her Trees)

| Titel | Preis | Reviews / Score | Content-Problem |
| --- | --- | --- | --- |
| *Baba Is You* | 14,99 USD | ~97–98 % positiv, ~24k Reviews | 8–20+ h, jedes Level ein Unikat |
| *Taiji* | 24,99 USD | ~93 % positiv, ~1,1k Reviews | Witness-artig, Exploration + handgemachte Regeln |
| *Hexcells Plus* | 2,99 USD | ~95 % positiv, ~2,8k Reviews | 36 Puzzles — zu dünn für 5–10 h allein |
| *HER TREES : PUZZLE DREAM* | 3,99 USD | 98 % positiv, ~1,1k Reviews | SteamPulse bis ~146k Einheiten — 3,99-Puzzle *kann* verkaufen |
| *Proverbs* | 8,99 USD | 97 % positiv, ~1,3k Reviews | Ein riesiges Grid, Dutzende Stunden, aber Picross-Hybrid |
| *Bento Blocks* | 14,99 USD | 97 % von 344 | 180+ **handgemachte** Level + gemalte Art + Live-Musik — Gegenteil unserer Constraints |
| *Outpacked* | 7,99 USD | 93 % von 16 | Zu klein, um daraus Nachfrage abzuleiten |

**Lesart:** Puzzle-Kampagnen haben exzellente Scores und bei *Her Trees* sogar Volumen bei 3,99. Content-Dichte unter Pure-Code skaliert hier **schlecht**: jedes gute Baba-/Witness-Level ist Designarbeit, prozedurale Generatoren für *interessante* Logikrätsel sind ein eigenes Forschungsfeld und scheitern oft an Langeweile. Deshalb kein Kandidat in Abschnitt 5, obwohl der Markt nicht tot ist.

Quellen: [Baba Is You Steam](https://store.steampowered.com/app/736260/Baba_Is_You/), [Taiji Steam](https://store.steampowered.com/app/1141580/Taiji/), [Hexcells Plus Steam](https://store.steampowered.com/app/271900/Hexcells_Plus/), [SteamPulse HER TREES](https://steampulse.org/game/3300800), [Proverbs Steam](https://store.steampowered.com/app/3083300/Proverbs/), [Bento Blocks Steam](https://store.steampowered.com/app/3311670/Bento_Blocks/).

### 3.3 Technische Machbarkeit unter den Rahmenbedingungen

PixiJS ist ein 2D-Renderer. Das schließt 3D-Factory (*shapez 2*, Satisfactory), 3D-Action und alles, was Unity/Godot braucht, aus. Es schließt **nicht** Factory, Tactics, Netzwerke, Karten oder TD aus.

**Pure Code als Vorteil, nicht als Makel**, wenn die Grafik Schema/Geometrie/UI *ist*:

- *Mini Metro* / *Mini Motorways*: Linien, Flächen, Piktogramme
- *shapez*: Formen sind der Spielinhalt; Ursprung als Web-JS-Titel
- *Opus Magnum*, *HRM*: Maschinen und Blöcke
- *Into the Breach*: 8×8, wenige Units
- *Luck be a Landlord* / *Nubby*: Symbole, Pegs, Zahlen

**Pure Code als Nachteil**, wenn der Markt Art kauft:

- *Cast n Chill*, *Minami Lane*, *Dorfromantik*, *Bento Blocks*

**Performance-Risiken (Auswahlkriterium, nicht späteres Optimieren):**

- Hoch: Survivor-likes, Falling-Sand, naive Fluid-Partikel, ungebatchte Einzel-Sprites für Horden
- Mittel: große Gürtelfactories (machbar, *shapez* hat es in JS gezeigt; braucht Batching/Instancing von Anfang an)
- Niedrig: Mini-Metro-Klasse, Grid-Tactics, Turn-based TD, Karten/Würfel, offene Puzzle-Maschinen

**Audio:** Synthese ist hier oft die *bessere* Wahl. *Mini Metro* hat einen reaktiven, generativen Soundtrack. Für Netzwerk-, Maschinen- und Tactics-Schleifen sind Web-Audio-Patterns (Pulse, Filter, Quantizer an Spielfluss gekoppelt) glaubwürdiger als Stille. Stille wäre ein Rückzieher, kein Default.

### 3.4 Content-Dichte: 5–10 Stunden ohne Handmalerei

Was skaliert unter Pure-Code:

- **Systeme + Seeds:** Städte/Karten/Runs (*Mini Metro* 6/13/43 h, *Gnomes*-Runs, Roguelite-Unlocks)
- **Offene Puzzles + Optimierung:** eine Kampagne von ~40–80 Aufgaben, jede mit Speed/Area/Cost-Nachspiel (*Opus Magnum* 24–40 h)
- **Meta-Unlocks über Runs:** *Nubby* Main ~3 h, Main+ ~9 h, Completionist ~24 h — 5–10 h sitzt in der Mitte, wenn Unlocks die Builds wirklich ändern
- **Nicht:** 180 einzigartige handgemachte Puzzle-Level, Dialogbäume, benannte Casts, gemalte Biome

*ISLANDERS* bei 4,99 ist die Falle: der Markt akzeptiert den Preis, die Store-Page sagt selbst „kein Blockbuster mit stundenlangem Content“. Unsere Vorgabe verbietet diese Ausrede.

### 3.5 Wettbewerbslücken (preis- und constraint-scharf)

1. **Netzwerk-Sim mit anderer Physik als Linie/Straße, unter 9,99.** *Mini Metro*/*Motorways* sind 9,99-Evergreens. Darunter existiert *ISLANDERS* (zu kurz, kein Fluss). Niemand etabliertes macht Gravity + Mischung + Flut als *Mini-Metro*-Schleife.
2. **Zachtronics-Tiefe zum Value-Preis**, aber nur mit neuem Constraint (nicht „noch Gürtel“, nicht „noch Assembler“).
3. **Mini-Tactics, dessen Zugregel nicht „Schubsen“ ist.** *Into the Breach* ist 14,99 und der Maßstab; 4,99 ist nur haltbar mit sichtbarer Regel-Identität.
4. **TD-Hybrid unter 10 USD** existiert (*Gnomes* 9,99). 4,99 wäre aggressiv; der Trailer müsste sofort „kein Turm auf Schiene“ zeigen.
5. **Idle bei 3–5 USD ist keine Lücke**, sondern der überfüllte Default. Die Lücke wäre ein Idle, dessen Idle-Zustand eine *sichtbare Maschine* ist, die man gebaut hat — und selbst das überlappt *shapez*/Automation.

Deckbuilder (*Slay the Spire*-Likes), Survivor-likes und Poker/Slot-Roguelikes sind **keine** Lücken.

### 3.6 Vertriebskanal (kurz)

- **Steam** ist der relevante Markt. *Minami Lane*: 750k USD Steam vs. 160 USD itch.io nach Launch. *shapez*: itch.io im Vergleich zu Steam vernachlässigbar; die Web-Demo war der Wishlist-Trichter.
- Zukowski: Hits haben **≥715 Reviews im ersten Monat**; es gibt praktisch keine Late Bloomers. Demo + Next Fest sind bei *Gnomes* und *Minami Lane* Teil des Musters.
- 4,99 USD: *Nubby*, *ISLANDERS*, *Keep on Mining*, *Vampire Survivors*/*Brotato*. Gegenargument aus Pricing-Guides: 4,99 kann billig wirken und der Algorithmus gewichtet Revenue. Deshalb: **oberes Ende des erlaubten Korridors (4,99)**, nicht 2,99, außer das Produkt ist bewusst ein Kurz-Idle.
- Mobile: *Mini Metro* funktioniert dort, aber F2P-Puzzle/TD ist ein anderer, ad-getriebener Markt. Primär Steam, Port später optional.

### 3.7 Bewusst nicht als Kandidaten weitergeführt

- Survivor-likes: Sättigung + Entity-Last + Reskin-Fail
- Generic Idle/Clicker: Markt ja, Spaß-Moment nein, Reskin-Fail
- Baba/Witness-Kampagne: Spaß ja, Content-Skalierung unter Pure-Code nein
- Cozy Management à la *Minami Lane*: 4,99-Hit, aber Art *ist* das Produkt (und *Minami Lane* hat 2–4 h, nicht 5–10)
- 3D, Rhythm mit importierter Musik, Narrative Adventure, Multiplayer-Shooter (Zukowski: Indie-MP-Shooter sterben nach Launch)

---

## 5. Fünf Konzept-Kandidaten

### Idee 1: WEIR

**Genre:** Minimalistische Netzwerk-Simulation / räumliches Echtzeit-Puzzle (Mini-Metro-Familie, nicht Clone)

**Kernkonzept (2–3 Sätze):** Der Spieler formt ein wachsendes Flussdelta. Wasser hat Volumen, Gefälle und zwei nicht mischbare Ladungen (klar / trüb). Siedlungen erscheinen und verlangen eine Sorte; falsche Sorte oder Überlauf ist der Failzustand analog zu überfüllten Stationen in *Mini Metro*. Moment-zu-Moment: Wehre, Schnitte, Umleitungen und Schleusen setzen, Flutpulse kommen in Wellen, das Netz wird laufend umgebaut.

**Hook:** Nicht „zeichne Linien zwischen Knoten“, sondern **Schwerkraft ist Pflicht**. Wasser fließt bergab, staut, überläuft, mischt sich an Kanten. Kapazität ist Physik, kein abstrakter Zähler.  
Reskin-Test: Straße statt Fluss ohne Gefälle/Flut wäre *Mini Motorways* — durchgefallen. Der Hook überlebt nur, solange Gravity + Mischung + Puls **nicht** wegzulassen sind. Setting (Wasser, Lava/Kühlmittel, Blut/Lymphe) darf wechseln, die Hang-Physik nicht.

**Warum diese Preis-/Zeitspanne:**  
5–10 h wie bei *Mini Metro*: eine Handvoll Biome/„Städte“ mit eigenem Relief und Puls-Rhythmus (Main ~6 h), Daily/Score-Jagd und ein Endless ohne Fail (Main+ Richtung 10–13 h). Keine 40-h-Completionist-Pflicht.  
**4,99, nicht 2,99:** *Mini Metro* kostet 9,99; 4,99 ist der *ISLANDERS*-Preis für Mini-Systeme, hier mit mehr Stunden. 2,99 würde „Mobile-Port-Klon“ signalisieren. 4,99 ist das Maximum im erlaubten Band und der richtige Anker.

**Marktbeleg:**

- *Mini Metro* — 9,99 USD, ~96 %, HLTB 6/13/43 h, ~0,9 Mio. Einheiten-Größenordnung. Beweist: Schema-Grafik + Netz-Umbau + generative Audio verkauft und bindet.
- *ISLANDERS* — 4,99 USD, ~95 %, ~1 Mio. Einheiten-Größenordnung, aber nur ~3–7 h. Beweist den Preis, warnt vor zu dünnem Inhalt.
- *Mini Motorways* — 9,99 USD, ~96 %, ~23k Reviews. Dieselbe Familie, Straßen statt Schienen — zeigt, dass der Markt **ein zweites** Physik-Modell (Autos, Stau) akzeptiert, nicht nur Metro.

Das sagt: Die Familie trägt kommerziell und ästhetisch Pure-Code. Die Lücke ist das dritte Modell (Gravity-Fluid) unterhalb von 9,99 mit echter 5–10-h-Dichte.

**Technische Machbarkeit:** PixiJS-natürlich (Polygone, Heights als Farbflächen, Partikel nur als *diskrete* Slugs auf Kanten — kein Navier-Stokes). Entity-Zahl im *Mini-Metro*-Rahmen (Dutzende bis niedrige Hunderte Slugs), 60 fps unkritisch, wenn Fluid **kantenbasiert** bleibt. Risiko: zu realistische Simulation wird langsam *und* unlesbar. Audio: reaktiv an Durchfluss/Überlauf, analog *Mini Metro* — Synthese ist hier die richtige, nicht die Notlösung.

**Was enthalten ist (grob):**

- Höhenkarte + diskretes Kantennetz, Wehre/Schleusen/Schnitte als begrenztes Upgrade-Inventar
- Zwei Ladungen mit Mischungsregel und Flutpulsen
- 8–12 Biome (Relief + Puls-Profil), Normal / Endless / Daily
- Sichtbarer Fail (Überflutung, versalzene Stadt), nicht nur Score-Tod
- Kurzes Meta: freigeschaltete Bau-Teile, die Builds wirklich ändern
- Generative Audio, an Fluss gekoppelt

**Risiko / warum es scheitern könnte:**  
Spieler und Algorithmus taggen es in 3 Sekunden als „Mini-Metro-Klon“. Wenn Gravity im Trailer nicht *sofort* lesbar ist, stirbt die Discovery. Zweites Risiko: Wasser-Sim, die sich wie ein Screensaver anfühlt statt wie eine Serie harter räumlicher Entscheidungen.

---

### Idee 2: LOCKSTEP

**Genre:** Offenes Automations-Puzzle (Zachtronics-nah, nicht Factory-Sandbox)

**Kernkonzept (2–3 Sätze):** Jedes Level ist eine Werkbank mit Inputs, Outputs und frei platzierbaren Stationen. Es gibt **eine** geschlossene Instruktionsloop — eine Nockenwelle / ein gemeinsames Tape. Alle Stationen lesen dieselbe Loop mit festem Phasenversatz. Moment-zu-Moment: Loop schreiben, Versätze wählen, Stationen setzen, abspielen, an Cycle-Count, Fläche und Tape-Länge messen.

**Hook:** Nicht Gürtel (*shapez*) und nicht programmierbare Einzelarme (*Opus Magnum*), sondern **eine gemeinsame Uhr für die ganze Maschine**. Wer die Loop ändert, ändert alles.  
Reskin-Test: Alchemie↔Elektronik↔Küche ist egal; ohne die eine geteilte Loop bleibt nichts. Bestanden.

**Warum diese Preis-/Zeitspanne:**  
Kampagne ~45–70 offene Aufgaben (einfach lösen 4–6 h, Optimieren + Journal/Workshop-Ersatz intern 8–12 h). Genau die 5–10-h-Mitte, plus „ich mach das Level nochmal kleiner“.  
**4,99:** *Opus Magnum* 19,99, *HRM* 14,99. 4,99 ist ein ehrlicher Value-Preis für eine schmalere Kampagne ohne Story-Comic. 2,99 würde die Optimierer-Zielgruppe als Throwaway lesen.

**Marktbeleg:**

- *Opus Magnum* — 19,99 USD, ~97 %, Median ~24 h. Beweist Sucht nach offenen Maschinen + GIF-Sharebarkeit; Publikum kleiner als Idle, aber extrem loyal.
- *Human Resource Machine* — 14,99 USD, ~94 %, ~4,6k Reviews. Visual-Programming als Puzzle verkauft, braucht aber Charakter/Witz, den Pure-Code ersetzen muss (durch die Schönheit der Loop selbst).
- *shapez* — Launch 3,99, heute 9,99, ~96 %. Beweist: geometrische Automation in JS auf Steam. Gleichzeitig die Warnung, nicht denselben Gürtel-Loop zu liefern.

Das sagt: Hohe Chance auf sehr gute Reviews, mittlere Chance auf Volumen. Kommerziell schwächer als Idle/TD, stärker in „das Spiel macht wirklich Spaß und sieht nach Absicht aus“.

**Technische Machbarkeit:** Sehr gut. Wenige Entities, deterministische Ticks, PixiJS zeichnet Blöcke/Nocken. 60 fps trivial. GIFs/WebM der Maschinen sind Marketing. Risiko: UI für Tape-Editing muss in einem Abend begreifbar sein, sonst nur Programmierer-Publikum.

**Was enthalten ist (grob):**

- Eine Loop-Sprache mit hartem, kleinem Befehlssatz
- Stationstypen, die nur über Phasenversatz synchronisiert werden
- Kampagne mit steigendem Constraint (neue Station, nicht neue Sprache)
- Drei Scores: Cycles, Area, Tape-Länge
- Ghost der letzten eigenen Lösung / Referenz-Ghost
- Export kurzer Loops als Loop (Sharing)

**Risiko / warum es scheitern könnte:**  
Nischenpublikum. Steam-Discovery für „Programming Puzzle“ bei 4,99 kann nach *Mini-Metro*- oder Idle-Käufern falsch aussehen und enttäuschen — oder umgekehrt Puzzle-Käufer nicht finden. Außerdem: wenn die Loop sich wie ein schlechtes Assembler-Tutorial anfühlt, ist der Spaß tot.

---

### Idee 3: CAROM

**Genre:** Rundenbasiertes Mini-Tactics (Into-the-Breach-Familie)

**Kernkonzept (2–3 Sätze):** Ein winziges Board. Units laufen nicht: jeder Zug ist ein **Stoß** mit Ricochet an Wänden, Kanten und Gebäuden. Feinde und Ziele sitzen auf demselben Billard. Moment-zu-Moment: Winkel lesen, ein Objekt als Waffe benutzen, Kollateralschäden an den Gebäuden vermeiden, die man schützen soll.

**Hook:** Bewegung = Ballistik. Das Board *ist* die Waffe.  
Reskin-Test: Mechs↔Steine↔Licht — egal, solange Ricochet-Bewegung bleibt. Ohne Bounce ist es Generic-Tactics. Bestanden.

**Warum diese Preis-/Zeitspanne:**  
Wie *Into the Breach* in klein: 2-Insel-Runs à 15–25 Minuten, 4 Squads, Waffen-Unlocks, 5–8 h bis „ich hab die Regel verstanden und die Unlocks gesehen“, 8–10 h mit höherer Schwierigkeit. Kein 90-h-Lifetime.  
**4,99:** *ITB* ist 14,99. 4,99 nur gerechtfertigt, wenn der Scope ehrlich kleiner ist (weniger Squads, weniger Narrative) und die Regel klar der Star ist. 2,99 wäre Mobile-Puzzle-Preis und untergräbt „tactical gem“.

**Marktbeleg:**

- *Into the Breach* — 14,99 USD, ~94 %, ~22k Reviews, Hunderttausende Einheiten. Eine harte Regel (Push, Gebäude schützen) trägt ein ganzes Spiel.
- *Slice & Dice* — 8,99 USD, ~96 %, ~1,9k Reviews. Beweist: karge, code-bare Tactics/Würfel können Overwhelmingly Positive sein, skalieren aber nicht automatisch auf *ITB*-Volumen.
- *Gnomes* — 9,99 USD, ~95 %, 367k USD Gross in Monaten, turn-based Verteidigung. 2025 kauft rundenbasierte, lesbare Konflikte.

Das sagt: Qualitäts- und Spaß-Ceiling hoch, Volumen unsicher, Preis 4,99 nur mit demütigem Scope.

**Technische Machbarkeit:** Ideal. 8×8 bis 12×12, <30 Objekte, PixiJS, 60 fps trivial. Geometrie (Linien, Boxen, Pfeile) *ist* die Lesbarkeit. Audio: trockene Klicks, Abpraller, Gebäude-Riss — Synthese reicht und ist stilistisch richtig. Risiko: Winkel-UI auf Touch/Steam Deck.

**Was enthalten ist (grob):**

- Bounce-Physik auf Grid (keine echte Bullet-Physik)
- 4 Squads mit unterschiedlichen Bounce-Regeln
- Gebäude als Ziele *und* als Bumper
- Kurze Runs, 3 Schwierigkeitsstufen
- Waffen, die Bounce-Gesetz ändern (kleben, doppelter Bounce, durch Wände)
- Replay des letzten Zuges

**Risiko / warum es scheitern könnte:**  
*Into the Breach* ist ein Meisterwerk. Jeder Vergleich fällt hart aus. Wenn Ricochet nach einem Nachmittag gelöst wirkt („immer so zielen“), stirbt die 5–10-h-Spannung. Außerdem: Tactics-Käufer erwarten oft 15 USD-Polish.

---

### Idee 4: HOLDFAST

**Genre:** Turn-based Tower Defense + Geländeformung (2025-TD-Hybrid, nicht Classic-TD)

**Kernkonzept (2–3 Sätze):** Jede Runde wächst die Karte. Gegner pathfinden neu. Der Spieler platziert **keine Türme auf einer Schiene**, sondern formt Terrain: Gräben, Hügel, Engstellen, opferbare Dörfer. Verteidigung ist Geometrie. Zwischen den Wellen ein knappes Dorf-Upkeep (Ernte, ein Gebäude), dann wieder Formung.

**Hook:** Pathfinding *gegen* den Spieler. Die Waffe ist die Landschaft, nicht der DPS-Turm.  
Reskin-Test: Orks↔Goblins↔Roboter ist egal. Wenn man Türme auf fixen Lanes stellt, ist es Bloons und durchgefallen. Geländeformen muss die Identität bleiben.

**Warum diese Preis-/Zeitspanne:**  
Roguelite-Runs 25–40 min, Unlocks über 5–10 h (*Gnomes*-Muster: Relikte, Klassen, Biome).  
**4,99, mit Bauchschmerzen:** Vergleichstitel liegen bei 9,99–14,99. 4,99 kann Discovery helfen (Impulse) oder als „Mini-Gnomes“ gelesen werden. 2,99 wäre Dumping in einer Welle, die 10+ USD trägt. 4,99 nur, wenn der Scope klar kleiner ist als *King is Watching*.

**Marktbeleg:**

- *Gnomes* — 9,99 USD, ~95 %, 2 Dev, 10 Monate, 367k USD Gross, Demo + Next Fest. Turn-based TD + Procgen + Unlocks *funktioniert 2025*.
- *The King is Watching* — 14,99 USD, ~90 %, >500k Kopien. Hybrid Kingdom + Defense ist eine der klarsten Demand-Signale 2025.
- *Loopstructor* — 6,99 USD, ~82 %, ~339 Reviews. Hybrid allein ohne starken Hook und Launch reicht nicht.

Das sagt: Höchste Trend-Nachfrage unter den fünf Ideen, aber Preis- und Art-Mismatch zu unseren Constraints. Erfolg hängt daran, ob „Landschaft statt Turm“ im Trailer sitzt.

**Technische Machbarkeit:** Turn-based = 60 fps unkritisch. Procgen-Karte und einfache Gelände-Meshes passen zu Code-Grafik (Höhenstufen, nicht handgemalte Gnome). Risiko: Lesbarkeit des Pathfindings; und der Markt erwartet Character-Art, die wir nicht liefern. Audio: taktische Hits, synthesefähig, aber ohne OST-Charme von Pixel-Cozy-Hits.

**Was enthalten ist (grob):**

- Runden-Wachstum der Karte, A*-Pathfinding sichtbar
- Terrain-Set (Graben, Wall, Sumpf, Opferfeld)
- 3–4 „Klassen“ als Start-Kits, keine Heldenporträts
- Dorf-Upkeep zwischen Wellen (eine Ressource, keine Voll-City)
- Relikt-Unlocks, 2–3 Biome
- Daily-Karte

**Risiko / warum es scheitern könnte:**  
2025er TD-Hybride sind schon voll. Ohne TinyBuild-China-Strategie (*King is Watching*) und ohne niedliche Art (*Gnomes*) bleibt ein trockenes Strategieschema bei 4,99 in der Empfehlungsliste hinter den 15-USD-Titeln. Zweites Risiko: Formung ohne guten Pathfinding-Debug fühlt sich unfair an.

---

### Idee 5: NEST

**Genre:** Räumliches Incremental / Automation-Idle (nicht Cookie-Clicker)

**Kernkonzept (2–3 Sätze):** Man baut eine kleine, sichtbare Fertigung auf einem Grid. Sie läuft auch, wenn man nicht klickt. Prestige **faltet** die letzte Fabrik in ein einziges Modul zusammen, das in der nächsten Schicht als Blackbox gelegt wird. Moment-zu-Moment im aktiven Spiel: Layout, Staus sehen, umbauen. Idle: die Module ticken. Zahlen steigen, weil Nester Nester enthalten, nicht weil ein Button +1 macht.

**Hook:** Prestige ist räumliche Kompression, nicht ein Reset-Menü. Die History der Läufe liegt als Module auf dem Tisch.  
Reskin-Test: Fabrik↔Labor↔Stadtteil — austauschbar. Ohne Nesting-Prestige ist es *Keep on Mining* mit anderem Skin und durchgefallen. Nesting muss der Star sein.

**Warum diese Preis-/Zeitspanne:**  
Aktive Gestaltung 5–8 h über mehrere Folds, Idle füllt die Lücken — Gefahr, die 5–10 h mit AFK zu *füllen* statt zu *spielen*. Die ehrliche Designpflicht: jeder Fold muss ein neues räumliches Problem öffnen, nicht nur ×1,5 Output.  
**2,99–3,99, eher 3,99:** Das ist Zukowskis Idle-Durchschnitt (~3,89). 4,99 nur, wenn Nesting im Trailer wie ein Gag sitzt (*Nubby*-Niveau). 2,99 ist hier legitim, anders als bei WEIR/CAROM.

**Marktbeleg:**

- Zukowski 2025: Paid Idler knacken 1000 Reviews, Schnitt **3,89 USD**. Stärkstes Preis-Match aller fünf Ideen.
- *Keep on Mining!* — 4,99 USD, ~91 %, ~3k Reviews, Jul 2025. Kurzes Spatial-Idle verkauft.
- *Incredicer* — 2,99 USD, ~85 %, ~1,8k Reviews. Unterkante: Volumen ja, Score weicher.
- Gegenbeleg: *Cast n Chill* 14,99 und *shapez* zeigen, dass *schönes* Idle/Automation mehr verlangt als Zahlen — und Art bzw. Franchise schon da sind.

Das sagt: Höchste kurzfristige Verkaufswahrscheinlichkeit im erlaubten Preisband, niedrigste Garantie, dass 5–10 h sich nach Spiel anfühlen.

**Technische Machbarkeit:** Grid + Module, PixiJS, mäßige Entity-Zahl wenn Blackboxes aggregiert ticken (nicht jede historische Maschine simulieren). 60 fps haltbar mit Aggregaten; ohne Aggregate Performance-Falle. Audio: Loop-Drones und Tick-Akzente, synthesefähig, schnell monoton.

**Was enthalten ist (grob):**

- Kleines Baufeld, sichtbare Staus
- Fold/Prestige → Modul mit In/Out-Kanten
- 4–5 Modul-Generationen mit hartem neuem Constraint je Generation
- Optionaler Idle-Tick mit klarem Cap, damit AFK nicht die Kampagne ersetzt
- Ziel-Rezepte, nicht endloser Sandbox-Leerlauf
- Codex der eigenen Module

**Risiko / warum es scheitern könnte:**  
Idle-Welle kann laut Zukowski schon knicken. Clone-Flood bei 2,99–4,99. Nesting kann sich nach Buchhaltung anfühlen. Und es ist das Konzept, das am ehesten „auf dem Papier Markt, am Tisch langweilig“ erfüllt — also genau der Fehlschlag, den das Briefing verbietet, wenn die räumliche Schicht nicht trägt.

---

## 6. Bewertung und Empfehlung

Skala der Erfolgswahrscheinlichkeit: **begründet über dem Durchschnitt des jeweiligen Segments**, nicht „wird ein Hit“. Niemand kann das garantieren. 1000 Reviews im ersten Monat (Zukowski) bleiben die harte Latte; keines der fünf Konzepte überschreitet sie von allein.

### 6.1 Rangfolge

**1 — WEIR (Netzwerk / Gravity-Fluid)**  
- Nachfrage: belegt durch *Mini Metro*/*Motorways*/*ISLANDERS*, nicht durch die 2025er Idle-Welle, aber evergreen und international (Mobile-Ratings 4,7–4,9).  
- Hook: Gravity + Mischung + Puls, wenn der Trailer das zeigt.  
- Technik: bester Fit neben LOCKSTEP; 60 fps, Pure-Code-Ästhetik *ist* der Look, Audio-Synthese ist Genre-Tradition.  
- Content: 5–10 h über Biome/Modi, ohne 180 Handlevel.  
- Spaß: Umbau unter Druck ist eine der am besten belegten Schleifen der letzten zehn Indie-Jahre.  
Schwäche: Clone-Lesart.

**2 — LOCKSTEP (eine gemeinsame Loop)**  
- Nachfrage: kleiner, dafür Review-Qualität extrem (*Opus Magnum* 97 %).  
- Hook: härtester Reskin-Pass der fünf.  
- Technik: trivial-positiv.  
- Content: offene Puzzles skalieren ehrlich auf 5–10 h.  
- Spaß: für die Zielgruppe sehr hoch; für Steam-Masse ungewiss.  
Schwäche: Volumen, UI-Hürde.

**3 — CAROM (Ricochet-Tactics)**  
- Nachfrage: *ITB*-Prestige, nicht *ITB*-Volumen bei 4,99.  
- Hook: klar, trailerfähig.  
- Technik: ideal.  
- Content: Runs + Unlocks, 5–10 h machbar, Danger of „nach 4 h gelöst“.  
- Spaß: hoch, wenn die Winkel sich wie Witze anfühlen, nicht wie Trigonometrie.  
Schwäche: Qualitätsvergleich mit einem GOTY-Kaliber; Scope/Preis-Spannung.

**4 — HOLDFAST (Terrain-TD)**  
- Nachfrage: **höchste 2025-Welle** (*King is Watching*, *Gnomes*).  
- Hook: real, aber im Trailer leicht als „noch ein TD“ zu verfehlen.  
- Technik: turn-based freundlich; Art-Erwartung unfreundlich zu Pure-Code.  
- Content: Runs, gut.  
- Spaß: hoch bei guter Lesbarkeit.  
Schwäche: Preis 4,99 in einem 10–15-USD-Segment; Sättigung der Hybride; *Loopstructor* als Warnung.

**5 — NEST (räumliches Incremental)**  
- Nachfrage: **bestes Preis-Match**, Idle-Hits 2025.  
- Hook: Nesting rettet den Reskin nur, wenn er sich körperlich anfühlt.  
- Technik: nur mit aggregierten Ticks.  
- Content: 5–10 h leicht zu *behaupten*, schwer ehrlich zu *spielen*.  
- Spaß: unsicher — genau das Kriterium, das Idle so oft nicht besteht.  
Schwäche: Welle, Clones, Langeweile. Trotzdem aufgenommen, weil eine Recherche, die Idle 2025 ignoriert, unehrlich wäre.

### 6.2 Empfehlung

**Ich würde WEIR bauen.**

Begründung in einem Satz: Es ist das einzige Konzept, bei dem **belegte Nachfrage**, **belegter Moment-zu-Moment-Spaß**, **Pure-Code als Vorteil** und **5–10 h ohne Handmalerei** gleichzeitig zutreffen, ohne uns in die zwei gefährlichsten 2025er-Fallen zu schicken (Idle-Langeweile, Survivor-Sättigung/Performance).

Ausgeführt:

- Der Loop ist nicht spekulativ. *Mini Metro* bindet 6–13 h Hauptinhalt bei ~96 % positiv; *Mini Motorways* zeigt, dass ein zweites Physik-Modell in derselben Familie trägt. WEIR ist das dritte Modell, nicht der dritte Anstrich.
- Grafik-Constraint und Genre fallen zusammen. Schema, Höhe, Farbe, Überlauf — das *soll* nach Code aussehen. *Cast n Chill* und *Minami Lane* gewinnen mit Malerei; hier wäre Malerei sogar stilistisch falsch.
- Performance ist eine Designwahl (Kanten-Slugs), kein Hoffnungswert.
- Audio hat ein Vorbild (reaktives *Mini Metro*) und darf/soll synthetisch sein.
- 4,99 USD sitzt unter 9,99-Metro und auf dem bewiesenen *ISLANDERS*-Anker, bei mehr Stunden als *ISLANDERS*. Das ist die Lücke.
- Steam bleibt der Kanal; eine Web-Demo (*shapez*-Lehre) ist späterer Bauphase, nicht jetzt.

**Die zwei stärksten Gegenargumente, die trotzdem nicht die Empfehlung kippen:**

1. **2025 kauft Idle und TD-Hybride, nicht Transport-Puzzle.** Das ist wahr. HOLDFAST oder NEST hätten die bessere *Trend*-Wahrscheinlichkeit. Ich gewichte sie runter, weil das Briefing beides verlangt — Markt *und* Spaß über 5–10 h. Idle erfüllt Markt und gefährdet Spaß. HOLDFAST erfüllt Markt und gefährdet Differenzierung plus Art-Fit. WEIR erfüllt Spaß hart und Markt mittel-hart (Evergreen, nicht Welle). Evergreen plus Lücke schlägt Welle plus Clone-Risiko, wenn wir nur ein Spiel bauen und keinen Trend-Surf als Firma fahren.
2. **„Mini-Metro-Klon“-Tagging kann den Launch töten.** Ebenfalls wahr. Deshalb ist WEIR nur die richtige Wahl, wenn Gravity/Mischung im ersten Trailer-Shot unübersehbar ist. Wenn die Bau-Phase das nicht halten kann, ist LOCKSTEP der saubere Fallback (schwächeres Volumen, klarerer Hook, null Clone-Tag der Metro-Familie).

Selbsteinschätzung: **begründet über dem Durchschnitt** eines 4,99-2D-Indie ohne Publisher — in einer Liga mit „kann 1k Reviews schaffen, wenn Demo und Trailer sitzen“, nicht in einer Liga mit *Nubby*/*King is Watching*. *Nubby* und *VS* zeigen, dass 4,99 explodieren *kann*; *Inventorix* und *Loopstructor* zeigen, dass Preis und Hybrid-Label das nicht erzwingen. WEIR reduziert das Risiko, indem es auf eine Schleife setzt, die schon millionenfach Spaß gemacht hat, und die Differenzierung in Physik legt, nicht in Theme.

### 6.3 Fallback, falls WEIR abgelehnt wird

1. LOCKSTEP — wenn der Anspruch „kein Metro-Schatten“ oder „maximaler Hook-Härtegrad“ gewinnt.  
2. HOLDFAST — wenn bewusst die 2025er-Demand-Welle geritten werden soll und Pure-Code-Look akzeptiert wird.  
Nicht empfohlen als Erstwahl: CAROM (zu nah an einem Meisterwerk), NEST (Markt ohne garantierten Spaß).

---

## Checkpoint

Phase 0 endet hier. Kein Code, keine Architektur, keine Formeln, kein Blueprint. Als Nächstes entscheidet der Mensch (ggf. mit einem anderen Modell), ob WEIR gebaut wird oder einer der anderen vier Kandidaten. Erst danach entsteht ein genre-spezifisches Bau-Blueprint.
