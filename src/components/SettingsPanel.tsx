import { playDemoSound } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Settings, Volume2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function SettingsPanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full cursor-pointer hover:bg-accent">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
      </SheetTrigger>
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
              Escucha y siente cada tipo de alerta. En tareas activas, se repite hasta completarla.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => playDemoSound("critical")}
                size="lg"
                className="h-14 w-full gap-2 bg-critical hover:bg-critical/80 text-critical-foreground text-sm font-bold cursor-pointer rounded-xl"
              >
                <AlertTriangle className="h-5 w-5" />
                🔊 Alerta Crítica
              </Button>
              <Button
                onClick={() => playDemoSound("flexible")}
                size="lg"
                className="h-14 w-full gap-2 bg-primary hover:bg-primary/80 text-primary-foreground text-sm font-bold cursor-pointer rounded-xl"
              >
                <Clock className="h-5 w-5" />
                🔔 Alerta Flexible
              </Button>
            </div>
          </div>
          <div className="rounded-xl border p-4 bg-card">
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
