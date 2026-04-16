const STORAGE_KEY = "memoryGames.bestScores.v1";

export type GameId = "cardMatch" | "numberSequence" | "memoryPalace";

export interface BestScores {
  cardMatch?: { moves: number; timeSec: number };
  numberSequence?: { level: number };
  memoryPalace?: { score: number; total: number };
}

export function loadBestScores(): BestScores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

export function saveBestScores(scores: BestScores): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    /* noop */
  }
}

/** Update only if new is better. Returns true if replaced. */
export function maybeUpdateBest<K extends GameId>(
  game: K,
  isBetter: (prev: BestScores[K] | undefined) => boolean,
  next: NonNullable<BestScores[K]>,
): boolean {
  const all = loadBestScores();
  if (isBetter(all[game])) {
    all[game] = next;
    saveBestScores(all);
    return true;
  }
  return false;
}

/** Shuffle helper (Fisher-Yates). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
