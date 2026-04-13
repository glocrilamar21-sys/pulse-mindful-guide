import { useState, useEffect, useCallback } from "react";
import { Task, loadTasks, saveTasks } from "@/lib/tasks";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [currentTime, setCurrentTime] = useState(getCurrentTime);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(getCurrentTime()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task].sort((a, b) => a.time.localeCompare(b.time)));
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
        .sort((a, b) => a.time.localeCompare(b.time))
    );
  }, []);

  const clearDone = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.done));
  }, []);

  const hasDone = tasks.some((t) => t.done);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Pulso Diario</h1>
            <p className="text-sm text-muted-foreground font-medium">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-sm font-bold tabular-nums">
              {currentTime}
            </span>
            <SettingsPanel />
          </div>
        </div>
      </header>

      {/* Timeline */}
      <main className="mx-auto max-w-lg px-4 pt-6">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <span className="text-4xl">📋</span>
            </div>
            <p className="text-lg font-bold">Sin tareas para hoy</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Agrega tu primera tarea con el botón de abajo
            </p>
          </div>
        ) : (
          <div className="relative space-y-4">
            {/* Vertical timeline line */}
            <div className="absolute left-[29px] top-0 bottom-0 w-0.5 bg-border" />

            {tasks.map((task) => {
              const isActive = !task.done && task.time <= currentTime;
              return (
                <div key={task.id} className="relative pl-14">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-[23px] top-7 h-3.5 w-3.5 rounded-full border-2 border-background ${
                      task.done
                        ? "bg-success"
                        : task.category === "critical"
                        ? "bg-critical"
                        : "bg-flexible"
                    }`}
                  />
                  <TaskCard
                    task={task}
                    isActive={isActive}
                    onDone={markDone}
                    onPostpone={postpone}
                  />
                </div>
              );
            })}
          </div>
        )}

        {hasDone && (
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={clearDone}
              className="w-full gap-2 text-muted-foreground"
            >
              <Trash2 className="h-4 w-4" />
              Limpiar completadas
            </Button>
          </div>
        )}
      </main>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/90 backdrop-blur-md p-4">
        <div className="mx-auto max-w-lg">
          <AddTaskDialog onAdd={addTask} />
        </div>
      </div>
    </div>
  );
}
