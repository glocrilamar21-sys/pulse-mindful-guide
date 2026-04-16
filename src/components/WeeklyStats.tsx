import { useMemo } from "react";
import { Task } from "@/lib/tasks";
import { useI18n, dateFnsLocales } from "@/lib/i18n";
import { format, startOfWeek, startOfMonth, endOfMonth, addDays, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { BarChart3, TrendingUp, Flame, Trophy, CalendarRange } from "lucide-react";
import { MedalShowcase } from "@/components/MedalShowcase";

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

  // Monthly cumulative data
  const monthData = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    let cumulative = 0;
    const points = allDays.map((day) => {
      const dayStr = dateToStr(day);
      const dayCompleted = tasks.filter((t) => t.date === dayStr && t.done).length;
      const isFuture = day > today;
      if (!isFuture) cumulative += dayCompleted;
      return {
        date: day,
        dayNum: format(day, "d"),
        completed: dayCompleted,
        cumulative: isFuture ? null : cumulative,
        isToday: isSameDay(day, today),
        isFuture,
      };
    });

    const monthCompleted = tasks.filter((t) => {
      const taskDate = new Date(t.date + "T00:00:00");
      return t.done && isSameMonth(taskDate, today);
    }).length;
    const monthTotal = tasks.filter((t) => {
      const taskDate = new Date(t.date + "T00:00:00");
      return isSameMonth(taskDate, today);
    }).length;
    const activeDays = points.filter((p) => p.completed > 0).length;
    const dailyAvg = activeDays > 0 ? (monthCompleted / activeDays).toFixed(1) : "0";

    return { points, monthCompleted, monthTotal, activeDays, dailyAvg };
  }, [tasks]);

  // SVG path for cumulative line chart
  const chartPath = useMemo(() => {
    const points = monthData.points.filter((p) => p.cumulative !== null);
    if (points.length === 0) return { line: "", area: "", maxCum: 0 };
    const maxCum = Math.max(...points.map((p) => p.cumulative as number), 1);
    const w = 100;
    const h = 100;
    const stepX = points.length > 1 ? w / (points.length - 1) : 0;
    const coords = points.map((p, i) => {
      const x = i * stepX;
      const y = h - ((p.cumulative as number) / maxCum) * h;
      return { x, y };
    });
    const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(" ");
    const area = `${line} L${coords[coords.length - 1].x.toFixed(2)},${h} L0,${h} Z`;
    return { line, area, maxCum };
  }, [monthData]);

  const today = new Date();
  const monthLabel = format(today, "MMMM yyyy", { locale: dateFnsLocale });

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

      {/* Monthly Cumulative Progress */}
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">{t("monthlyProgress")}</h3>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground capitalize">{monthLabel}</span>
        </div>

        {/* Cumulative line chart */}
        <div className="relative w-full h-32 mb-3">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="monthGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="1,1" />
            ))}
            {chartPath.area && <path d={chartPath.area} fill="url(#monthGradient)" />}
            {chartPath.line && (
              <path d={chartPath.line} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            )}
          </svg>
          {chartPath.maxCum > 0 && (
            <>
              <span className="absolute top-0 right-0 text-[9px] font-bold text-muted-foreground bg-card px-1">{chartPath.maxCum}</span>
              <span className="absolute bottom-0 right-0 text-[9px] font-bold text-muted-foreground bg-card px-1">0</span>
            </>
          )}
        </div>

        {/* Day labels (every 5th) */}
        <div className="flex justify-between text-[9px] text-muted-foreground font-semibold px-1">
          {monthData.points.filter((_, i) => i % 5 === 0 || i === monthData.points.length - 1).map((p) => (
            <span key={p.dayNum} className={p.isToday ? "text-primary font-bold" : ""}>
              {p.dayNum}
            </span>
          ))}
        </div>

        {/* Monthly summary stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-lg font-black text-foreground">{monthData.monthCompleted}</p>
            <p className="text-[9px] uppercase tracking-wide text-muted-foreground font-semibold">{t("monthDone")}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-foreground">{monthData.activeDays}</p>
            <p className="text-[9px] uppercase tracking-wide text-muted-foreground font-semibold">{t("monthActiveDays")}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-foreground">{monthData.dailyAvg}</p>
            <p className="text-[9px] uppercase tracking-wide text-muted-foreground font-semibold">{t("monthAvg")}</p>
          </div>
        </div>
      </div>

      {/* Medal showcase — best scores from memory games */}
      <MedalShowcase />

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
