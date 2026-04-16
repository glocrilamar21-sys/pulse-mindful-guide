import { useState, useEffect, useCallback } from "react";
import { Task, loadTasks, saveTasks, todayStr } from "@/lib/tasks";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { SettingsPanel } from "@/components/SettingsPanel";
import { CalendarView } from "@/components/CalendarView";
import { Plus, Target, CalendarDays, Bell, Settings, AlertTriangle, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function dateToStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type Tab = "enfoque" | "cronograma" | "recordatorios";

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const loaded = loadTasks();
    return loaded.map((t) => ({ ...t, date: t.date || todayStr() }));
  });
  const [currentTime, setCurrentTime] = useState(getCurrentTime);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<Tab>("enfoque");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const viewDateStr = dateToStr(viewDate);
  const isToday = viewDateStr === todayStr();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(getCurrentTime()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const todayTasks = tasks.filter((t) => t.date === viewDateStr);
  const criticalTasks = todayTasks.filter((t) => t.category === "critical" && !t.done);
  const flexibleTasks = todayTasks.filter((t) => t.category === "flexible" && !t.done);
  const doneTasks = todayTasks.filter((t) => t.done);

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

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background pb-24">
      {/* Top Header */}
      <header className="bg-card">
        <div className="mx-auto max-w-lg px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 md:max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                <span className="text-lg">🧠</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {isToday ? "Hoy" : format(viewDate, "EEEE d", { locale: es })},{" "}
                  <span className="capitalize">{format(viewDate, "d MMM", { locale: es })}</span>
                </h1>
              </div>
            </div>
            <button
              onClick={() => setActiveTab(activeTab === "recordatorios" ? "enfoque" : "recordatorios")}
              className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* TAB: Enfoque */}
      {activeTab === "enfoque" && (
        <div className="mx-auto max-w-lg px-4 pt-4 space-y-5 md:max-w-2xl">
          {/* Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden h-40">
            <div className="absolute inset-0 hero-banner" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10" />
            <div className="relative z-20 h-full flex flex-col justify-end p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-1">
                Reflexión Matutina
              </p>
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                Mantente presente.
              </h2>
            </div>
          </div>

          {/* Crítica Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[hsl(var(--critical))]" />
                <h2 className="text-base font-bold text-foreground">Crítica</h2>
              </div>
              {criticalTasks.length > 0 && (
                <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--critical))]">
                  {criticalTasks.length} Tareas restantes
                </span>
              )}
            </div>
            {criticalTasks.length === 0 ? (
              <div className="rounded-2xl bg-card p-6 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">Sin tareas críticas pendientes ✓</p>
              </div>
            ) : (
              <div className="space-y-3">
                {criticalTasks.map((task) => {
                  const isActive = isToday && task.time <= currentTime;
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
          </section>

          {/* Flexible Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-base font-bold text-foreground">Flexible</h2>
              </div>
              {flexibleTasks.length > 0 && (
                <span className="text-xs font-semibold text-muted-foreground">
                  En curso
                </span>
              )}
            </div>
            {flexibleTasks.length === 0 ? (
              <div className="rounded-2xl bg-card p-6 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">Sin tareas flexibles pendientes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {flexibleTasks.map((task) => {
                  const isActive = isToday && task.time <= currentTime;
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
          </section>

          {/* Done tasks */}
          {doneTasks.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
                Completadas ({doneTasks.length})
              </h2>
              <div className="space-y-2">
                {doneTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isActive={false}
                    onDone={markDone}
                    onPostpone={postpone}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {todayTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <p className="text-base font-bold text-foreground">
                Sin tareas para {isToday ? "hoy" : "este día"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Toca + para agregar tu primera tarea
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB: Cronograma */}
      {activeTab === "cronograma" && (
        <div className="-mt-1">
          <CalendarView
            tasks={tasks}
            viewDate={viewDate}
            onChangeDate={setViewDate}
            onDone={markDone}
            onPostpone={postpone}
            currentTime={currentTime}
          />
        </div>
      )}

      {/* TAB: Recordatorios/Config */}
      {activeTab === "recordatorios" && (
        <div className="mx-auto max-w-lg px-4 pt-4 md:max-w-2xl">
          <SettingsPanel inline />
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setAddDialogOpen(true)}
        className="fixed right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
        style={{ bottom: "max(5.5rem, calc(4.5rem + env(safe-area-inset-bottom)))" }}
      >
        <Plus className="h-7 w-7" />
      </button>

      {/* Add Task Dialog */}
      <AddTaskDialog onAdd={addTask} open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-card pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg flex items-center justify-around md:max-w-2xl">
          <NavTab
            icon={<Target className="h-5 w-5" />}
            label="ENFOQUE"
            active={activeTab === "enfoque"}
            onClick={() => { setActiveTab("enfoque"); setViewDate(new Date()); }}
          />
          <NavTab
            icon={<CalendarDays className="h-5 w-5" />}
            label="CRONOGRAMA"
            active={activeTab === "cronograma"}
            onClick={() => setActiveTab("cronograma")}
          />
          <NavTab
            icon={<Bell className="h-5 w-5" />}
            label="RECORDATORIOS"
            active={activeTab === "recordatorios"}
            onClick={() => setActiveTab("recordatorios")}
          />
        </div>
      </nav>
    </div>
  );
}

function NavTab({ icon, label, active, onClick }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-2.5 px-4 cursor-pointer transition-colors ${
        active ? "bottom-nav-active" : "bottom-nav-inactive"
      }`}
    >
      {icon}
      <span className="text-[9px] font-bold tracking-wider">{label}</span>
    </button>
  );
}
