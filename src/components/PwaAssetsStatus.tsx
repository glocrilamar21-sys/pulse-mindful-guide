import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ShieldCheck,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type AssetStatus = "pending" | "ok" | "fail";

interface AssetCheck {
  path: string;
  label: string;
  status: AssetStatus;
  httpStatus?: number;
  error?: string;
}

const ASSET_VERSION = "6";

const ASSETS: Omit<AssetCheck, "status">[] = [
  { path: "/manifest.json", label: "Manifest" },
  { path: "/favicon.png", label: "Favicon" },
  { path: "/apple-touch-icon.png", label: "Apple Touch Icon" },
  { path: "/icon-192.png", label: "Icon 192" },
  { path: "/icon-512.png", label: "Icon 512" },
  { path: "/icon-maskable-192.png", label: "Icon Maskable 192" },
  { path: "/icon-maskable-512.png", label: "Icon Maskable 512" },
];

function withVersion(path: string): string {
  return `${path}${path.includes("?") ? "&" : "?"}v=${ASSET_VERSION}&t=${Date.now()}`;
}

async function checkAsset(path: string): Promise<{ status: AssetStatus; httpStatus?: number; error?: string }> {
  try {
    const res = await fetch(withVersion(path), { method: "GET", cache: "no-store" });
    if (res.ok) return { status: "ok", httpStatus: res.status };
    return { status: "fail", httpStatus: res.status };
  } catch (err) {
    return { status: "fail", error: err instanceof Error ? err.message : "Network error" };
  }
}

/**
 * Forces the browser (and any registered service worker) to re-fetch the
 * manifest and icon assets with a fresh ?v=6 cache-bust. This does not change
 * what the CDN serves — only ensures the current tab/PWA loads the latest
 * version that production already has.
 */
async function forceRefreshIcons(): Promise<{ refreshed: number; failed: number }> {
  let refreshed = 0;
  let failed = 0;

  // 1. Re-fetch each asset bypassing all caches
  await Promise.all(
    ASSETS.map(async (a) => {
      try {
        const res = await fetch(withVersion(a.path), { method: "GET", cache: "reload" });
        if (res.ok) refreshed += 1;
        else failed += 1;
      } catch {
        failed += 1;
      }
    }),
  );

  // 2. Swap the live <link rel="manifest"> href so the browser reloads it
  const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
  if (manifestLink) {
    manifestLink.href = withVersion("/manifest.json");
  }

  // 3. Swap favicon / apple-touch-icon hrefs to force the tab icon to refresh
  document
    .querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="apple-touch-icon"]')
    .forEach((link) => {
      const url = new URL(link.href, window.location.origin);
      link.href = `${url.pathname}?v=${ASSET_VERSION}&t=${Date.now()}`;
    });

  // 4. If a service worker is active, ask it to update so it picks up new assets
  if ("serviceWorker" in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.update()));
    } catch {
      /* ignore */
    }
  }

  return { refreshed, failed };
}

export function PwaAssetsStatus() {
  const [checks, setChecks] = useState<AssetCheck[]>(
    ASSETS.map((a) => ({ ...a, status: "pending" as AssetStatus })),
  );
  const [running, setRunning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const runChecks = useCallback(async () => {
    setRunning(true);
    setChecks(ASSETS.map((a) => ({ ...a, status: "pending" })));
    const results = await Promise.all(
      ASSETS.map(async (a) => {
        const r = await checkAsset(a.path);
        return { ...a, ...r } as AssetCheck;
      }),
    );
    setChecks(results);
    setLastRun(new Date());
    setRunning(false);
  }, []);

  const handleForceRefresh = useCallback(async () => {
    setRefreshing(true);
    const { refreshed, failed } = await forceRefreshIcons();
    setLastRefresh(new Date());
    setRefreshing(false);

    if (failed === 0) {
      toast({
        title: "Iconos actualizados",
        description: `${refreshed}/${ASSETS.length} assets recargados con ?v=${ASSET_VERSION}. El nombre "Memory Help" y los iconos están al día.`,
      });
    } else {
      toast({
        title: "Recarga parcial",
        description: `${refreshed} OK · ${failed} fallaron. Si persiste, pulsa Publish → Update para actualizar el CDN.`,
        variant: "destructive",
      });
    }

    // Re-run the diagnostic to reflect the fresh state
    await runChecks();
  }, [runChecks]);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  const okCount = checks.filter((c) => c.status === "ok").length;
  const failCount = checks.filter((c) => c.status === "fail").length;
  const allOk = okCount === checks.length;

  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-base font-bold text-foreground">Estado de iconos (PWA)</h3>
            <p className="text-xs text-muted-foreground">
              Verifica que el manifest y los iconos estén accesibles.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={runChecks}
          disabled={running}
          className="shrink-0"
        >
          {running ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-1">Reintentar</span>
        </Button>
      </div>

      <div
        className={`rounded-xl border p-3 text-sm font-semibold ${
          running
            ? "border-border bg-muted text-muted-foreground"
            : allOk
              ? "border-[hsl(var(--flexible))] bg-[hsl(var(--flexible))]/10 text-[hsl(var(--flexible-foreground))]"
              : "border-[hsl(var(--critical))] bg-[hsl(var(--critical))]/10 text-[hsl(var(--critical))]"
        }`}
      >
        {running
          ? "Validando assets…"
          : allOk
            ? `✓ Todos los assets están desplegados (${okCount}/${checks.length})`
            : `⚠ ${failCount} assets fallan (${okCount}/${checks.length} OK)`}
      </div>

      <ul className="space-y-2">
        {checks.map((c) => (
          <li
            key={c.path}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              {c.status === "pending" && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
              )}
              {c.status === "ok" && (
                <CheckCircle2 className="h-4 w-4 text-[hsl(var(--flexible))] shrink-0" />
              )}
              {c.status === "fail" && (
                <XCircle className="h-4 w-4 text-[hsl(var(--critical))] shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{c.label}</p>
                <p className="text-xs text-muted-foreground truncate">{c.path}</p>
              </div>
            </div>
            <span
              className={`text-xs font-bold tabular-nums shrink-0 ${
                c.status === "ok"
                  ? "text-[hsl(var(--flexible))]"
                  : c.status === "fail"
                    ? "text-[hsl(var(--critical))]"
                    : "text-muted-foreground"
              }`}
            >
              {c.status === "pending"
                ? "…"
                : c.httpStatus
                  ? `HTTP ${c.httpStatus}`
                  : c.error ?? "ERR"}
            </span>
          </li>
        ))}
      </ul>

      {lastRun && (
        <p className="text-[10px] text-muted-foreground text-right">
          Última verificación: {lastRun.toLocaleTimeString()}
        </p>
      )}
    </section>
  );
}
