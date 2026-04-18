import { useEffect, useRef, useState } from "react";
import { Award, Share2, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import {
  loadBestScores,
  MEMORY_GAMES_RESET_EVENT,
  type BestScores,
  type CardMatchDifficulty,
} from "@/lib/memoryGames";
import {
  cardMatchMedal,
  numberSequenceMedal,
  memoryPalaceMedal,
  type MedalTier,
} from "@/lib/medals";
import { Medal } from "@/components/games/Medal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShareableMedalCard } from "@/components/ShareableMedalCard";
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
  t: (k: TranslationKey) => string,
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
  const { toast } = useToast();
  const [scores, setScores] = useState<BestScores>({});
  const [sharing, setSharing] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

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
    const onReset = () => setScores(loadBestScores());
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener(MEMORY_GAMES_RESET_EVENT, onReset);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(MEMORY_GAMES_RESET_EVENT, onReset);
    };
  }, []);

  const entries = buildEntries(scores, t);
  const earnedCount = entries.filter((e) => e.tier !== null).length;
  const goldCount = entries.filter((e) => e.tier === "gold").length;

  const handleShare = async () => {
    if (!shareRef.current || sharing) return;
    setSharing(true);
    try {
      // Wait one frame so any pending paints complete.
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const dataUrl = await toPng(shareRef.current, {
        cacheBust: true,
        pixelRatio: 1, // card is already 1080×1350 native
        backgroundColor: "#1e3a8a",
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "pulse-medals.png", { type: "image/png" });

      // Try Web Share API with file support
      type ShareNavigator = Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
        share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
      };
      const nav = navigator as ShareNavigator;
      if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
        try {
          await nav.share({
            files: [file],
            title: t("medalShareTitle"),
            text: t("medalShareCaption"),
          });
          return;
        } catch (err) {
          // User cancelled — silent. Real errors fall through to download.
          if (err instanceof Error && err.name === "AbortError") return;
        }
      }

      // Fallback: trigger download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "pulse-medals.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: t("medalShareDownloaded") });
    } catch (err) {
      console.error("[MedalShowcase] share failed", err);
      toast({ title: t("medalShareError"), variant: "destructive" });
    } finally {
      setSharing(false);
    }
  };

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
        <>
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

          <Button
            onClick={handleShare}
            disabled={sharing}
            size="sm"
            className="w-full mt-4 rounded-xl font-bold gap-2"
          >
            {sharing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("medalShareGenerating")}
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                {t("medalShareButton")}
              </>
            )}
          </Button>
        </>
      )}

      {/* Off-screen render target for the shareable PNG. */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: -20000,
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <ShareableMedalCard
          ref={shareRef}
          entries={entries}
          earnedCount={earnedCount}
          totalCount={entries.length}
          goldCount={goldCount}
          labels={{
            title: t("medalShowcase"),
            showcaseTitle: t("medalShowcase"),
            locked: t("medalShowcaseLocked"),
            goldsLine: t("medalShareGoldsLine"),
            totalLine: t("medalShareTotalLine"),
            caption: t("medalShareCaption"),
          }}
        />
      </div>
    </div>
  );
}
