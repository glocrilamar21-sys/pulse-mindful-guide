import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, Play, RotateCcw, Eye } from "lucide-react";
import { loadBestScores, maybeUpdateBest } from "@/lib/memoryGames";
import { playGameSound } from "@/lib/gameSounds";
import { numberSequenceMedal } from "@/lib/medals";
import { Medal } from "@/components/games/Medal";
import { fireGoldConfetti } from "@/lib/confetti";

type Phase = "idle" | "showing" | "input" | "lost";

const SHOW_MS_PER_DIGIT = 900;
const FIRST_LEVEL_LENGTH = 3;

function generateSequence(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 10));
}

export function NumberSequenceGame() {
  const { t } = useI18n();
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [shownIndex, setShownIndex] = useState(-1);
  const [input, setInput] = useState<number[]>([]);
  const [newRecord, setNewRecord] = useState(false);
  const timerRef = useRef<number | null>(null);

  const best = loadBestScores().numberSequence;
  const target = FIRST_LEVEL_LENGTH + (level - 1);

  // Show animation
  useEffect(() => {
    if (phase !== "showing") return;
    setShownIndex(0);
    let i = 0;
    timerRef.current = window.setInterval(() => {
      i++;
      if (i >= sequence.length) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        // brief blank then input phase
        window.setTimeout(() => {
          setShownIndex(-1);
          setPhase("input");
          setInput([]);
        }, 400);
      } else {
        setShownIndex(i);
      }
    }, SHOW_MS_PER_DIGIT);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase, sequence]);

  const startLevel = (lvl: number) => {
    const seq = generateSequence(FIRST_LEVEL_LENGTH + (lvl - 1));
    setSequence(seq);
    setLevel(lvl);
    setInput([]);
    setNewRecord(false);
    setPhase("showing");
  };

  const restart = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setLevel(1);
    setSequence([]);
    setInput([]);
    setShownIndex(-1);
    setPhase("idle");
    setNewRecord(false);
  };

  const handleDigit = (d: number) => {
    if (phase !== "input") return;
    const nextInput = [...input, d];
    const idx = nextInput.length - 1;

    if (nextInput[idx] !== sequence[idx]) {
      // Lost
      const reachedLevel = level - 1; // last successful level (this one failed)
      const finalLevel = level; // level where they failed
      const prevBest = loadBestScores().numberSequence;
      const prevMedal = numberSequenceMedal(prevBest?.level);
      const newMedal = numberSequenceMedal(finalLevel);
      const replaced = maybeUpdateBest(
        "numberSequence",
        (prev) => !prev || finalLevel > prev.level,
        { level: finalLevel },
      );
      setNewRecord(replaced);
      setPhase("lost");
      setInput(nextInput);
      playGameSound("wrong");
      // If the reached level earns a medal, play the win flourish too.
      if (newMedal) {
        window.setTimeout(() => playGameSound("win"), 350);
      }
      // Celebrate first time reaching gold.
      if (newMedal === "gold" && prevMedal !== "gold") {
        window.setTimeout(() => fireGoldConfetti(), 400);
      }
      return;
    }

    playGameSound("tap");
    setInput(nextInput);

    if (nextInput.length === sequence.length) {
      // Level passed, advance
      playGameSound("correct");
      window.setTimeout(() => {
        startLevel(level + 1);
      }, 600);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-muted-foreground">
          {t("gameLevel")}: <span className="text-foreground tabular-nums">{level}</span>
        </span>
        {best && (
          <span className="flex items-center gap-1 text-[hsl(var(--warning))]">
            <Trophy className="h-3 w-3" fill="currentColor" />
            {t("gameBest")}: {t("gameLevel")} {best.level}
            <Medal tier={numberSequenceMedal(best.level)} size="sm" className="ml-0.5" />
          </span>
        )}
      </div>

      {/* Sequence display */}
      <div className="rounded-xl bg-muted/40 border border-border min-h-[80px] flex items-center justify-center p-3">
        {phase === "idle" && (
          <p className="text-xs text-muted-foreground italic text-center">
            {t("gameSequenceIntro")}
          </p>
        )}
        {phase === "showing" && shownIndex >= 0 && (
          <div className="text-5xl font-bold text-primary tabular-nums animate-fade-in">
            {sequence[shownIndex]}
          </div>
        )}
        {phase === "input" && (
          <div className="space-y-2 w-full text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              {t("gameYourTurn")}
            </p>
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {sequence.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-8 w-7 rounded-md flex items-center justify-center text-base font-bold tabular-nums",
                    i < input.length
                      ? "bg-primary/20 text-foreground border border-primary/40"
                      : "bg-background border border-border text-muted-foreground/30",
                  )}
                >
                  {i < input.length ? input[i] : "?"}
                </div>
              ))}
            </div>
          </div>
        )}
        {phase === "lost" && (
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-[hsl(var(--critical))]">
              ❌ {t("gameWrong")}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {t("gameCorrectWas")}:{" "}
              <span className="font-bold text-foreground tabular-nums">
                {sequence.join(" ")}
              </span>
            </p>
            {newRecord && (
              <p className="text-xs font-bold text-[hsl(var(--warning))] flex items-center justify-center gap-1 mt-1">
                <Trophy className="h-3 w-3" fill="currentColor" />
                {t("gameNewRecord")}
              </p>
            )}
            {(() => {
              const earned = numberSequenceMedal(level);
              if (!earned) return null;
              return (
                <div className="flex flex-col items-center gap-0.5 pt-1">
                  <Medal tier={earned} size="lg" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    {t("medalEarned")}
                  </span>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Controls */}
      {phase === "idle" && (
        <Button onClick={() => startLevel(1)} size="sm" className="w-full rounded-xl font-bold">
          <Play className="h-4 w-4 mr-1" />
          {t("tipsStartExercise")}
        </Button>
      )}

      {phase === "input" && (
        <div className="grid grid-cols-5 gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="aspect-square rounded-lg bg-card border border-border text-base font-bold text-foreground hover:bg-primary/10 hover:border-primary/40 active:scale-95 transition-all cursor-pointer tabular-nums"
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {phase === "showing" && (
        <div className="text-center text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
          <Eye className="h-3 w-3 inline mr-1" />
          {t("gameWatch")} ({target} {t("gameDigits")})
        </div>
      )}

      {phase === "lost" && (
        <Button onClick={restart} size="sm" className="w-full rounded-xl font-bold">
          <RotateCcw className="h-4 w-4 mr-1" />
          {t("tipsTryAgain")}
        </Button>
      )}
    </div>
  );
}
