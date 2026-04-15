import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle, Clock, CalendarIcon } from "lucide-react";
import { TaskCategory, generateId, Task } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AddTaskDialogProps {
  onAdd: (task: Task) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTaskDialog({ onAdd, open, onOpenChange }: AddTaskDialogProps) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("08:00");
  const [category, setCategory] = useState<TaskCategory>("flexible");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (open) {
      setName("");
      setTime("08:00");
      setCategory("flexible");
      setSelectedDate(new Date());
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
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Nueva Tarea</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nombre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Tomar pastilla"
              className="h-11 text-sm rounded-lg"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 text-sm justify-start text-left font-normal cursor-pointer rounded-lg"
                  >
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                    {format(selectedDate, "d MMM", { locale: es })}
                  </Button>
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

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hora</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-11 text-sm cursor-pointer rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Categoría</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCategory("critical")}
                className={cn(
                  "flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 transition-all cursor-pointer",
                  category === "critical"
                    ? "border-critical bg-critical/8"
                    : "border-border hover:border-critical/40"
                )}
              >
                <AlertTriangle className="h-4 w-4 text-critical" />
                <span className="text-xs font-bold text-critical">Crítica</span>
              </button>
              <button
                onClick={() => setCategory("flexible")}
                className={cn(
                  "flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 transition-all cursor-pointer",
                  category === "flexible"
                    ? "border-primary bg-accent"
                    : "border-border hover:border-primary/40"
                )}
              >
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary">Flexible</span>
              </button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="h-11 w-full text-sm font-bold cursor-pointer rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!name.trim()}
          >
            Crear Tarea
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
