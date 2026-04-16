import { useEffect, useMemo, useState } from "react";
import { useI18n, type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, Play, RotateCcw, Eye } from "lucide-react";
import { loadBestScores, maybeUpdateBest, shuffle } from "@/lib/memoryGames";
import { playGameSound } from "@/lib/gameSounds";
import { memoryPalaceMedal } from "@/lib/medals";
import { Medal } from "@/components/games/Medal";

type Phase = "idle" | "memorize" | "quiz" | "result";

interface Room {
  id: string;
  emoji: string;
  label: Record<Locale, string>;
}

interface ItemDef {
  id: string;
  emoji: string;
  label: Record<Locale, string>;
}

const ROOMS: Room[] = [
  { id: "kitchen", emoji: "🍳", label: { es: "Cocina", en: "Kitchen", pt: "Cozinha", fr: "Cuisine", it: "Cucina" } },
  { id: "bedroom", emoji: "🛏️", label: { es: "Dormitorio", en: "Bedroom", pt: "Quarto", fr: "Chambre", it: "Camera" } },
  { id: "bathroom", emoji: "🛁", label: { es: "Baño", en: "Bathroom", pt: "Banheiro", fr: "Salle de bain", it: "Bagno" } },
  { id: "living", emoji: "🛋️", label: { es: "Sala", en: "Living", pt: "Sala", fr: "Salon", it: "Salotto" } },
  { id: "garden", emoji: "🌳", label: { es: "Jardín", en: "Garden", pt: "Jardim", fr: "Jardin", it: "Giardino" } },
];

const ITEMS: ItemDef[] = [
  { id: "key", emoji: "🔑", label: { es: "Llave", en: "Key", pt: "Chave", fr: "Clé", it: "Chiave" } },
  { id: "book", emoji: "📕", label: { es: "Libro", en: "Book", pt: "Livro", fr: "Livre", it: "Libro" } },
  { id: "watch", emoji: "⌚", label: { es: "Reloj", en: "Watch", pt: "Relógio", fr: "Montre", it: "Orologio" } },
  { id: "umbrella", emoji: "☂️", label: { es: "Paraguas", en: "Umbrella", pt: "Guarda-chuva", fr: "Parapluie", it: "Ombrello" } },
  { id: "phone", emoji: "📱", label: { es: "Teléfono", en: "Phone", pt: "Telefone", fr: "Téléphone", it: "Telefono" } },
];

const MEMORIZE_SEC = 15;

