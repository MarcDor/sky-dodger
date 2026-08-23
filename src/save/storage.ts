import { isBetterScore, type Scores } from "../core";

const STORAGE_KEY = "lockstep-prototype-v1";

export interface SaveData {
  completed: string[];
  best: Record<string, Scores>;
}

function emptySave(): SaveData {
  return { completed: [], best: {} };
}

export function loadSave(): SaveData {
  if (typeof localStorage === "undefined") return emptySave();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySave();
    const parsed = JSON.parse(raw) as SaveData;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      best: parsed.best && typeof parsed.best === "object" ? parsed.best : {},
    };
  } catch {
    return emptySave();
  }
}

export function recordSolve(levelId: string, scores: Scores): SaveData {
  const save = loadSave();
  if (!save.completed.includes(levelId)) save.completed.push(levelId);
  const prev = save.best[levelId] ?? null;
  if (isBetterScore(scores, prev)) save.best[levelId] = scores;
  persist(save);
  return save;
}

export function exportSave(): string {
  return JSON.stringify(loadSave());
}

export function importSave(raw: string): SaveData {
  const parsed = JSON.parse(raw) as SaveData;
  if (!parsed || !Array.isArray(parsed.completed)) {
    throw new Error("Ungültiger Save-String");
  }
  persist({
    completed: parsed.completed,
    best: parsed.best && typeof parsed.best === "object" ? parsed.best : {},
  });
  return loadSave();
}

function persist(save: SaveData): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
}
