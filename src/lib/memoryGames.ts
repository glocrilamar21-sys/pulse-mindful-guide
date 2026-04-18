const STORAGE_KEY = "memoryGames.bestScores.v1";

export type GameId = "cardMatch" | "numberSequence" | "memoryPalace";

export type CardMatchDifficulty = "easy" | "medium" | "hard";

export interface CardMatchScore {
  moves: number;
  timeSec: number;
}

export interface BestScores {
  /** Best score per difficulty for the card-match game. */
  cardMatch?: Partial<Record<CardMatchDifficulty, CardMatchScore>>;
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

/** Custom event emitted whenever best scores are wiped. */
export const MEMORY_GAMES_RESET_EVENT = "memoryGames:reset";

/** Wipe every memory-game best score. Notifies same-tab listeners via custom event. */
export function clearBestScores(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
  try {
    window.dispatchEvent(new CustomEvent(MEMORY_GAMES_RESET_EVENT));
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
