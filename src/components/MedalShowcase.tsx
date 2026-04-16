import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { loadBestScores, type BestScores, type CardMatchDifficulty } from "@/lib/memoryGames";
import {
  cardMatchMedal,
  numberSequenceMedal,
  memoryPalaceMedal,
  type MedalTier,
} from "@/lib/medals";
import { Medal } from "@/components/games/Medal";
import { cn } from "@/lib/utils";

interface ShowcaseEntry {
  key: string;
  /** Pre-translated title for the row (e.g. "Encuentra las parejas — Medio"). */
  title: string;
  /** Pre-translated best-score text (e.g. "12 movimientos · 45s"). */
  detail: string | null;
  tier: MedalTier;
}

const DIFFICULTIES: CardMatchDifficulty[] = ["easy", "medium", "hard"];

function buildEntries(
  scores: BestScores,
  t: (k: any) => string,
): ShowcaseEntry[] {
  const entries: ShowcaseEntry[] = [];

  // Card match — one row per difficulty
  for (const diff of DIFFICULTIES) {
    const best = scores.cardMatch?.[diff];
    const labelKey =
      diff === "easy"
        ? "gameDifficultyEasy"
        : diff === "medium"
          ? "gameDifficultyMedium"
          : "gameDifficultyHard";
    entries.push({
      key: `cardMatch-${diff}`,
      title: `${t("gameCardMatch")} · ${t(labelKey)}`,
      detail: best ? `${best.moves} ${t("gameMoves")} · ${best.timeSec}s` : null,
      tier: cardMatchMedal(diff, best),
    });
  }

  // Number sequence
  const ns = scores.numberSequence;
  entries.push({
    key: "numberSequence",
    title: t("gameNumberSequence"),
    detail: ns ? `${t("gameLevel")} ${ns.level}` : null,
    tier: numberSequenceMedal(ns?.level),
  });

  // Memory palace
  const mp = scores.memoryPalace;
  entries.push({
    key: "memoryPalace",
    title: t("gameMemoryPalace"),
    detail: mp ? `${mp.score}/${mp.total}` : null,
    tier: memoryPalaceMedal(mp?.score, mp?.total),
  });

  return entries;
}

export function MedalShowcase() {
  const { t } = useI18n();
  const [scores, setScores] = useState<BestScores>({});

  // Re-read scores whenever the tab becomes visible or storage changes (e.g. after a game in another tab).
  useEffect(() => {
    setScores(loadBestScores());
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key.startsWith("memoryGames.")) {
        setScores(loadBestScores());
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") setScores(loadBestScores());
    };
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const entries = buildEntries(scores, t);
  const earnedCount = entries.filter((e) => e.tier !== null).length;
  const goldCount = entries.filter((e) => e.tier === "gold").length;

  return (
    <div className="rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-[hsl(var(--warning))]" />
          <h3 className="text-sm font-bold text-foreground">{t("medalShowcase")}</h3>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
          {earnedCount}/{entries.length}
          {goldCount > 0 && (
            <span className="ml-1 text-[hsl(var(--warning))]">· {goldCount} 🥇</span>
          )}
        </span>
      </div>

      {earnedCount === 0 ? (
        <p className="text-xs text-muted-foreground italic text-center py-3">
          {t("medalShowcaseEmpty")}
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => {
            const earned = entry.tier !== null;
            return (
              <li
                key={entry.key}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors",
                  earned ? "bg-muted/50" : "bg-muted/20 opacity-60",
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {earned ? (
                    <Medal tier={entry.tier} size="md" />
                  ) : (
                    <span className="text-base leading-none opacity-40" aria-hidden>
                      🔒
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{entry.title}</p>
                    <p className="text-[10px] text-muted-foreground tabular-nums">
                      {entry.detail ?? t("medalShowcaseLocked")}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
