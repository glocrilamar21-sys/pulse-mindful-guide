import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, AlertTriangle, Clock, CalendarIcon } from "lucide-react";
import { TaskCategory, generateId, Task, todayStr } from "@/lib/tasks";
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
        <Button size="lg" className="h-16 w-full text-lg font-bold gap-3 cursor-pointer">
          <Plus className="h-6 w-6" />
          Agregar Tarea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Nueva Tarea</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Nombre de la tarea</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Tomar pastilla"
              className="h-14 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-14 text-lg justify-start text-left font-normal cursor-pointer",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {format(selectedDate, "PPP", { locale: es })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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

          <div className="space-y-2">
            <Label className="text-base font-semibold">Hora</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-14 text-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Categoría</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCategory("critical")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all cursor-pointer hover:scale-105",
                  category === "critical"
                    ? "border-critical bg-critical/15"
                    : "border-border hover:border-critical/50"
                )}
              >
                <AlertTriangle className="h-8 w-8 text-critical" />
                <span className="text-sm font-bold text-critical">Crítica</span>
              </button>
              <button
                onClick={() => setCategory("flexible")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all cursor-pointer hover:scale-105",
                  category === "flexible"
                    ? "border-flexible bg-flexible/15"
                    : "border-border hover:border-flexible/50"
                )}
              >
                <Clock className="h-8 w-8 text-flexible" />
                <span className="text-sm font-bold text-flexible">Flexible</span>
              </button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            size="lg"
            className="h-14 w-full text-lg font-bold cursor-pointer"
            disabled={!name.trim()}
          >
            Guardar Tarea
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
