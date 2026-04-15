import { useState, useEffect, useCallback } from "react";
import { Task, loadTasks, saveTasks, todayStr } from "@/lib/tasks";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { SettingsPanel } from "@/components/SettingsPanel";
import { CalendarView } from "@/components/CalendarView";
import { Trash2, ChevronLeft, ChevronRight, CalendarDays, Plus, ListTodo, Settings } from "lucide-react";
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

type Tab = "hoy" | "calendario" | "nueva" | "config";

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const loaded = loadTasks();
    return loaded.map((t) => ({ ...t, date: t.date || todayStr() }));
  });
  const [currentTime, setCurrentTime] = useState(getCurrentTime);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<Tab>("hoy");
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

  const filteredTasks = tasks.filter((t) => t.date === viewDateStr);
  const completedCount = filteredTasks.filter((t) => t.done).length;
  const totalCount = filteredTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
    <div className="min-h-screen min-h-[100dvh] bg-background pb-20">
      {/* Hero Header */}
      <header className="hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-lg px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-5 md:max-w-2xl lg:max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold">Memory Help</h1>
            <span className="text-sm font-medium opacity-90 tabular-nums">{currentTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold leading-tight">
                {activeTab === "calendario"
                  ? "Calendario"
                  : activeTab === "config"
                  ? "Configuración"
                  : isToday
                  ? "Hoy"
                  : format(viewDate, "EEEE d", { locale: es })}
              </p>
              <p className="text-sm opacity-80 capitalize mt-0.5">
                {format(viewDate, "MMMM yyyy", { locale: es })}
              </p>
            </div>
            {activeTab === "hoy" && totalCount > 0 && (
              <div className="flex flex-col items-center">
                <div className="relative h-14 w-14">
                  <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
                    <circle
                      cx="28" cy="28" r="24"
                      fill="none" stroke="white" strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 24}`}
                      strokeDashoffset={`${2 * Math.PI * 24 * (1 - progressPercent / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {progressPercent}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* TAB: Hoy */}
      {activeTab === "hoy" && (
        <>
          {/* Date Navigator */}
          <div className="mx-auto max-w-lg px-4 -mt-3 md:max-w-2xl lg:max-w-4xl">
            <div className="flex items-center justify-between rounded-xl bg-card p-2 shadow-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewDate((d) => subDays(d, 1))}
                className="cursor-pointer h-9 w-9 rounded-full hover:bg-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <button
                onClick={() => setViewDate(new Date())}
                className="cursor-pointer text-sm font-semibold capitalize hover:text-primary transition-colors"
              >
                {isToday ? "Hoy" : format(viewDate, "EEEE d 'de' MMMM", { locale: es })}
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewDate((d) => addDays(d, 1))}
                className="cursor-pointer h-9 w-9 rounded-full hover:bg-accent"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Section label */}
          <div className="mx-auto max-w-lg px-4 pt-4 md:max-w-2xl lg:max-w-4xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
                Tareas del día
              </h2>
              {totalCount > 0 && (
                <span className="text-xs font-semibold text-muted-foreground">
                  {completedCount} de {totalCount}
                </span>
              )}
            </div>
          </div>

          {/* Task List */}
          <main className="mx-auto max-w-lg px-4 md:max-w-2xl lg:max-w-4xl">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                  <ListTodo className="h-7 w-7 text-primary" />
                </div>
                <p className="text-base font-bold text-foreground">Sin tareas para {isToday ? "hoy" : "este día"}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Toca + para agregar tu primera tarea
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-card shadow-sm overflow-hidden divide-y divide-border">
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
              <div className="mt-3">
                <Button
                  variant="ghost"
                  onClick={clearDone}
                  className="w-full gap-2 text-muted-foreground cursor-pointer hover:bg-card text-xs h-9"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Limpiar completadas
                </Button>
              </div>
            )}
          </main>
        </>
      )}

      {/* TAB: Calendario */}
      {activeTab === "calendario" && (
        <div className="-mt-3">
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

      {/* TAB: Config */}
      {activeTab === "config" && (
        <div className="mx-auto max-w-lg px-4 pt-4 md:max-w-2xl lg:max-w-4xl">
          <SettingsPanel inline />
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setAddDialogOpen(true)}
        className="fixed right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
        style={{ bottom: "max(5rem, calc(4rem + env(safe-area-inset-bottom)))" }}
      >
        <Plus className="h-7 w-7" />
      </button>

      {/* Add Task Dialog */}
      <AddTaskDialog onAdd={addTask} open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-card pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg flex items-center justify-around md:max-w-2xl lg:max-w-4xl">
          <NavTab
            icon={<ListTodo className="h-5 w-5" />}
            label="Hoy"
            active={activeTab === "hoy"}
            onClick={() => { setActiveTab("hoy"); setViewDate(new Date()); }}
          />
          <NavTab
            icon={<CalendarDays className="h-5 w-5" />}
            label="Calendario"
            active={activeTab === "calendario"}
            onClick={() => setActiveTab("calendario")}
          />
          <NavTab
            icon={<Plus className="h-5 w-5" />}
            label="Nueva"
            active={false}
            onClick={() => setAddDialogOpen(true)}
          />
          <NavTab
            icon={<Settings className="h-5 w-5" />}
            label="Config"
            active={activeTab === "config"}
            onClick={() => setActiveTab("config")}
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
      className={`flex flex-col items-center gap-0.5 py-2 px-3 cursor-pointer transition-colors ${
        active ? "bottom-nav-active" : "bottom-nav-inactive"
      }`}
    >
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}
