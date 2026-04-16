import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import {
  TIP_CATEGORIES,
  getTipsContent,
  type TipCategoryId,
  type TipExercise,
} from "@/lib/tipsContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Lightbulb, Play, RotateCcw, Eye, Timer, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ACCENT: Record<TipCategoryId, string> = {
  habits: "from-primary/20 to-primary/5 border-primary/30",
  foods: "from-[hsl(var(--success))]/20 to-[hsl(var(--success))]/5 border-[hsl(var(--success))]/30",
  exercises: "from-[hsl(var(--warning))]/20 to-[hsl(var(--warning))]/5 border-[hsl(var(--warning))]/30",
  discipline: "from-[hsl(var(--critical))]/20 to-[hsl(var(--critical))]/5 border-[hsl(var(--critical))]/30",
};

const CATEGORY_TEXT: Record<TipCategoryId, string> = {
  habits: "text-primary",
  foods: "text-[hsl(var(--success))]",
  exercises: "text-[hsl(var(--warning))]",
  discipline: "text-[hsl(var(--critical))]",
};

export function TipsView() {
  const { t, locale } = useI18n();
  const content = useMemo(() => getTipsContent(locale), [locale]);

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 space-y-5 md:max-w-2xl animate-fade-in">
      {/* Header */}
      <header className="flex items-start gap-3 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 border border-primary/20">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
          <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground leading-tight">
            {t("tipsTitle")}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("tipsSubtitle")}
          </p>
        </div>
      </header>

      {/* Categories */}
      <Accordion
        type="multiple"
        defaultValue={["habits"]}
        className="space-y-3"
      >
        {TIP_CATEGORIES.map((catId) => {
          const cat = content[catId];
          return (
            <AccordionItem
              key={catId}
              value={catId}
              className={cn(
                "border rounded-2xl bg-gradient-to-br shadow-sm overflow-hidden",
                CATEGORY_ACCENT[catId]
              )}
            >
              <AccordionTrigger className="px-4 py-4 hover:no-underline">
                <div className="flex items-center gap-3 min-w-0 text-left">
                  <span className="text-2xl shrink-0" aria-hidden>
                    {cat.emoji}
                  </span>
                  <div className="min-w-0">
                    <h2 className={cn("text-sm font-bold leading-tight", CATEGORY_TEXT[catId])}>
                      {cat.title}
                    </h2>
                    <p className="text-[11px] text-muted-foreground font-medium truncate">
                      {cat.subtitle}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4 space-y-3">
                <p className="text-xs text-muted-foreground italic">{cat.intro}</p>

                <ul className="space-y-2">
                  {cat.items.map((item, i) => (
                    <li
                      key={i}
                      className="rounded-xl bg-card/70 backdrop-blur-sm p-3 border border-border/50"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={cn(
                            "shrink-0 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-background",
                            CATEGORY_TEXT[catId]
                          )}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-foreground leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {cat.exercise && (
                  <ExerciseCard exercise={cat.exercise} accent={CATEGORY_TEXT[catId]} />
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <div className="text-center text-[10px] text-muted-foreground/60 italic py-2">
        💡 {t("tipsHowToPlay")}
      </div>
    </div>
  );
}

type Phase = "idle" | "memorize" | "recall" | "done";

function ExerciseCard({ exercise, accent }: { exercise: TipExercise; accent: string }) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("idle");
  const [remaining, setRemaining] = useState(exercise.durationSec);
  const intervalRef = useRef<number | null>(null);

  // Reset when exercise changes (e.g., locale change)
  useEffect(() => {
    setPhase("idle");
    setRemaining(exercise.durationSec);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [exercise]);

  useEffect(() => {
    if (phase !== "memorize") return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          setPhase("recall");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [phase]);

  const start = () => {
    setRemaining(exercise.durationSec);
    setPhase("memorize");
  };

  const reset = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setPhase("idle");
    setRemaining(exercise.durationSec);
  };

  const progress = (remaining / exercise.durationSec) * 100;

  return (
    <div className="rounded-xl border-2 border-dashed border-border bg-background/60 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <Sparkles className={cn("h-4 w-4 shrink-0 mt-0.5", accent)} />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-foreground leading-tight">
            {exercise.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {exercise.description}
          </p>
        </div>
      </div>

      {phase === "idle" && (
        <Button
          onClick={start}
          className="w-full rounded-xl font-bold"
          size="sm"
        >
          <Play className="h-4 w-4 mr-1" />
          {t("tipsStartExercise")}
        </Button>
      )}

      {phase === "memorize" && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Timer className="h-3.5 w-3.5" />
              {t("tipsTimeRemaining")}
            </span>
            <span className={cn("text-base tabular-nums", accent)}>{remaining}s</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {exercise.steps.map((step, i) => (
              <div
                key={i}
                className="rounded-lg bg-card border border-border px-3 py-2 text-sm font-bold text-center text-foreground animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {step}
              </div>
            ))}
          </div>
          <Button
            onClick={reset}
            variant="ghost"
            size="sm"
            className="w-full rounded-xl text-xs"
          >
            {t("tipsStopExercise")}
          </Button>
        </div>
      )}

      {phase === "recall" && (
        <div className="space-y-3 animate-fade-in text-center">
          <div className={cn("text-base font-bold", accent)}>
            🧠 {t("tipsRecallNow")}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("tipsExerciseDone")}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setPhase("done")}
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl"
            >
              <Eye className="h-4 w-4 mr-1" />
              {t("tipsRevealList")}
            </Button>
            <Button
              onClick={start}
              size="sm"
              className="flex-1 rounded-xl font-bold"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {t("tipsTryAgain")}
            </Button>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-3 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            {exercise.steps.map((step, i) => (
              <div
                key={i}
                className="rounded-lg bg-primary/10 border border-primary/30 px-3 py-2 text-sm font-bold text-center text-foreground"
              >
                {step}
              </div>
            ))}
          </div>
          <Button
            onClick={start}
            size="sm"
            className="w-full rounded-xl font-bold"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            {t("tipsTryAgain")}
          </Button>
        </div>
      )}
    </div>
  );
}
