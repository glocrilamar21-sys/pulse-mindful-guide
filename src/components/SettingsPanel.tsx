import { playDemoSound } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Settings, Volume2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function SettingsPanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-12 w-12 cursor-pointer">
          <Settings className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl">Configuración</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-base font-bold mb-3 flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Probar Alertas
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Haz clic o presiona para escuchar y sentir cada tipo de alerta. En tareas activas, la alerta se repite hasta que marques la tarea como hecha o la postergues.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => playDemoSound("critical")}
                size="lg"
                className="h-16 w-full gap-3 bg-critical hover:bg-critical/80 text-critical-foreground text-base font-bold cursor-pointer"
              >
                <AlertTriangle className="h-6 w-6" />
                🔊 Alerta Crítica (fuerte)
              </Button>
              <Button
                onClick={() => playDemoSound("flexible")}
                size="lg"
                className="h-16 w-full gap-3 bg-flexible hover:bg-flexible/80 text-flexible-foreground text-base font-bold cursor-pointer"
              >
                <Clock className="h-6 w-6" />
                🔔 Alerta Flexible (moderada)
              </Button>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-card">
            <h4 className="font-bold mb-2">Acerca de Pulso Diario</h4>
            <p className="text-sm text-muted-foreground">
              Asistente de memoria que usa vibraciones y sonidos diferenciados para recordarte tus tareas importantes del día.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
