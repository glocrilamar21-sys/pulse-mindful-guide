import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle, Clock, CalendarIcon, Briefcase, GraduationCap, Home, Heart, Plus } from "lucide-react";
import { TaskCategory, generateId, Task } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AddTaskDialogProps {
  onAdd: (task: Task) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const scopes = [
  { id: "trabajo", label: "Trabajo", icon: Briefcase },
  { id: "estudio", label: "Estudio", icon: GraduationCap },
  { id: "hogar", label: "Hogar", icon: Home },
  { id: "personal", label: "Personal", icon: Heart },
];

export function AddTaskDialog({ onAdd, open, onOpenChange }: AddTaskDialogProps) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("09:00");
  const [category, setCategory] = useState<TaskCategory>("flexible");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scope, setScope] = useState("personal");

  useEffect(() => {
    if (open) {
      setName("");
      setTime("09:00");
      setCategory("flexible");
      setSelectedDate(new Date());
      setScope("personal");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    const d = selectedDate;
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    onAdd({
      id: generateId(),
      name: name.trim(),
      category,
      time,
      date: dateStr,
      done: false,
      scope: scope as Task["scope"],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden">
        <div className="p-6 space-y-5">
          <DialogHeader className="p-0">
            <DialogTitle className="text-xl font-bold">Identidad de la Tarea</DialogTitle>
          </DialogHeader>

          {/* Task Name */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Detalles contextuales
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Tomar medicación matutina"
              className="h-12 text-sm rounded-xl border-border"
              autoFocus
            />
          </div>

          {/* Timeline Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Línea de tiempo
            </h3>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <CalendarIcon className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-sm font-semibold text-foreground cursor-pointer hover:text-primary transition-colors">
                      {format(selectedDate, "MMM d, yyyy", { locale: es })}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => d && setSelectedDate(d)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <span className="text-xs font-semibold text-primary bg-accent px-2.5 py-1 rounded-full">
                Hoy
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Momento</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-8 text-sm font-semibold border-0 bg-transparent p-0 shadow-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Priority Strategy */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Estrategia de Prioridad
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCategory("flexible")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm",
                  category === "flexible"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                Flexible
              </button>
              <button
                onClick={() => setCategory("critical")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm",
                  category === "critical"
                    ? "bg-[hsl(var(--critical))] text-[hsl(var(--critical-foreground))] shadow-md"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                Crítica
              </button>
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Ámbito de Actividad
            </h3>
            <div className="flex flex-wrap gap-2">
              {scopes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScope(s.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer",
                    scope === s.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <s.icon className="h-3.5 w-3.5" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            className="h-12 w-full rounded-xl text-sm font-bold cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!name.trim()}
          >
            Crear Tarea
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
