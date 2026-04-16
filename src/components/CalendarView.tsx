import { useMemo } from "react";
import { Task } from "@/lib/tasks";
import { TaskCard } from "@/components/TaskCard";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, format, addMonths, subMonths
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  tasks: Task[];
  viewDate: Date;
  onChangeDate: (d: Date) => void;
  onDone: (id: string) => void;
  onPostpone: (id: string) => void;
  currentTime: string;
}

function dateToStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function CalendarView({ tasks, viewDate, onChangeDate, onDone, onPostpone, currentTime }: CalendarViewProps) {
  const today = new Date();
  const todayStr = dateToStr(today);
  const selectedStr = dateToStr(viewDate);

  const taskMap = useMemo(() => {
    const map: Record<string, { total: number; critical: number; done: number }> = {};
    tasks.forEach((t) => {
      if (!map[t.date]) map[t.date] = { total: 0, critical: 0, done: 0 };
      map[t.date].total++;
      if (t.category === "critical" && !t.done) map[t.date].critical++;
      if (t.done) map[t.date].done++;
    });
    return map;
  }, [tasks]);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const selectedDayTasks = tasks
    .filter((t) => t.date === selectedStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  const weekDays = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 pb-4 md:max-w-2xl">
      {/* Month navigator */}
      <div className="rounded-2xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChangeDate(subMonths(viewDate, 1))}
            className="cursor-pointer h-9 w-9 rounded-full hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-bold capitalize">
            {format(viewDate, "MMMM yyyy", { locale: es })}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChangeDate(addMonths(viewDate, 1))}
            className="cursor-pointer h-9 w-9 rounded-full hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 px-3 pb-2">
          {weekDays.map((d, i) => (
            <div key={i} className="text-center text-xs font-bold text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 px-3 pb-4 gap-y-1">
          {days.map((day) => {
            const dayStr = dateToStr(day);
            const isCurrentMonth = isSameMonth(day, viewDate);
            const isSelected = dayStr === selectedStr;
            const isToday = dayStr === todayStr;
            const info = taskMap[dayStr];

            return (
              <button
                key={dayStr}
                onClick={() => onChangeDate(day)}
                className={cn(
                  "relative flex flex-col items-center justify-center h-11 rounded-xl cursor-pointer transition-all",
                  !isCurrentMonth && "opacity-25",
                  isSelected && "bg-primary text-primary-foreground",
                  !isSelected && isToday && "bg-accent text-accent-foreground font-bold",
                  !isSelected && !isToday && "hover:bg-muted"
                )}
              >
                <span className={cn(
                  "text-sm font-semibold",
                  isSelected && "text-primary-foreground"
                )}>
                  {format(day, "d")}
                </span>
                {info && info.total > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {info.critical > 0 && (
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isSelected ? "bg-primary-foreground/70" : "bg-[hsl(var(--critical))]"
                      )} />
                    )}
                    {(info.total - info.critical - info.done) > 0 && (
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isSelected ? "bg-primary-foreground/70" : "bg-primary"
                      )} />
                    )}
                    {info.done > 0 && (
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isSelected ? "bg-primary-foreground/50" : "bg-[hsl(var(--success))]"
                      )} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day tasks */}
      <div className="flex items-center justify-between mt-5 mb-3 px-1">
        <h3 className="text-base font-bold text-foreground">
          {isSameDay(viewDate, today)
            ? "Tareas para hoy"
            : `Tareas para el ${format(viewDate, "d 'de' MMM", { locale: es })}`}
        </h3>
        {selectedDayTasks.length > 0 && (
          <span className="text-xs font-semibold text-muted-foreground">
            {selectedDayTasks.length} Eventos
          </span>
        )}
      </div>

      {selectedDayTasks.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <CalendarDays className="h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Sin tareas este día</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-card shadow-sm overflow-hidden divide-y divide-border">
          {selectedDayTasks.map((task) => {
            const isActive = dateToStr(today) === task.date && !task.done && task.time <= currentTime;
            return (
              <TaskCard
                key={task.id}
                task={task}
                isActive={isActive}
                onDone={onDone}
                onPostpone={onPostpone}
                variant="compact"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
