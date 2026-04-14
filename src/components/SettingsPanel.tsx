import { vibrateCritical, vibrateFlexible } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Settings, Volume2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function playCriticalSound() {
  const ctx = new AudioContext();
  // Strong intermittent beeps matching vibration pattern [300,100,300,100,300,100,300]
  const times = [0, 0.4, 0.8, 1.2]; // 300ms on, 100ms gap
  times.forEach((start) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 600;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + 0.3);
  });
}

function playFlexibleSound() {
  const ctx = new AudioContext();
  // Single soft pulse matching vibration pattern [200]
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 440;
  gain.gain.value = 0.2;
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

function handleCritical() {
  vibrateCritical();
  playCriticalSound();
}

function handleFlexible() {
  vibrateFlexible();
  playFlexibleSound();
}

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
              Probar Vibraciones y Sonidos
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Haz clic o presiona los botones para escuchar y sentir cada tipo de alerta.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleCritical}
                size="lg"
                className="h-16 w-full gap-3 bg-critical hover:bg-critical/80 text-critical-foreground text-base font-bold cursor-pointer"
              >
                <AlertTriangle className="h-6 w-6" />
                🔊 Alerta Crítica (fuerte)
              </Button>
              <Button
                onClick={handleFlexible}
                size="lg"
                className="h-16 w-full gap-3 bg-flexible hover:bg-flexible/80 text-flexible-foreground text-base font-bold cursor-pointer"
              >
                <Clock className="h-6 w-6" />
                🔔 Alerta Flexible (suave)
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
