import type { CardMatchDifficulty, CardMatchScore } from "@/lib/memoryGames";

export type MedalTier = "gold" | "silver" | "bronze" | null;

export interface MedalInfo {
  tier: MedalTier;
  emoji: string;
  /** Tailwind text-color class using semantic tokens. */
  colorClass: string;
  /** Localized label key for tier name. */
  labelKey: "medalGold" | "medalSilver" | "medalBronze" | "medalNone";
}

const TIER_META: Record<Exclude<MedalTier, null>, Omit<MedalInfo, "tier">> = {
  gold: {
    emoji: "🥇",
    colorClass: "text-[hsl(var(--warning))]",
    labelKey: "medalGold",
  },
  silver: {
    emoji: "🥈",
    colorClass: "text-muted-foreground",
    labelKey: "medalSilver",
  },
  bronze: {
    emoji: "🥉",
    colorClass: "text-[hsl(var(--critical))]",
    labelKey: "medalBronze",
  },
};

export function medalInfo(tier: MedalTier): MedalInfo {
  if (!tier) {
    return { tier: null, emoji: "", colorClass: "text-muted-foreground", labelKey: "medalNone" };
  }
  return { tier, ...TIER_META[tier] };
}

/* ─────── Card Match ─────── */
// Pairs per difficulty (kept in sync with CardMatchGame.DIFFICULTY_PAIRS).
const CARD_MATCH_PAIRS: Record<CardMatchDifficulty, number> = {
  easy: 4,
  medium: 8,
  hard: 12,
};

/**
 * Card match medal: based on moves vs minimum-possible moves (= pairs).
 *  • gold:   moves ≤ pairs * 1.5    (very efficient)
 *  • silver: moves ≤ pairs * 2.0
 *  • bronze: any complete game
 */
export function cardMatchMedal(
  difficulty: CardMatchDifficulty,
  score: CardMatchScore | undefined,
): MedalTier {
  if (!score) return null;
  const pairs = CARD_MATCH_PAIRS[difficulty];
  if (score.moves <= Math.ceil(pairs * 1.5)) return "gold";
  if (score.moves <= Math.ceil(pairs * 2.0)) return "silver";
  return "bronze";
}

/* ─────── Number Sequence ─────── */
/**
 * Number-sequence medal: based on best level reached.
 *  • gold:   level ≥ 10  (12+ digits)
 *  • silver: level ≥ 7   (9+ digits)
 *  • bronze: level ≥ 4   (6+ digits)
 */
export function numberSequenceMedal(level: number | undefined): MedalTier {
  if (!level || level < 4) return null;
  if (level >= 10) return "gold";
  if (level >= 7) return "silver";
  return "bronze";
}

/* ─────── Memory Palace ─────── */
/**
 * Palace medal: based on score / total ratio.
 *  • gold:   100% (perfect)
 *  • silver: ≥ 80%
 *  • bronze: ≥ 60%
 */
export function memoryPalaceMedal(
  score: number | undefined,
  total: number | undefined,
): MedalTier {
  if (!score || !total) return null;
  const ratio = score / total;
  if (ratio >= 1) return "gold";
  if (ratio >= 0.8) return "silver";
  if (ratio >= 0.6) return "bronze";
  return null;
}
