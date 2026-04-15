import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, AlertTriangle, Clock, CalendarIcon } from "lucide-react";
import { TaskCategory, generateId, Task } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AddTaskDialogProps {
  onAdd: (task: Task) => void;
}

export function AddTaskDialog({ onAdd }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [time, setTime] = useState("08:00");
  const [category, setCategory] = useState<TaskCategory>("flexible");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
    });
    setName("");
    setTime("08:00");
    setCategory("flexible");
    setSelectedDate(new Date());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-14 w-full text-base font-bold gap-2 cursor-pointer rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
          <Plus className="h-5 w-5" />
          Crear Tarea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Nueva Tarea</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-1">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-foreground">Nombre de la tarea</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Tomar pastilla"
              className="h-12 text-base rounded-xl bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-foreground">Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 text-base justify-start text-left font-normal cursor-pointer rounded-xl",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {format(selectedDate, "PPP", { locale: es })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-foreground">Hora</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-12 text-base cursor-pointer rounded-xl bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-foreground">Categoría</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCategory("critical")}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all cursor-pointer hover:scale-[1.02]",
                  category === "critical"
                    ? "border-critical bg-critical/8 shadow-sm"
                    : "border-border hover:border-critical/40"
                )}
              >
                <AlertTriangle className="h-6 w-6 text-critical" />
                <span className="text-xs font-bold text-critical">Crítica</span>
              </button>
              <button
                onClick={() => setCategory("flexible")}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all cursor-pointer hover:scale-[1.02]",
                  category === "flexible"
                    ? "border-primary bg-primary/8 shadow-sm"
                    : "border-border hover:border-primary/40"
                )}
              >
                <Clock className="h-6 w-6 text-primary" />
                <span className="text-xs font-bold text-primary">Flexible</span>
              </button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            size="lg"
            className="h-12 w-full text-base font-bold cursor-pointer rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
            disabled={!name.trim()}
          >
            Crear Tarea
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
