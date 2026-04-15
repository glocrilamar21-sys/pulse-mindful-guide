import { useEffect, useRef } from "react";
import { Task, startAlert, stopAlert } from "@/lib/tasks";
import { Check, Timer } from "lucide-react";
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
        "flex items-center gap-3 px-4 py-3.5 transition-all",
        task.done && "task-done",
        !task.done && isCritical && "task-critical",
        !task.done && !isCritical && "task-flexible",
        isActive && !task.done && "pulse-critical bg-critical/5"
      )}
    >
      {/* Dot indicator */}
      <div
        className={cn(
          "h-3 w-3 rounded-full shrink-0",
          task.done
            ? "bg-success"
            : isCritical
            ? "bg-critical"
            : "bg-primary"
        )}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-semibold leading-tight text-foreground",
          task.done && "line-through text-muted-foreground"
        )}>
          {task.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground tabular-nums">
            {task.time}
          </span>
          {isCritical && !task.done && (
            <span className="text-[10px] font-bold text-critical uppercase">
              Crítica
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {!task.done ? (
          <>
            <button
              onClick={handleDone}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15 text-success hover:bg-success/25 cursor-pointer transition-colors"
            >
              <Check className="h-4 w-4" />
            </button>
            {!isCritical && (
              <button
                onClick={handlePostpone}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
              >
                <Timer className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15">
            <Check className="h-4 w-4 text-success" />
          </div>
        )}
      </div>
    </div>
  );
}