export function MemoryPalaceGame() {
  const { t, locale } = useI18n();
  const [phase, setPhase] = useState<Phase>("idle");
  const [pairs, setPairs] = useState<{ room: Room; item: ItemDef }[]>([]);
  const [remaining, setRemaining] = useState(MEMORIZE_SEC);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizOptions, setQuizOptions] = useState<ItemDef[]>([]);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<{ correct: boolean; chosen: string } | null>(null);
  const [newRecord, setNewRecord] = useState(false);

  const best = loadBestScores().memoryPalace;

  // Memorize timer
  useEffect(() => {
    if (phase !== "memorize") return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          setPhase("quiz");
          setQuizIndex(0);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  // Build quiz options whenever quiz index changes
  useEffect(() => {
    if (phase !== "quiz" || pairs.length === 0) return;
    const correct = pairs[quizIndex].item;
    const distractors = shuffle(ITEMS.filter((i) => i.id !== correct.id)).slice(0, 3);
    setQuizOptions(shuffle([correct, ...distractors]));
    setAnswered(null);
  }, [phase, quizIndex, pairs]);

  const start = () => {
    const shuffledItems = shuffle(ITEMS);
    const generated = ROOMS.map((room, i) => ({ room, item: shuffledItems[i] }));
    setPairs(generated);
    setRemaining(MEMORIZE_SEC);
    setScore(0);
    setQuizIndex(0);
    setAnswered(null);
    setNewRecord(false);
    setPhase("memorize");
  };

  const handleAnswer = (item: ItemDef) => {
    if (answered) return;
    const correct = item.id === pairs[quizIndex].item.id;
    setAnswered({ correct, chosen: item.id });
    if (correct) setScore((s) => s + 1);
    playGameSound(correct ? "correct" : "wrong");

    window.setTimeout(() => {
      if (quizIndex + 1 >= pairs.length) {
        const finalScore = score + (correct ? 1 : 0);
        const replaced = maybeUpdateBest(
          "memoryPalace",
          (prev) => !prev || finalScore > prev.score,
          { score: finalScore, total: pairs.length },
        );
        setNewRecord(replaced);
        setPhase("result");
        playGameSound("win");
      } else {
        setQuizIndex((q) => q + 1);
      }
    }, 900);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-muted-foreground">
          {phase === "quiz" && (
            <>
              {t("gameQuestion")} {quizIndex + 1}/{pairs.length}
            </>
          )}
          {phase === "memorize" && (
            <>
              ⏱ <span className="text-foreground tabular-nums">{remaining}s</span>
            </>
          )}
        </span>
        {best && (
          <span className="flex items-center gap-1 text-[hsl(var(--warning))]">
            <Trophy className="h-3 w-3" fill="currentColor" />
            {t("gameBest")}: {best.score}/{best.total}
            <Medal tier={memoryPalaceMedal(best.score, best.total)} size="sm" className="ml-0.5" />
          </span>
        )}
      </div>

      {phase === "idle" && (
        <>
          <div className="rounded-xl bg-muted/40 border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground italic">
              {t("gamePalaceIntro")}
            </p>
          </div>
          <Button onClick={start} size="sm" className="w-full rounded-xl font-bold">
            <Play className="h-4 w-4 mr-1" />
            {t("tipsStartExercise")}
          </Button>
        </>
      )}

      {phase === "memorize" && (
        <div className="space-y-2 animate-fade-in">
          <div className="text-center text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            <Eye className="h-3 w-3 inline mr-1" />
            {t("gameMemorizePairs")}
          </div>
          <div className="space-y-2">
            {pairs.map(({ room, item }) => (
              <div
                key={room.id}
                className="flex items-center justify-between rounded-xl bg-card border border-border px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{room.emoji}</span>
                  <span className="text-xs font-bold text-foreground">{room.label[locale]}</span>
                </div>
                <span className="text-xs text-muted-foreground">→</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-xs font-bold text-foreground">{item.label[locale]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === "quiz" && pairs[quizIndex] && (
        <div className="space-y-3 animate-fade-in">
          <div className="rounded-xl bg-primary/10 border border-primary/30 p-3 text-center space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              {t("gameWhatIsIn")}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{pairs[quizIndex].room.emoji}</span>
              <span className="text-sm font-bold text-foreground">
                {pairs[quizIndex].room.label[locale]}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quizOptions.map((opt) => {
              const isChosen = answered?.chosen === opt.id;
              const isCorrectAnswer = opt.id === pairs[quizIndex].item.id;
              const showCorrect = !!answered && isCorrectAnswer;
              const showWrong = !!answered && isChosen && !answered.correct;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!answered}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border-2 p-3 transition-all cursor-pointer text-left",
                    !answered && "bg-card border-border hover:border-primary/50 hover:bg-primary/5 active:scale-95",
                    showCorrect && "bg-[hsl(var(--success))]/15 border-[hsl(var(--success))]/50",
                    showWrong && "bg-[hsl(var(--critical))]/15 border-[hsl(var(--critical))]/50",
                    answered && !showCorrect && !showWrong && "opacity-40",
                  )}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-xs font-bold text-foreground">{opt.label[locale]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === "result" && (
        <div className="rounded-xl bg-gradient-to-br from-primary/15 to-transparent border border-primary/30 p-4 text-center space-y-2 animate-fade-in">
          <p className="text-sm font-bold text-foreground">
            🏛️ {t("gameFinished")}
          </p>
          <p className="text-2xl font-bold text-primary tabular-nums">
            {score}/{pairs.length}
          </p>
          {newRecord && (
            <p className="text-xs font-bold text-[hsl(var(--warning))] flex items-center justify-center gap-1">
              <Trophy className="h-3.5 w-3.5" fill="currentColor" />
              {t("gameNewRecord")}
            </p>
          )}
          {(() => {
            const earned = memoryPalaceMedal(score, pairs.length);
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
          <Button onClick={start} size="sm" className="w-full rounded-xl font-bold mt-1">
            <RotateCcw className="h-4 w-4 mr-1" />
            {t("tipsTryAgain")}
          </Button>
        </div>
      )}
    </div>
  );
}
