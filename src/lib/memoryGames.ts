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

const VALID_DIFFICULTIES: ReadonlySet<CardMatchDifficulty> = new Set([
  "easy",
  "medium",
  "hard",
]);

function isPositiveInt(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 && Number.isInteger(v);
}

function sanitizeCardMatchScore(v: unknown): CardMatchScore | undefined {
  if (!v || typeof v !== "object") return undefined;
  const s = v as Record<string, unknown>;
  if (isPositiveInt(s.moves) && isPositiveInt(s.timeSec)) {
    return { moves: s.moves, timeSec: s.timeSec };
  }
  return undefined;
}

export function loadBestScores(): BestScores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: BestScores = {};

    // cardMatch: object keyed by difficulty
    const cm = (parsed as Record<string, unknown>).cardMatch;
    if (cm && typeof cm === "object" && !Array.isArray(cm)) {
      const safeCm: NonNullable<BestScores["cardMatch"]> = {};
      for (const [k, v] of Object.entries(cm)) {
        if (VALID_DIFFICULTIES.has(k as CardMatchDifficulty)) {
          const score = sanitizeCardMatchScore(v);
          if (score) safeCm[k as CardMatchDifficulty] = score;
        }
      }
      if (Object.keys(safeCm).length > 0) out.cardMatch = safeCm;
    }

    // numberSequence: { level: number }
    const ns = (parsed as Record<string, unknown>).numberSequence;
    if (ns && typeof ns === "object") {
      const lvl = (ns as Record<string, unknown>).level;
      if (isPositiveInt(lvl)) out.numberSequence = { level: lvl };
    }

    // memoryPalace: { score, total }
    const mp = (parsed as Record<string, unknown>).memoryPalace;
    if (mp && typeof mp === "object") {
      const score = (mp as Record<string, unknown>).score;
      const total = (mp as Record<string, unknown>).total;
      if (isPositiveInt(score) && isPositiveInt(total)) {
        out.memoryPalace = { score, total };
      }
    }

    return out;
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
