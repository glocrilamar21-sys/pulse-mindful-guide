import { useEffect, useRef } from "react";
import { Task, startAlert, stopAlert } from "@/lib/tasks";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getTaskDisplayIcon } from "@/lib/taskIcons";
import { BrainMascot } from "@/components/BrainMascot";

interface TaskCardProps {
  task: Task;
  isActive: boolean;
  onDone: (id: string) => void;
  onPostpone: (id: string) => void;
  variant?: "full" | "compact";
}

export function TaskCard({ task, isActive, onDone, onPostpone, variant = "full" }: TaskCardProps) {
  const { t } = useI18n();
  const isCritical = task.category === "critical";
  const alertingRef = useRef(false);

  useEffect(() => {
    if (isActive && !task.done) {
      if (!alertingRef.current) {
        alertingRef.current = true;
        startAlert(task.category);
      }
    } else {
      if (alertingRef.current) {
        alertingRef.current = false;
        stopAlert();
      }
    }
    return () => {
      if (alertingRef.current) {
        alertingRef.current = false;
        stopAlert();
      }
    };
  }, [isActive, task.done, task.category]);

  const handleDone = () => { stopAlert(); onDone(task.id); };
  const handlePostpone = () => { stopAlert(); onPostpone(task.id); };
  const Icon = getTaskDisplayIcon(task);

  const mascotMood = task.done ? "happy" : "worried";

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3 px-4 py-3 transition-all", task.done && "task-done")}>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-full shrink-0", isCritical ? "bg-[hsl(var(--critical-light))]" : "bg-[hsl(var(--flexible-light))]")}>
          <Icon className={cn("h-4 w-4", isCritical ? "text-[hsl(var(--critical))]" : "text-primary")} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-semibold text-foreground", task.done && "line-through text-muted-foreground")}>{task.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {task.time} • {isCritical ? t("criticalPriority") : t("flexible")}
          </p>
        </div>
        <BrainMascot mood={mascotMood} size="sm" animate={isActive || task.done} scope={task.scope} />
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-2xl bg-card p-4 shadow-sm transition-all hover:shadow-md",
      isActive && !task.done && "pulse-critical",
      task.done && "task-done"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-full", isCritical ? "bg-[hsl(var(--critical-light))]" : "bg-[hsl(var(--flexible-light))]")}>
            <Icon className={cn("h-5 w-5", isCritical ? "text-[hsl(var(--critical))]" : "text-primary")} />
          </div>
          <BrainMascot mood={mascotMood} size="md" animate={isActive || task.done} scope={task.scope} />
        </div>
        {isCritical && !task.done && isActive && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[hsl(var(--critical-light))] text-[hsl(var(--critical))]">
            {t("urgent")}
          </span>
        )}
        {task.done && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[hsl(var(--success)/.1)] text-[hsl(var(--success))]">
            {t("done")}
          </span>
        )}
      </div>
      <h3 className={cn("text-base font-bold text-foreground mb-1", task.done && "line-through text-muted-foreground")}>{task.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {task.time} — {isCritical ? t("criticalTask") : t("flexibleTask")}
      </p>
      {!task.done && (
        <div className="flex gap-2">
          <Button onClick={handleDone} className="flex-1 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm cursor-pointer active:scale-95 transition-transform">
            {t("complete")}
          </Button>
          <Button onClick={handlePostpone} variant="outline" className="h-10 rounded-full px-5 font-semibold text-sm cursor-pointer border-border active:scale-95 transition-transform">
            {t("postpone")}
          </Button>
        </div>
      )}
    </div>
  );
}
