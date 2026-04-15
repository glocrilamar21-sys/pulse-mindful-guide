import { playDemoSound } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Volume2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface SettingsPanelProps {
  trigger?: React.ReactNode;
}

export function SettingsPanel({ trigger }: SettingsPanelProps) {
  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full cursor-pointer">
            <Volume2 className="h-4 w-4" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold">Configuración</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-foreground">
              <Volume2 className="h-4 w-4" />
              Probar Alertas
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Escucha y siente cada tipo de alerta. Se repite hasta completar la tarea.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => playDemoSound("critical")}
                size="lg"
                className="h-12 w-full gap-2 bg-critical hover:bg-critical/80 text-critical-foreground text-sm font-bold cursor-pointer rounded-lg"
              >
                <AlertTriangle className="h-4 w-4" />
                🔊 Alerta Crítica
              </Button>
              <Button
                onClick={() => playDemoSound("flexible")}
                size="lg"
                className="h-12 w-full gap-2 bg-primary hover:bg-primary/80 text-primary-foreground text-sm font-bold cursor-pointer rounded-lg"
              >
                <Clock className="h-4 w-4" />
                🔔 Alerta Flexible
              </Button>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-background">
            <h4 className="font-bold text-sm mb-1">Acerca de Memory Help</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Asistente de memoria que usa vibraciones y sonidos para recordarte tus tareas importantes del día.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
