import { Task } from "@/lib/tasks";
import { Briefcase, BookOpen, Home, Heart, Stethoscope, TrendingUp } from "lucide-react";

interface ProjectsViewProps {
  tasks: Task[];
}

const categories = [
  { id: "trabajo", label: "Trabajo", icon: Briefcase, color: "hsl(var(--primary))" },
  { id: "estudio", label: "Estudio", icon: BookOpen, color: "hsl(35, 95%, 55%)" },
  { id: "hogar", label: "Hogar", icon: Home, color: "hsl(var(--success))" },
  { id: "personal", label: "Personal", icon: Heart, color: "hsl(280, 60%, 55%)" },
  { id: "salud", label: "Salud", icon: Stethoscope, color: "hsl(var(--critical))" },
];

export function ProjectsView({ tasks }: ProjectsViewProps) {
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const overallPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => (t.scope || "personal") === cat.id);
    const catDone = catTasks.filter((t) => t.done).length;
    const percent = catTasks.length > 0 ? Math.round((catDone / catTasks.length) * 100) : 0;
    return { ...cat, total: catTasks.length, done: catDone, percent };
  });

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 space-y-6 md:max-w-2xl">
      {/* Overall Progress */}
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Progreso General</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {doneTasks} de {totalTasks} tareas completadas
            </p>
          </div>
          <div className="relative h-16 w-16">
            <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={`${overallPercent}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
              {overallPercent}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
          <span>{overallPercent >= 50 ? "¡Buen ritmo!" : "¡Sigue avanzando!"}</span>
        </div>
      </div>

      {/* Category Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Categorías
        </h3>
        {categoryStats.map((cat) => (
          <div key={cat.id} className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: cat.color + "18" }}
              >
                <cat.icon className="h-5 w-5" style={{ color: cat.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">{cat.label}</h4>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {cat.done}/{cat.total}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cat.total === 0
                    ? "Sin tareas"
                    : `${cat.percent}% completado`}
                </p>
              </div>
            </div>
            {cat.total > 0 && (
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percent}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
