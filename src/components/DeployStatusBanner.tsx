import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Loader2, X } from "lucide-react";

const ASSETS_TO_CHECK = [
  "/manifest.json",
  "/favicon.png",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-192.png",
  "/icon-maskable-512.png",
];

async function countFailures(): Promise<{ failed: string[]; total: number }> {
  const results = await Promise.all(
    ASSETS_TO_CHECK.map(async (path) => {
      try {
        const res = await fetch(path, { method: "GET", cache: "no-store" });
        return { path, ok: res.ok };
      } catch {
        return { path, ok: false };
      }
    }),
  );
  return {
    failed: results.filter((r) => !r.ok).map((r) => r.path),
    total: results.length,
  };
}

export function DeployStatusBanner() {
  const [failed, setFailed] = useState<string[]>([]);
  const [checking, setChecking] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  const runCheck = async () => {
    setChecking(true);
    const { failed } = await countFailures();
    setFailed(failed);
    setChecking(false);
  };

  useEffect(() => {
    runCheck();
  }, []);

  if (dismissed || (!checking && failed.length === 0)) return null;

  return (
    <div className="mx-auto max-w-lg px-4 pt-3 md:max-w-2xl">
      <div className="rounded-2xl border-2 border-[hsl(var(--critical))] bg-[hsl(var(--critical))]/10 p-4 shadow-sm animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            {checking ? (
              <Loader2 className="h-5 w-5 text-[hsl(var(--critical))] animate-spin" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-[hsl(var(--critical))]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[hsl(var(--critical))]">
              {checking
                ? "Verificando deploy…"
                : `Deploy desactualizado: ${failed.length} iconos en 404`}
            </h3>
            {!checking && (
              <>
                <p className="text-xs text-foreground/80 mt-1 leading-relaxed">
                  Los iconos están en el repositorio pero el CDN sigue sirviendo la versión vieja.
                  Pulsa <strong>Publish → Update</strong> en la esquina superior derecha para subir
                  los cambios.
                </p>
                <ul className="mt-2 space-y-0.5">
                  {failed.map((path) => (
                    <li
                      key={path}
                      className="text-[11px] font-mono text-[hsl(var(--critical))] truncate"
                    >
                      ✗ {path}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={runCheck}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--critical))] px-3 py-1.5 text-xs font-bold text-white hover:bg-[hsl(var(--critical))]/90 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  Reintentar verificación
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 -mr-1 -mt-1 h-7 w-7 rounded-full flex items-center justify-center hover:bg-[hsl(var(--critical))]/20 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4 text-[hsl(var(--critical))]" />
          </button>
        </div>
      </div>
    </div>
  );
}
