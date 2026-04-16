import { useMemo } from "react";
import { Task } from "@/lib/tasks";
import { useI18n, dateFnsLocales } from "@/lib/i18n";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { BarChart3, TrendingUp, Flame, Trophy } from "lucide-react";

interface WeeklyStatsProps {
  tasks: Task[];
}

function dateToStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function WeeklyStats({ tasks }: WeeklyStatsProps) {
  const { t, locale } = useI18n();
  const dateFnsLocale = dateFnsLocales[locale];

  const weekData = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(weekStart, i);
      const dayStr = dateToStr(day);
      const dayTasks = tasks.filter((t) => t.date === dayStr);
      const completed = dayTasks.filter((t) => t.done).length;
      const total = dayTasks.length;
      return {
        date: day,
        dateStr: dayStr,
        label: format(day, "EEE", { locale: dateFnsLocale }),
        dayNum: format(day, "d"),
        completed,
        total,
        isToday: isSameDay(day, today),
      };
    });
    return days;
  }, [tasks, dateFnsLocale]);

  const weekCompleted = weekData.reduce((sum, d) => sum + d.completed, 0);
  const weekTotal = weekData.reduce((sum, d) => sum + d.total, 0);
  const maxCompleted = Math.max(...weekData.map((d) => d.completed), 1);

  // Streak: consecutive days with all tasks done (backwards from yesterday/today)
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const day = addDays(today, -i);
      const dayStr = dateToStr(day);
      const dayTasks = tasks.filter((t) => t.date === dayStr);
      if (dayTasks.length === 0) continue; // skip days without tasks
      if (dayTasks.every((t) => t.done)) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [tasks]);

  const weekPercent = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-card p-4 shadow-sm text-center">
          <div className="flex justify-center mb-2">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground">{weekCompleted}</p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">{t("weekCompleted")}</p>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-sm text-center">
          <div className="flex justify-center mb-2">
            <div className="h-9 w-9 rounded-full bg-[hsl(var(--success))]/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-[hsl(var(--success))]" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground">{weekPercent}%</p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">{t("weekEfficiency")}</p>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-sm text-center">
          <div className="flex justify-center mb-2">
            <div className="h-9 w-9 rounded-full bg-destructive/10 flex items-center justify-center">
              <Flame className="h-4 w-4 text-destructive" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground">{streak}</p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">{t("weekStreak")}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">{t("weeklyActivity")}</h3>
        </div>

        <div className="flex items-end justify-between gap-2 h-36">
          {weekData.map((day) => {
            const barHeight = maxCompleted > 0 ? (day.completed / maxCompleted) * 100 : 0;
            return (
              <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-1.5">
                {/* Count label */}
                <span className="text-[10px] font-bold text-muted-foreground">
                  {day.completed > 0 ? day.completed : ""}
                </span>
                {/* Bar */}
                <div className="w-full flex items-end" style={{ height: "100px" }}>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      day.isToday
                        ? "bg-primary"
                        : day.completed > 0
                        ? "bg-primary/40"
                        : "bg-muted"
                    }`}
                    style={{
                      height: `${Math.max(barHeight, 4)}%`,
                      minHeight: "4px",
                    }}
                  />
                </div>
                {/* Day label */}
                <span
                  className={`text-[10px] font-bold capitalize ${
                    day.isToday ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {day.label}
                </span>
                <span
                  className={`text-[9px] ${
                    day.isToday ? "text-primary font-bold" : "text-muted-foreground"
                  }`}
                >
                  {day.dayNum}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-3">{t("weekDetail")}</h3>
        <div className="space-y-2">
          {weekData.map((day) => (
            <div
              key={day.dateStr}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
                day.isToday ? "bg-primary/10 ring-1 ring-primary/20" : "bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold capitalize text-foreground">
                  {format(day.date, "EEEE", { locale: dateFnsLocale })}
                </span>
                {day.isToday && (
                  <span className="text-[9px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded-full">
                    {t("today")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {day.completed}/{day.total}
                </span>
                {day.total > 0 && (
                  <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${day.total > 0 ? (day.completed / day.total) * 100 : 0}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational message */}
      {weekCompleted > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 p-4 text-center">
          <p className="text-sm font-bold text-foreground">
            {weekPercent >= 80 ? "🏆 " : weekPercent >= 50 ? "💪 " : "🌱 "}
            {t(weekPercent >= 80 ? "weekExcellent" : weekPercent >= 50 ? "weekGoodJob" : "weekKeepGoing")}
          </p>
        </div>
      )}
    </div>
  );
}
