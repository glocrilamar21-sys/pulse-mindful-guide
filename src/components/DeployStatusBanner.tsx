import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  X,
  Rocket,
} from "lucide-react";

const POLL_INTERVAL_MS = 30_000;
const RETRY_FLAG_KEY = "deploy-retry-pending";

interface RetryFlag {
  requestedAt: string;
  failedAssets: string[];
  failedCount: number;
}

function readRetryFlag(): RetryFlag | null {
  try {
    const raw = localStorage.getItem(RETRY_FLAG_KEY);
    return raw ? (JSON.parse(raw) as RetryFlag) : null;
  } catch {
    return null;
  }
}

function writeRetryFlag(flag: RetryFlag) {
  try {
    localStorage.setItem(RETRY_FLAG_KEY, JSON.stringify(flag));
  } catch {
    /* ignore quota errors */
  }
}

function clearRetryFlag() {
  try {
    localStorage.removeItem(RETRY_FLAG_KEY);
  } catch {
    /* ignore */
  }
}

function isProductionHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  // Production = published lovable.app domain (no "id-preview--" prefix) or custom domain.
  if (host.includes("id-preview--")) return false;
  if (host === "localhost" || host === "127.0.0.1") return false;
  return true;
}

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
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [justRecovered, setJustRecovered] = useState(false);
  const prevFailedCountRef = useRef<number | null>(null);
  const inFlightRef = useRef(false);

  const runCheck = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setChecking(true);
    const { failed } = await countFailures();
    setFailed(failed);
    setLastChecked(new Date());
    setChecking(false);
    inFlightRef.current = false;

    // Detect recovery: previously had failures, now all green
    if (
      prevFailedCountRef.current !== null &&
      prevFailedCountRef.current > 0 &&
      failed.length === 0
    ) {
      setJustRecovered(true);
      setTimeout(() => setJustRecovered(false), 6000);
    }
    prevFailedCountRef.current = failed.length;
  }, []);

  // Initial + periodic background polling
  useEffect(() => {
    runCheck();
    const id = window.setInterval(runCheck, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [runCheck]);

  // Re-check when tab becomes visible or connection comes back
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") runCheck();
    };
    const onOnline = () => runCheck();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onOnline);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("focus", onVisible);
    };
  }, [runCheck]);

  if (dismissed) return null;

  // Show transient success banner when assets recover
  if (justRecovered) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-3 md:max-w-2xl">
        <div className="rounded-2xl border-2 border-[hsl(var(--flexible))] bg-[hsl(var(--flexible))]/10 p-4 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--flexible))] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[hsl(var(--flexible-foreground))]">
                ✓ Deploy actualizado: los 7 assets responden 200
              </h3>
              <p className="text-xs text-foreground/80 mt-1">
                El CDN ya está sirviendo los iconos nuevos.
              </p>
            </div>
            <button
              onClick={() => setJustRecovered(false)}
              className="shrink-0 -mr-1 -mt-1 h-7 w-7 rounded-full flex items-center justify-center hover:bg-[hsl(var(--flexible))]/20 transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4 text-[hsl(var(--flexible-foreground))]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!checking && failed.length === 0) return null;

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
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <button
                    onClick={runCheck}
                    disabled={checking}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--critical))] px-3 py-1.5 text-xs font-bold text-white hover:bg-[hsl(var(--critical))]/90 transition-colors disabled:opacity-60"
                  >
                    {checking ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                    Reintentar verificación
                  </button>
                  {lastChecked && (
                    <span className="text-[10px] text-foreground/60">
                      Auto-revisión cada 30s · última {lastChecked.toLocaleTimeString()}
                    </span>
                  )}
                </div>
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
