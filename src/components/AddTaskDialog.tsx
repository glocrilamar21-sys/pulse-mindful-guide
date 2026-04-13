import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, AlertTriangle, Clock } from "lucide-react";
import { TaskCategory, generateId, Task } from "@/lib/tasks";
import { cn } from "@/lib/utils";

interface AddTaskDialogProps {
  onAdd: (task: Task) => void;
}

export function AddTaskDialog({ onAdd }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [time, setTime] = useState("08:00");
  const [category, setCategory] = useState<TaskCategory>("flexible");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      id: generateId(),
      name: name.trim(),
      category,
      time,
      done: false,
    });
    setName("");
    setTime("08:00");
    setCategory("flexible");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-16 w-full text-lg font-bold gap-3">
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
            <Label className="text-base font-semibold">Hora</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-14 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Categoría</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCategory("critical")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
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
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
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
            className="h-14 w-full text-lg font-bold"
            disabled={!name.trim()}
          >
            Guardar Tarea
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
