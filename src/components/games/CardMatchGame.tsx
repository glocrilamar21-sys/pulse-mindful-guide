import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, RotateCcw, Play } from "lucide-react";
import {
  loadBestScores,
  maybeUpdateBest,
  shuffle,
  type CardMatchDifficulty,
} from "@/lib/memoryGames";
import { playGameSound } from "@/lib/gameSounds";
import { cardMatchMedal } from "@/lib/medals";
import { Medal } from "@/components/games/Medal";

// 12 unique emojis — enough to support hard mode (12 pairs).
const EMOJI_POOL = [
  "🍎", "🚲", "💡", "🌊", "🎸", "🔺",
  "📓", "🦋", "🌵", "🍕", "🚀", "🎲",
];

const DIFFICULTY_PAIRS: Record<CardMatchDifficulty, number> = {
  easy: 4, // 8 cards
  medium: 8, // 16 cards
  hard: 12, // 24 cards
};

const DIFFICULTY_GRID: Record<CardMatchDifficulty, string> = {
  easy: "grid-cols-4", // 2 rows x 4
  medium: "grid-cols-4", // 4 rows x 4
  hard: "grid-cols-4 sm:grid-cols-6", // 6x4 or 4x6
};

interface Card {
  id: number;
  emoji: string;
  matched: boolean;
}

