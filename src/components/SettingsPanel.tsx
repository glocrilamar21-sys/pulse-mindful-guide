import { vibrateCritical, vibrateFlexible } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function SettingsPanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-12 w-12">
          <Settings className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl">Configuración</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-base font-bold mb-3">Probar Vibraciones</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Pulsa los botones para familiarizarte con cada tipo de vibración.
            </p>
            <div className="space-y-3">
              <Button
                onClick={vibrateCritical}
                size="lg"
                className="h-16 w-full gap-3 bg-critical hover:bg-critical/80 text-critical-foreground text-base font-bold"
              >
                <AlertTriangle className="h-6 w-6" />
                Vibración Crítica (fuerte)
              </Button>
              <Button
                onClick={vibrateFlexible}
                size="lg"
                className="h-16 w-full gap-3 bg-flexible hover:bg-flexible/80 text-flexible-foreground text-base font-bold"
              >
                <Clock className="h-6 w-6" />
                Vibración Flexible (suave)
              </Button>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-card">
            <h4 className="font-bold mb-2">Acerca de Pulso Diario</h4>
            <p className="text-sm text-muted-foreground">
              Asistente de memoria que usa vibraciones diferenciadas para recordarte tus tareas importantes del día.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
