import { useEffect, useRef } from "react";
import { Task, startAlert, stopAlert } from "@/lib/tasks";
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

  const handleDone = () => {
    stopAlert();
    onDone(task.id);
  };

  const handlePostpone = () => {
    stopAlert();
    onPostpone(task.id);
  };

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 sm:gap-4 rounded-xl border bg-card p-4 sm:p-5 transition-all shadow-sm",
        task.done && "task-done",
        !task.done && isCritical && "task-critical pulse-critical",
        !task.done && !isCritical && "border-border/60"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          task.done
            ? "bg-success/15"
            : isCritical
            ? "bg-critical/12"
            : "bg-primary/10"
        )}
      >
        {task.done ? (
          <Check className="h-5 w-5 text-success" />
        ) : isCritical ? (
          <AlertTriangle className="h-5 w-5 text-critical" />
        ) : (
          <Clock className="h-5 w-5 text-primary" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold text-muted-foreground tabular-nums">
            {task.time}
          </span>
          {isCritical && !task.done && (
            <span className="inline-flex items-center rounded-full bg-critical/10 px-2 py-0.5 text-[10px] font-bold text-critical uppercase tracking-wide">
              Crítica
            </span>
          )}
        </div>
        <p className={cn(
          "text-base font-semibold leading-tight text-foreground",
          task.done && "line-through text-muted-foreground"
        )}>
          {task.name}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {!task.done ? (
          <>
            <Button
              onClick={handleDone}
              size="icon"
              className="h-11 w-11 rounded-full bg-success hover:bg-success/80 text-success-foreground cursor-pointer shadow-sm"
            >
              <Check className="h-5 w-5" />
            </Button>
            {!isCritical && (
              <Button
                onClick={handlePostpone}
                size="icon"
                variant="outline"
                className="h-11 w-11 rounded-full border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
              >
                <Timer className="h-5 w-5" />
              </Button>
            )}
          </>
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-success/15">
            <Check className="h-5 w-5 text-success" />
          </div>
        )}
      </div>
    </div>
  );
}
