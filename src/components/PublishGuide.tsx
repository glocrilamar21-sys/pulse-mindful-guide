import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Monitor,
  Smartphone,
  Globe,
  MoreHorizontal,
  Play,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type Platform = "mobile" | "desktop";

interface Step {
  icon: React.ReactNode;
  title: string;
  detail: string;
}

const DESKTOP_STEPS: Step[] = [
  {
    icon: <Globe className="h-4 w-4" />,
    title: "Mira la esquina superior derecha del editor",
    detail:
      'Verás un botón con un icono de globo que dice "Publish" (o "Published" si ya publicaste antes).',
  },
  {
    icon: <Play className="h-4 w-4" />,
    title: 'Haz clic en "Publish"',
    detail: "Se abrirá un diálogo con la información del último deploy.",
  },
  {
    icon: <RefreshCw className="h-4 w-4" />,
    title: 'Pulsa el botón azul "Update"',
    detail: "Lovable subirá los archivos nuevos al CDN. Tarda unos segundos.",
  },
  {
    icon: <CheckCircle2 className="h-4 w-4" />,
    title: "Vuelve aquí y verifica",
    detail:
      'Pulsa "Verificar de nuevo" arriba. Cuando los 7 assets estén en verde, el icono "Memory Help" estará al día.',
  },
];

const MOBILE_STEPS: Step[] = [
  {
    icon: <MoreHorizontal className="h-4 w-4" />,
    title: "Toca el botón ··· en la esquina inferior derecha",
    detail: "Estás en el editor de Lovable, no en esta app. Abre el menú flotante.",
  },
  {
    icon: <Globe className="h-4 w-4" />,
    title: 'Selecciona "Publish"',
    detail: "Se abrirá el diálogo de publicación con el estado del último deploy.",
  },
  {
    icon: <RefreshCw className="h-4 w-4" />,
    title: 'Toca el botón azul "Update"',
    detail: "Espera a que termine el proceso (10–30 segundos).",
  },
  {
    icon: <CheckCircle2 className="h-4 w-4" />,
    title: "Vuelve a esta pantalla y verifica",
    detail:
      'Pulsa "Verificar de nuevo" arriba. Si los 7 assets están en verde, ya está. Si la PWA instalada sigue mostrando el icono viejo, pulsa "Actualizar iconos en producción".',
  },
];

export function PublishGuide() {
  const isMobileViewport = useIsMobile();
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [open, setOpen] = useState(false);

  // Auto-select tab based on viewport on first mount, but let the user override.
  useEffect(() => {
    setPlatform(isMobileViewport ? "mobile" : "desktop");
  }, [isMobileViewport]);

  const steps = platform === "mobile" ? MOBILE_STEPS : DESKTOP_STEPS;

  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm space-y-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="h-5 w-5 text-primary shrink-0" />
          <div className="min-w-0">
            <h3 className="text-base font-bold text-foreground">
              Cómo publicar los cambios (Publish → Update)
            </h3>
            <p className="text-xs text-muted-foreground">
              Guía paso a paso para subir el icono nuevo al CDN.
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground shrink-0 mt-1 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="space-y-4 animate-fade-in">
          {/* Platform selector */}
          <div
            role="tablist"
            aria-label="Plataforma"
            className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1"
          >
            <button
              role="tab"
              aria-selected={platform === "desktop"}
              onClick={() => setPlatform("desktop")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                platform === "desktop"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor className="h-4 w-4" />
              Escritorio
            </button>
            <button
              role="tab"
              aria-selected={platform === "mobile"}
              onClick={() => setPlatform("mobile")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                platform === "mobile"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="h-4 w-4" />
              Móvil
            </button>
          </div>

          {/* Hint about auto-detection */}
          <p className="text-[11px] text-muted-foreground -mt-2">
            Detectado: <strong>{isMobileViewport ? "móvil" : "escritorio"}</strong>. Cambia
            arriba si usas Lovable en otro dispositivo.
          </p>

          {/* Steps */}
          <ol className="space-y-3">
            {steps.map((step, idx) => (
              <li
                key={idx}
                className="flex gap-3 rounded-lg border border-border bg-background p-3"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">{step.icon}</span>
                    <p className="text-sm font-bold text-foreground">{step.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Final tip */}
          <div className="rounded-xl border border-[hsl(var(--flexible))]/40 bg-[hsl(var(--flexible))]/5 p-3">
            <p className="text-xs text-foreground leading-snug">
              💡 <strong>Tip:</strong> los cambios de frontend (iconos, nombre, UI) requieren
              Publish → Update para verse en producción. Los cambios de backend se publican
              automáticamente.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
