import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { Task, loadTasks, saveTasks, todayStr } from "@/lib/tasks";
// notifications removed
import { useI18n } from "@/lib/i18n";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { SettingsPanel } from "@/components/SettingsPanel";
import { CalendarView } from "@/components/CalendarView";
import { ProjectsView } from "@/components/ProjectsView";
import { HeroBanner } from "@/components/HeroBanner";
import { BrainMascot } from "@/components/BrainMascot";
import { TipsView } from "@/components/TipsView";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PwaAssetsStatus } from "@/components/PwaAssetsStatus";
import { Plus, Target, CalendarDays, Bell, AlertTriangle, Sparkles, FolderKanban, BarChart3, Lightbulb } from "lucide-react";
import { WeeklyStats } from "@/components/WeeklyStats";
import { format } from "date-fns";
import { dateFnsLocales } from "@/lib/i18n";

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function dateToStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type Tab = "enfoque" | "cronograma" | "proyectos" | "stats" | "consejos" | "recordatorios";

export default function Index() {
  const { t, locale } = useI18n();
  const dateFnsLocale = dateFnsLocales[locale];

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
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const todayTasks = tasks.filter((t) => t.date === viewDateStr);
  const criticalTasks = todayTasks.filter((t) => t.category === "critical" && !t.done);
  const flexibleTasks = todayTasks.filter((t) => t.category === "flexible" && !t.done);
  const doneTasks = todayTasks.filter((t) => t.done);

  // Next pending task drives the header mascot when auto-mode is enabled.
  // Priority: earliest critical pending → earliest flexible pending → none.
  const nextPendingTask =
    [...criticalTasks].sort((a, b) => a.time.localeCompare(b.time))[0] ??
    [...flexibleTasks].sort((a, b) => a.time.localeCompare(b.time))[0];
  const headerScope = nextPendingTask?.scope;

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)));
  }, []);

  const markDone = useCallback((id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.done) {
      const isCritical = task.category === "critical";
      // Fire confetti for single task
      confetti({
        particleCount: isCritical ? 150 : 80,
        spread: isCritical ? 100 : 60,
        origin: { y: 0.6 },
        colors: isCritical
          ? ["#ff4444", "#ff6b6b", "#ffd700", "#ff8c00"]
          : ["#4f46e5", "#7c3aed", "#06b6d4", "#10b981", "#fbbf24"],
      });

      // Check if all tasks for today will be done after this one
      const todayTasksList = tasks.filter((t) => t.date === viewDateStr);
      const remainingAfter = todayTasksList.filter((t) => !t.done && t.id !== id);
      if (todayTasksList.length > 1 && remainingAfter.length === 0) {
        // All tasks completed celebration!
        setTimeout(() => {
          const duration = 3000;
          const end = Date.now() + duration;
          const frame = () => {
            confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#ffd700", "#ff6b6b", "#4f46e5", "#10b981", "#7c3aed"] });
            confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#ffd700", "#ff6b6b", "#4f46e5", "#10b981", "#7c3aed"] });
            if (Date.now() < end) requestAnimationFrame(frame);
          };
          frame();
        }, 600);
      }
    }
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: true } : t)));
  }, [tasks, viewDateStr]);

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
                <BrainMascot mood="happy" size="sm" scope={headerScope} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {isToday ? t("today") : format(viewDate, "EEEE d", { locale: dateFnsLocale })},{" "}
                  <span className="capitalize">{format(viewDate, "d MMM", { locale: dateFnsLocale })}</span>
                </h1>
              </div>
            </div>
            <button
              onClick={() => setActiveTab(activeTab === "recordatorios" ? "enfoque" : "recordatorios")}
              className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* TAB: Enfoque */}
      {activeTab === "enfoque" && (
        <div className="mx-auto max-w-lg px-4 pt-4 space-y-5 md:max-w-2xl animate-fade-in">
          <HeroBanner />

          {/* Critical Section */}
          <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[hsl(var(--critical))]" />
                <h2 className="text-base font-bold text-foreground">{t("critical")}</h2>
              </div>
              {criticalTasks.length > 0 && (
                <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--critical))]">
                  {criticalTasks.length} {t("tasksRemaining")}
                </span>
              )}
            </div>
            {criticalTasks.length === 0 ? (
              <div className="rounded-2xl bg-card p-6 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">{t("noCriticalTasks")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {criticalTasks.map((task, i) => {
                  const isActive = isToday && task.time <= currentTime;
                  return (
                    <div key={task.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                      <TaskCard task={task} isActive={isActive} onDone={markDone} onPostpone={postpone} />
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Flexible Section */}
          <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-base font-bold text-foreground">{t("flexible")}</h2>
              </div>
              {flexibleTasks.length > 0 && (
                <span className="text-xs font-semibold text-muted-foreground">{t("inProgress")}</span>
              )}
            </div>
            {flexibleTasks.length === 0 ? (
              <div className="rounded-2xl bg-card p-6 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">{t("noFlexibleTasks")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {flexibleTasks.map((task, i) => {
                  const isActive = isToday && task.time <= currentTime;
                  return (
                    <div key={task.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                      <TaskCard task={task} isActive={isActive} onDone={markDone} onPostpone={postpone} />
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Done tasks */}
          {doneTasks.length > 0 && (
            <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
                {t("completed")} ({doneTasks.length})
              </h2>
              <div className="space-y-2">
                {doneTasks.map((task) => (
                  <TaskCard key={task.id} task={task} isActive={false} onDone={markDone} onPostpone={postpone} />
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {todayTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <p className="text-base font-bold text-foreground">
                {isToday ? t("noTasksToday") : t("noTasksThisDay")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t("tapToAdd")}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB: Cronograma */}
      {activeTab === "cronograma" && (
        <div className="-mt-1 animate-fade-in">
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

      {/* TAB: Proyectos */}
      {activeTab === "proyectos" && (
        <div className="animate-fade-in">
          <ProjectsView tasks={tasks} />
        </div>
      )}

      {/* TAB: Stats */}
      {activeTab === "stats" && (
        <div className="mx-auto max-w-lg px-4 pt-4 md:max-w-2xl animate-fade-in">
          <WeeklyStats tasks={tasks} />
        </div>
      )}

      {/* TAB: Consejos */}
      {activeTab === "consejos" && <TipsView />}

      {/* TAB: Recordatorios/Config */}
      {activeTab === "recordatorios" && (
        <div className="mx-auto max-w-lg px-4 pt-4 md:max-w-2xl animate-fade-in space-y-4">
          <PwaAssetsStatus />
          <SettingsPanel inline />
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setAddDialogOpen(true)}
        className="fixed right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-95 transition-all cursor-pointer hover:scale-110"
        style={{ bottom: "max(5.5rem, calc(4.5rem + env(safe-area-inset-bottom)))" }}
      >
        <Plus className="h-7 w-7" />
      </button>

      <AddTaskDialog onAdd={addTask} open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      <InstallPrompt />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-card pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg flex items-center justify-between px-1 md:max-w-2xl">
          <NavTab icon={<Target className="h-5 w-5" />} label={t("tabFocus")} active={activeTab === "enfoque"} onClick={() => { setActiveTab("enfoque"); setViewDate(new Date()); }} />
          <NavTab icon={<CalendarDays className="h-5 w-5" />} label={t("tabCalendar")} active={activeTab === "cronograma"} onClick={() => setActiveTab("cronograma")} />
          <NavTab icon={<FolderKanban className="h-5 w-5" />} label={t("tabProjects")} active={activeTab === "proyectos"} onClick={() => setActiveTab("proyectos")} />
          <NavTab icon={<BarChart3 className="h-5 w-5" />} label={t("tabStats")} active={activeTab === "stats"} onClick={() => setActiveTab("stats")} />
          <NavTab icon={<Lightbulb className="h-5 w-5" />} label={t("tabTips")} active={activeTab === "consejos"} onClick={() => setActiveTab("consejos")} />
          <NavTab icon={<Bell className="h-5 w-5" />} label={t("tabSettings")} active={activeTab === "recordatorios"} onClick={() => setActiveTab("recordatorios")} />
        </div>
      </nav>
    </div>
  );
}

function NavTab({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 py-2.5 px-1 cursor-pointer transition-all duration-200 min-w-0 ${
        active ? "bottom-nav-active scale-105" : "bottom-nav-inactive"
      }`}
    >
      {icon}
      <span className="text-[9px] font-bold tracking-wider truncate max-w-full">{label}</span>
    </button>
  );
}
