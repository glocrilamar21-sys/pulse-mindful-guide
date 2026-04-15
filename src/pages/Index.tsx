import { useState, useEffect, useCallback } from "react";
import { Task, loadTasks, saveTasks, todayStr } from "@/lib/tasks";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, subDays } from "date-fns";
import { es } from "date-fns/locale";

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function dateToStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const loaded = loadTasks();
    return loaded.map((t) => ({ ...t, date: t.date || todayStr() }));
  });
  const [currentTime, setCurrentTime] = useState(getCurrentTime);
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const viewDateStr = dateToStr(viewDate);
  const isToday = viewDateStr === todayStr();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(getCurrentTime()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const filteredTasks = tasks.filter((t) => t.date === viewDateStr);
  const completedCount = filteredTasks.filter((t) => t.done).length;
  const totalCount = filteredTasks.length;

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)));
  }, []);

  const markDone = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: true } : t)));
  }, []);

  const postpone = useCallback((id: string) => {
    setTasks((prev) =>
      prev
        .map((t) => {
          if (t.id !== id) return t;
          const [h, m] = t.time.split(":").map(Number);
          const d = new Date();
          d.setHours(h, m + 15, 0);
          const newTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
          return { ...t, time: newTime };
        })
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    );
  }, []);

  const clearDone = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !(t.done && t.date === viewDateStr)));
  }, [viewDateStr]);

  const hasDone = filteredTasks.some((t) => t.done);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background pb-28 sm:pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-card shadow-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3 sm:py-4 md:max-w-2xl lg:max-w-4xl">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">
              Memory Help
            </h1>
            <p className="text-xs text-muted-foreground font-medium capitalize">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold tabular-nums text-primary">
              {currentTime}
            </span>
            <SettingsPanel />
          </div>
        </div>
      </header>

      {/* Date navigator */}
      <div className="mx-auto max-w-lg px-4 pt-4 sm:pt-5 md:max-w-2xl lg:max-w-4xl">
        <div className="flex items-center justify-between rounded-xl bg-card border border-border/60 p-2 sm:p-3 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewDate((d) => subDays(d, 1))}
            className="cursor-pointer hover:bg-accent h-10 w-10 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <button
              onClick={() => setViewDate(new Date())}
              className="cursor-pointer hover:text-primary text-base font-bold capitalize transition-colors"
            >
              {isToday ? "Hoy" : format(viewDate, "EEEE d 'de' MMMM", { locale: es })}
            </button>
            {!isToday && (
              <p className="text-xs text-primary mt-0.5 cursor-pointer hover:underline font-medium" onClick={() => setViewDate(new Date())}>
                Volver a hoy
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewDate((d) => addDays(d, 1))}
            className="cursor-pointer hover:bg-accent h-10 w-10 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="mx-auto max-w-lg px-4 pt-3 md:max-w-2xl lg:max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          </div>
        </div>
      )}

      {/* Timeline */}
      <main className="mx-auto max-w-lg px-4 pt-4 sm:pt-5 md:max-w-2xl lg:max-w-4xl">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <span className="text-4xl">📋</span>
            </div>
            <p className="text-lg font-bold text-foreground">Sin tareas para {isToday ? "hoy" : "este día"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Agrega tu primera tarea con el botón de abajo
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const isActive = isToday && !task.done && task.time <= currentTime;
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  isActive={isActive}
                  onDone={markDone}
                  onPostpone={postpone}
                />
              );
            })}
          </div>
        )}

        {hasDone && (
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={clearDone}
              className="w-full gap-2 text-muted-foreground cursor-pointer hover:bg-accent rounded-xl h-11"
            >
              <Trash2 className="h-4 w-4" />
              Limpiar completadas
            </Button>
          </div>
        )}
      </main>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-card/95 backdrop-blur-md p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-lg md:max-w-2xl lg:max-w-4xl">
          <AddTaskDialog onAdd={addTask} />
        </div>
      </div>
    </div>
  );
}
