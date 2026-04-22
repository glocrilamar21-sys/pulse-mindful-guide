import { useState } from "react";
import {
  Smartphone,
  Apple,
  Monitor,
  Loader2,
  Trash2,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

type Platform = "android" | "ios" | "desktop";

interface PlatformGuide {
  id: Platform;
  label: string;
  Icon: typeof Smartphone;
  steps: string[];
}

const PLATFORM_GUIDES: PlatformGuide[] = [
  {
    id: "android",
    label: "Android",
    Icon: Smartphone,
    steps: [
      "Mantén pulsado el icono de Memory Help en tu pantalla de inicio.",
      "Toca «Desinstalar» (o arrástralo al icono de papelera).",
      "Abre Chrome y ve a memory-help.lovable.app (o tu URL publicada).",
      "Pulsa el menú ⋮ → «Instalar app» o «Añadir a pantalla de inicio».",
      "El icono aparecerá con el cerebro sonriente y el borde rojo.",
    ],
  },
  {
    id: "ios",
    label: "iPhone / iPad",
    Icon: Apple,
    steps: [
      "Mantén pulsado el icono de Memory Help en la pantalla de inicio.",
      "Toca «Eliminar app» → «Eliminar de la pantalla de inicio».",
      "Abre Safari y ve a la URL publicada de la app.",
      "Toca el botón Compartir (cuadrado con flecha hacia arriba).",
      "Selecciona «Añadir a pantalla de inicio» y confirma.",
    ],
  },
  {
    id: "desktop",
    label: "Escritorio",
    Icon: Monitor,
    steps: [
      "Pulsa primero el botón «Limpiar caché y recargar» de abajo.",
      "Si aún ves el icono viejo: abre chrome://apps (o edge://apps).",
      "Haz clic derecho sobre Memory Help → «Eliminar de Chrome».",
      "Vuelve a la web, abre el menú ⋮ → «Instalar Memory Help».",
    ],
  },
];

async function hardRefresh(): Promise<{
  caches: number;
  serviceWorkers: number;
}> {
  let cachesCleared = 0;
  let swUnregistered = 0;

  // 1. Borrar todas las cachés del navegador para este origen
  if ("caches" in window) {
    try {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(async (k) => {
          const ok = await caches.delete(k);
          if (ok) cachesCleared += 1;
        }),
      );
    } catch {
      /* ignore */
    }
  }

  // 2. Desregistrar service workers para que la próxima carga sea fresca
  if ("serviceWorker" in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        regs.map(async (r) => {
          const ok = await r.unregister();
          if (ok) swUnregistered += 1;
        }),
      );
    } catch {
      /* ignore */
    }
  }

  return { caches: cachesCleared, serviceWorkers: swUnregistered };
}

export function PwaHardRefresh() {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>(() => {
    if (typeof navigator === "undefined") return "desktop";
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return "ios";
    if (/android/.test(ua)) return "android";
    return "desktop";
  });
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const guide =
    PLATFORM_GUIDES.find((g) => g.id === platform) ?? PLATFORM_GUIDES[0];

  const handleHardRefresh = async () => {
    setRefreshing(true);
    const { caches, serviceWorkers } = await hardRefresh();
    setRefreshing(false);

    toast({
      title: "Caché limpiada",
      description: `${caches} caché(s) y ${serviceWorkers} service worker(s) eliminados. Recargando…`,
    });

    // Pequeño delay para que el toast sea visible antes del reload
    setTimeout(() => {
      window.location.reload();
    }, 900);
  };

  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-start gap-2">
        <RefreshCw className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="min-w-0">
          <h3 className="text-base font-bold text-foreground">
            Recargar la PWA en este dispositivo
          </h3>
          <p className="text-xs text-muted-foreground leading-snug">
            Si todavía ves iconos antiguos o el nombre «Pulso Diario», borra la
            caché local y recarga. Si persiste, reinstala la app siguiendo los
            pasos según tu dispositivo.
          </p>
        </div>
      </div>

      <Button
        size="lg"
        variant="default"
        onClick={handleHardRefresh}
        disabled={refreshing}
        className="w-full"
      >
        {refreshing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        <span className="ml-2">
          {refreshing ? "Limpiando…" : "Limpiar caché y recargar"}
        </span>
      </Button>

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background p-3 text-left transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="h-4 w-4 text-[hsl(var(--critical))] shrink-0" />
              <span className="text-sm font-semibold text-foreground">
                ¿Sigue saliendo el icono viejo? Reinstalar
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-3 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {PLATFORM_GUIDES.map((g) => {
              const active = g.id === platform;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setPlatform(g.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-bold transition-all ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <g.Icon className="h-5 w-5" />
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>

          <ol className="space-y-2 rounded-xl border border-border bg-background p-3">
            {guide.steps.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {idx + 1}
                </span>
                <span className="text-sm text-foreground leading-snug">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          <p className="text-[11px] text-muted-foreground leading-snug">
            💡 La caché del icono la guarda el sistema operativo, no el
            servidor. Reinstalar es la única forma 100 % fiable de actualizar
            el icono de una PWA ya instalada.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
