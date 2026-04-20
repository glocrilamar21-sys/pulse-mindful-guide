import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISSED_KEY = "pulso-install-dismissed-at";
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS Safari
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window.navigator as any).standalone === true) return true;
  return window.matchMedia?.("(display-mode: standalone)").matches ?? false;
}

function recentlyDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_COOLDOWN_MS;
  } catch {
    return false;
  }
}

export function InstallPrompt() {
  const { t } = useI18n();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
      try {
        localStorage.removeItem(DISMISSED_KEY);
      } catch {
        /* noop */
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "dismissed") {
        try {
          localStorage.setItem(DISMISSED_KEY, String(Date.now()));
        } catch {
          /* noop */
        }
      }
    } catch {
      /* noop */
    } finally {
      setDeferred(null);
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      /* noop */
    }
    setVisible(false);
  };

  if (!visible || !deferred) return null;

  return (
    <div
      className="fixed left-1/2 z-30 -translate-x-1/2 animate-fade-in"
      style={{ bottom: "max(8.5rem, calc(7.5rem + env(safe-area-inset-bottom)))" }}
    >
      <div className="flex items-center gap-2 rounded-full bg-card pl-2 pr-1 py-1 shadow-lg shadow-primary/20 border border-border">
        <button
          onClick={handleInstall}
          className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
          aria-label={t("installApp")}
        >
          <Download className="h-4 w-4" />
          <span>{t("installApp")}</span>
        </button>
        <button
          onClick={handleDismiss}
          className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label={t("installDismiss")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
