import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Briefcase, GraduationCap, Home, Heart } from "lucide-react";
import { TaskCategory, generateId, Task } from "@/lib/tasks";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { dateFnsLocales } from "@/lib/i18n";
import { taskIcons, suggestIcon } from "@/lib/taskIcons";

interface AddTaskDialogProps {
  onAdd: (task: Task) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTaskDialog({ onAdd, open, onOpenChange }: AddTaskDialogProps) {
  const { t, locale } = useI18n();
  const dateFnsLocale = dateFnsLocales[locale];

  const scopes = [
    { id: "trabajo", label: t("work"), icon: Briefcase },
    { id: "estudio", label: t("study"), icon: GraduationCap },
    { id: "hogar", label: t("home"), icon: Home },
    { id: "personal", label: t("personal"), icon: Heart },
  ];

  const [name, setName] = useState("");
  const [time, setTime] = useState("09:00");
  const [category, setCategory] = useState<TaskCategory>("flexible");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scope, setScope] = useState("personal");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [showAllIcons, setShowAllIcons] = useState(false);

  // Auto-suggest icon based on task name
  const autoIcon = useMemo(() => suggestIcon(name), [name]);

  useEffect(() => {
    if (open) {
      setName(""); setTime("09:00"); setCategory("flexible");
      setSelectedDate(new Date()); setScope("personal");
      setSelectedIcon(""); setShowAllIcons(false);
    }
  }, [open]);

  // When auto-icon changes and user hasn't manually selected, follow suggestion
  useEffect(() => {
    if (autoIcon && !selectedIcon) {
      setSelectedIcon(autoIcon);
    }
  }, [autoIcon]);

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
      icon: selectedIcon || autoIcon || undefined,
    });
    onOpenChange(false);
  };

  const displayedIcons = showAllIcons ? taskIcons : taskIcons.slice(0, 12);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-5">
          <DialogHeader className="p-0">
            <DialogTitle className="text-xl font-bold">{t("taskIdentity")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("contextDetails")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("taskPlaceholder")} className="h-12 text-sm rounded-xl border-border" autoFocus />
          </div>

          {/* Icon Picker */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Icono</h3>
            <div className="flex flex-wrap gap-2">
              {displayedIcons.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = (selectedIcon || autoIcon) === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedIcon(opt.id)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md scale-110"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:scale-105"
                    )}
                  >
                    <IconComp className="h-4.5 w-4.5" />
                  </button>
                );
              })}
            </div>
            {!showAllIcons && taskIcons.length > 12 && (
              <button
                type="button"
                onClick={() => setShowAllIcons(true)}
                className="text-xs font-semibold text-primary cursor-pointer hover:underline"
              >
                + Ver todos los iconos
              </button>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("timeline")}</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <CalendarIcon className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-sm font-semibold text-foreground cursor-pointer hover:text-primary transition-colors">
                      {format(selectedDate, "MMM d, yyyy", { locale: dateFnsLocale })}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                    <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <span className="text-xs font-semibold text-primary bg-accent px-2.5 py-1 rounded-full">{t("todayLabel")}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">{t("moment")}</Label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-8 text-sm font-semibold border-0 bg-transparent p-0 shadow-none cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("priorityStrategy")}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setCategory("flexible")} className={cn("flex items-center justify-center gap-2 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm", category === "flexible" ? "bg-primary text-primary-foreground shadow-md scale-105" : "bg-muted/50 text-muted-foreground hover:bg-muted")}>
                {t("flexible")}
              </button>
              <button onClick={() => setCategory("critical")} className={cn("flex items-center justify-center gap-2 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm", category === "critical" ? "bg-[hsl(var(--critical))] text-[hsl(var(--critical-foreground))] shadow-md scale-105" : "bg-muted/50 text-muted-foreground hover:bg-muted")}>
                {t("critical")}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("activityScope")}</h3>
            <div className="flex flex-wrap gap-2">
              {scopes.map((s) => (
                <button key={s.id} onClick={() => setScope(s.id)} className={cn("flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer", scope === s.id ? "bg-primary text-primary-foreground scale-105" : "bg-muted/50 text-muted-foreground hover:bg-muted")}>
                  <s.icon className="h-3.5 w-3.5" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="h-12 w-full rounded-xl text-sm font-bold cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground active:scale-95 transition-transform" disabled={!name.trim()}>
            {t("createTask")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
