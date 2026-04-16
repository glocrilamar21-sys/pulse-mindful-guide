import { playDemoSound } from "@/lib/tasks";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Volume2, Globe } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  trigger?: React.ReactNode;
  inline?: boolean;
}

function SettingsContent() {
  const { t, locale, setLocale } = useI18n();

  return (
    <div className="space-y-5">
      {/* Language Switcher */}
      <div>
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-foreground">
          <Globe className="h-4 w-4" />
          {t("language")}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLocale("es")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm",
              locale === "es"
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            🇪🇸 {t("spanish")}
          </button>
          <button
            onClick={() => setLocale("en")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm",
              locale === "en"
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            🇺🇸 {t("english")}
          </button>
        </div>
      </div>

      {/* Test Alerts */}
      <div>
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-foreground">
          <Volume2 className="h-4 w-4" />
          {t("testAlerts")}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">{t("testAlertsDesc")}</p>
        <div className="space-y-2">
          <Button
            onClick={() => playDemoSound("critical")}
            size="lg"
            className="h-12 w-full gap-2 bg-critical hover:bg-critical/80 text-critical-foreground text-sm font-bold cursor-pointer rounded-lg active:scale-95 transition-transform"
          >
            <AlertTriangle className="h-4 w-4" />
            {t("criticalAlert")}
          </Button>
          <Button
            onClick={() => playDemoSound("flexible")}
            size="lg"
            className="h-12 w-full gap-2 bg-primary hover:bg-primary/80 text-primary-foreground text-sm font-bold cursor-pointer rounded-lg active:scale-95 transition-transform"
          >
            <Clock className="h-4 w-4" />
            {t("flexibleAlert")}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-background">
        <h4 className="font-bold text-sm mb-1">{t("aboutApp")}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{t("aboutDesc")}</p>
      </div>
    </div>
  );
}

export function SettingsPanel({ trigger, inline }: SettingsPanelProps) {
  if (inline) return <SettingsContent />;

  return (
    <Sheet>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full cursor-pointer">
            <Volume2 className="h-4 w-4" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold">{t("tabSettings")}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <SettingsContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