export function CardMatchGame() {
  const { t } = useI18n();
  const [difficulty, setDifficulty] = useState<CardMatchDifficulty>("medium");
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [finishedTime, setFinishedTime] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState(false);
  const [bestVersion, setBestVersion] = useState(0); // re-read after save
  const lockRef = useRef(false);

  const best = loadBestScores().cardMatch?.[difficulty];

  const allMatched = cards.length > 0 && cards.every((c) => c.matched);
  const elapsedSec = startedAt
    ? Math.floor(((finishedTime ?? now) - startedAt) / 1000)
    : 0;

  // Tick clock while playing
  useEffect(() => {
    if (!startedAt || finishedTime) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [startedAt, finishedTime]);

  // Detect game finish
  useEffect(() => {
    if (allMatched && startedAt && !finishedTime) {
      const finished = Date.now();
      setFinishedTime(finished);
      const moves_ = moves;
      const time = Math.floor((finished - startedAt) / 1000);
      const replaced = maybeUpdateBest(
        "cardMatch",
        (prev) => {
          const current = prev?.[difficulty];
          return (
            !current ||
            moves_ < current.moves ||
            (moves_ === current.moves && time < current.timeSec)
          );
        },
        { ...(loadBestScores().cardMatch ?? {}), [difficulty]: { moves: moves_, timeSec: time } },
      );
      setNewRecord(replaced);
      setBestVersion((v) => v + 1);
      playGameSound("win");
    }
  }, [allMatched, startedAt, finishedTime, moves, difficulty]);

  const start = () => {
    const pairs = DIFFICULTY_PAIRS[difficulty];
    const chosen = shuffle(EMOJI_POOL).slice(0, pairs);
    const deck: Card[] = shuffle(
      [...chosen, ...chosen].map((emoji, i) => ({ id: i, emoji, matched: false })),
    );
    setCards(deck);
    setFlipped([]);
    setMoves(0);
    setStartedAt(Date.now());
    setNow(Date.now());
    setFinishedTime(null);
    setNewRecord(false);
    lockRef.current = false;
  };

  const handleFlip = (id: number) => {
    if (lockRef.current) return;
    if (flipped.includes(id)) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.matched) return;

    playGameSound("flip");

    const nextFlipped = [...flipped, id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [aId, bId] = nextFlipped;
      const a = cards.find((c) => c.id === aId)!;
      const b = cards.find((c) => c.id === bId)!;
      if (a.emoji === b.emoji) {
        window.setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === aId || c.id === bId ? { ...c, matched: true } : c)),
          );
          setFlipped([]);
          playGameSound("match");
        }, 400);
      } else {
        lockRef.current = true;
        window.setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
          playGameSound("wrong");
        }, 800);
      }
    }
  };

  const isPlaying = cards.length > 0;

  const difficultyOptions: { id: CardMatchDifficulty; labelKey: "gameDifficultyEasy" | "gameDifficultyMedium" | "gameDifficultyHard" }[] = [
    { id: "easy", labelKey: "gameDifficultyEasy" },
    { id: "medium", labelKey: "gameDifficultyMedium" },
    { id: "hard", labelKey: "gameDifficultyHard" },
  ];

  if (!isPlaying) {
    return (
      <div className="space-y-3">
        {/* Difficulty selector */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
            {t("gameDifficulty")}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {difficultyOptions.map((opt) => {
              const selected = difficulty === opt.id;
              const cards = DIFFICULTY_PAIRS[opt.id] * 2;
              const allBest = loadBestScores().cardMatch ?? {};
              const optMedal = cardMatchMedal(opt.id, allBest[opt.id]);
              return (
                <button
                  key={opt.id}
                  onClick={() => setDifficulty(opt.id)}
                  className={cn(
                    "relative rounded-xl border-2 px-2 py-2 text-center transition-all active:scale-95",
                    selected
                      ? "bg-primary/15 border-primary text-foreground"
                      : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/70",
                  )}
                >
                  {optMedal && (
                    <span className="absolute -top-1.5 -right-1.5">
                      <Medal tier={optMedal} size="sm" />
                    </span>
                  )}
                  <div className="text-xs font-bold leading-tight">{t(opt.labelKey)}</div>
                  <div className="text-[10px] text-muted-foreground/80 mt-0.5">
                    {cards} {t("gameCards")}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {best && (
          <div className="flex items-center gap-2 text-xs font-bold text-[hsl(var(--warning))]">
            <Trophy className="h-3.5 w-3.5" fill="currentColor" />
            <span className="flex-1">
              {t("gameBest")}: {best.moves} {t("gameMoves")} · {best.timeSec}s
            </span>
            <Medal tier={cardMatchMedal(difficulty, best)} size="md" />
          </div>
        )}
        <Button onClick={start} className="w-full rounded-xl font-bold" size="sm">
          <Play className="h-4 w-4 mr-1" />
          {t("tipsStartExercise")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-muted-foreground">
          {t("gameMoves")}: <span className="text-foreground tabular-nums">{moves}</span>
        </span>
        <span className="text-muted-foreground">
          ⏱ <span className="text-foreground tabular-nums">{elapsedSec}s</span>
        </span>
      </div>

      <div className={cn("grid gap-2", DIFFICULTY_GRID[difficulty])}>
        {cards.map((card) => {
          const isShown = flipped.includes(card.id) || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              disabled={card.matched}
              className={cn(
                "aspect-square rounded-xl text-2xl font-bold flex items-center justify-center transition-all duration-200 cursor-pointer select-none",
                isShown
                  ? card.matched
                    ? "bg-[hsl(var(--success))]/20 border-2 border-[hsl(var(--success))]/50 scale-95"
                    : "bg-primary/15 border-2 border-primary/40"
                  : "bg-muted hover:bg-muted/70 border-2 border-transparent hover:scale-105 active:scale-95",
              )}
            >
              {isShown ? card.emoji : "?"}
            </button>
          );
        })}
      </div>

      {allMatched && (
        <div className="rounded-xl bg-gradient-to-br from-[hsl(var(--success))]/15 to-transparent border border-[hsl(var(--success))]/30 p-3 text-center space-y-2 animate-fade-in">
          <p className="text-sm font-bold text-foreground">
            🎉 {t("gameFinished")}
          </p>
          <p className="text-xs text-muted-foreground">
            {moves} {t("gameMoves")} · {elapsedSec}s
          </p>
          {newRecord && (
            <p className="text-xs font-bold text-[hsl(var(--warning))] flex items-center justify-center gap-1">
              <Trophy className="h-3.5 w-3.5" fill="currentColor" />
              {t("gameNewRecord")}
            </p>
          )}
          <Button
            onClick={() => setCards([])}
            size="sm"
            variant="outline"
            className="w-full rounded-xl font-bold mt-1"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            {t("tipsTryAgain")}
          </Button>
        </div>
      )}
    </div>
  );
}
