import { Task, vibrateCritical, vibrateFlexible, stopVibration } from "@/lib/tasks";
import { AlertTriangle, Clock, Check, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  isActive: boolean;
  onDone: (id: string) => void;
  onPostpone: (id: string) => void;
}

export function TaskCard({ task, isActive, onDone, onPostpone }: TaskCardProps) {
  const isCritical = task.category === "critical";

  const handleDone = () => {
    stopVibration();
    onDone(task.id);
  };

  const handleVibrate = () => {
    if (isCritical) vibrateCritical();
    else vibrateFlexible();
  };

  // Auto-vibrate when active and not done
  if (isActive && !task.done) {
    // We trigger vibration on render for active tasks
    handleVibrate();
  }

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 sm:gap-4 rounded-lg border-2 p-4 sm:p-5 transition-all",
        task.done && "task-done",
        !task.done && isCritical && "task-critical pulse-critical",
        !task.done && !isCritical && "task-flexible"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          isCritical ? "bg-critical/20" : "bg-flexible/20"
        )}
      >
        {isCritical ? (
          <AlertTriangle className="h-6 w-6 text-critical" />
        ) : (
          <Clock className="h-6 w-6 text-flexible" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          {task.time}
        </p>
        <p className={cn(
          "text-lg font-bold leading-tight",
          task.done && "line-through"
        )}>
          Hacer {task.name}
        </p>
        {task.category === "critical" && !task.done && (
          <p className="text-sm text-critical font-medium mt-1">⚠ Tarea crítica</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 shrink-0">
        {!task.done ? (
          <>
            <Button
              onClick={handleDone}
              size="lg"
              className="h-14 w-14 rounded-full bg-success hover:bg-success/80 text-success-foreground"
            >
              <Check className="h-7 w-7" />
            </Button>
            {!isCritical && (
              <Button
                onClick={() => onPostpone(task.id)}
                size="lg"
                variant="outline"
                className="h-14 w-14 rounded-full border-flexible text-flexible hover:bg-flexible/10"
              >
                <Timer className="h-6 w-6" />
              </Button>
            )}
          </>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/20">
            <Check className="h-7 w-7 text-success" />
          </div>
        )}
      </div>
    </div>
  );
}
