import { emptyWorkpiece, type LevelDefinition } from "../core";

export const CAMPAIGN: LevelDefinition[] = [
  {
    id: "01-first-pulse",
    name: "Erster Puls",
    brief: "Setze eine Stanze auf den Ring und öffne das Tape-Loch an derselben Position. Fünf gleiche Teile hintereinander.",
    S: 8,
    start: emptyWorkpiece(),
    target: { holes: 1, rivets: 0, stamped: false },
    availableStations: ["punch"],
    successStreak: 5,
  },
  {
    id: "02-two-hits",
    name: "Zwei Schläge",
    brief: "Zwei Stanzen, zwei Löcher im Tape. Reihenfolge auf dem Ring ist die Bearbeitungsreihenfolge.",
    S: 8,
    start: emptyWorkpiece(),
    target: { holes: 2, rivets: 0, stamped: false },
    availableStations: ["punch"],
    successStreak: 5,
  },
  {
    id: "03-widen",
    name: "Aufweiten",
    brief: "Stanze zuerst, dann Bohrer. Der Bohrer braucht ein vorhandenes Loch und vergrößert das letzte.",
    S: 8,
    start: emptyWorkpiece(),
    target: { holes: 1, rivets: 0, stamped: false, holeSizes: [2] },
    availableStations: ["punch", "drill"],
    successStreak: 5,
  },
  {
    id: "04-mark",
    name: "Marke",
    brief: "Nur ein Stempel. Das Tape muss an seiner Phase ein Loch haben, sonst geht der Schlag ins Leere.",
    S: 8,
    start: emptyWorkpiece(),
    target: { holes: 0, rivets: 0, stamped: true },
    availableStations: ["stamp"],
    successStreak: 5,
  },
  {
    id: "05-join",
    name: "Fügen",
    brief: "Zwei Löcher, dann eine Niete. Die Niete zündet nur, wenn schon zwei Löcher da sind — sonst rotes Fehlblinken.",
    S: 10,
    start: emptyWorkpiece(),
    target: { holes: 2, rivets: 1, stamped: false },
    availableStations: ["punch", "rivet"],
    successStreak: 5,
  },
  {
    id: "06-full-plate",
    name: "Komplettplatte",
    brief: "Alle vier Stationen. Ziel: zwei Löcher, das letzte aufgeweitet, eine Niete, gestempelt.",
    S: 12,
    start: emptyWorkpiece(),
    target: { holes: 2, rivets: 1, stamped: true, holeSizes: [1, 2] },
    availableStations: ["punch", "drill", "rivet", "stamp"],
    successStreak: 5,
  },
  {
    id: "07-tight-ring",
    name: "Enger Ring",
    brief: "Dieselbe Komplettplatte, aber S = 8. Weniger Slots, dieselben Schritte — Area und Tape-Länge werden knapp.",
    S: 8,
    start: emptyWorkpiece(),
    target: { holes: 2, rivets: 1, stamped: true, holeSizes: [1, 2] },
    availableStations: ["punch", "drill", "rivet", "stamp"],
    successStreak: 5,
  },
  {
    id: "08-inherited-hole",
    name: "Ererbtes Loch",
    brief: "Das Rohteil kommt schon mit einem Loch. Ergänze, weite das letzte auf, niete, stemple.",
    S: 10,
    start: { holes: [{ size: 1 }], rivets: 0, stamped: false },
    target: { holes: 2, rivets: 1, stamped: true, holeSizes: [1, 2] },
    availableStations: ["punch", "drill", "rivet", "stamp"],
    successStreak: 5,
  },
];

export function levelById(id: string): LevelDefinition | undefined {
  return CAMPAIGN.find((level) => level.id === id);
}

export function nextLevel(id: string): LevelDefinition | undefined {
  const index = CAMPAIGN.findIndex((level) => level.id === id);
  if (index < 0) return undefined;
  return CAMPAIGN[index + 1];
}
