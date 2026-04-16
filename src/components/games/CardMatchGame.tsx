import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, RotateCcw, Play } from "lucide-react";
import { loadBestScores, maybeUpdateBest, shuffle } from "@/lib/memoryGames";

const EMOJIS = ["🍎", "🚲", "💡", "🌊", "🎸", "🔺", "📓", "🦋"]; // 8 pairs => 16 cards

interface Card {
  id: number;
  emoji: string;
  matched: boolean;
}

export function CardMatchGame() {
  const { t } = useI18n();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]); // ids currently shown
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [finishedTime, setFinishedTime] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState(false);
  const lockRef = useRef(false);

  const best = loadBestScores().cardMatch;

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
      const t = Date.now();
      setFinishedTime(t);
      const moves_ = moves;
      const time = Math.floor((t - startedAt) / 1000);
      const replaced = maybeUpdateBest(
        "cardMatch",
        (prev) => !prev || moves_ < prev.moves || (moves_ === prev.moves && time < prev.timeSec),
        { moves: moves_, timeSec: time },
      );
      setNewRecord(replaced);
    }
  }, [allMatched, startedAt, finishedTime, moves]);

  const start = () => {
    const deck: Card[] = shuffle(
      [...EMOJIS, ...EMOJIS].map((emoji, i) => ({ id: i, emoji, matched: false })),
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

    const nextFlipped = [...flipped, id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [aId, bId] = nextFlipped;
      const a = cards.find((c) => c.id === aId)!;
      const b = cards.find((c) => c.id === bId)!;
      if (a.emoji === b.emoji) {
        // Match
        window.setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === aId || c.id === bId ? { ...c, matched: true } : c)),
          );
          setFlipped([]);
        }, 400);
      } else {
        lockRef.current = true;
        window.setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 800);
      }
    }
  };

  if (cards.length === 0) {
    return (
      <div className="space-y-3">
        {best && (
          <div className="flex items-center gap-2 text-xs font-bold text-[hsl(var(--warning))]">
            <Trophy className="h-3.5 w-3.5" fill="currentColor" />
            <span>
              {t("gameBest")}: {best.moves} {t("gameMoves")} · {best.timeSec}s
            </span>
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

      <div className="grid grid-cols-4 gap-2">
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
          <Button onClick={start} size="sm" className="w-full rounded-xl font-bold mt-1">
            <RotateCcw className="h-4 w-4 mr-1" />
            {t("tipsTryAgain")}
          </Button>
        </div>
      )}
    </div>
  );
}
