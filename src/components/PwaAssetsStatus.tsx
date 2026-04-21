import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type AssetStatus = "pending" | "ok" | "fail";

interface AssetCheck {
  path: string;
  label: string;
  status: AssetStatus;
  httpStatus?: number;
  error?: string;
}

const ASSETS: Omit<AssetCheck, "status">[] = [
  { path: "/manifest.json", label: "Manifest" },
  { path: "/favicon.png", label: "Favicon" },
  { path: "/apple-touch-icon.png", label: "Apple Touch Icon" },
  { path: "/icon-192.png", label: "Icon 192" },
  { path: "/icon-512.png", label: "Icon 512" },
  { path: "/icon-maskable-192.png", label: "Icon Maskable 192" },
  { path: "/icon-maskable-512.png", label: "Icon Maskable 512" },
];

async function checkAsset(path: string): Promise<{ status: AssetStatus; httpStatus?: number; error?: string }> {
  try {
    const res = await fetch(path, { method: "GET", cache: "no-store" });
    if (res.ok) return { status: "ok", httpStatus: res.status };
    return { status: "fail", httpStatus: res.status };
  } catch (err) {
    return { status: "fail", error: err instanceof Error ? err.message : "Network error" };
  }
}

export function PwaAssetsStatus() {
  const [checks, setChecks] = useState<AssetCheck[]>(
    ASSETS.map((a) => ({ ...a, status: "pending" as AssetStatus })),
  );
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

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
