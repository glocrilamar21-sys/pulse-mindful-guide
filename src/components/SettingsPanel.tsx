import { useState } from "react";
import { playDemoSound } from "@/lib/tasks";
import { useI18n, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Volume2, Globe, Palette } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { themes, loadTheme, saveTheme, applyTheme } from "@/lib/themes";

interface SettingsPanelProps {
  trigger?: React.ReactNode;
  inline?: boolean;
}

const languages: { id: Locale; flag: string; labelKey: "spanish" | "english" | "portuguese" | "french" | "italian" }[] = [
  { id: "es", flag: "🇪🇸", labelKey: "spanish" },
  { id: "en", flag: "🇺🇸", labelKey: "english" },
  { id: "pt", flag: "🇧🇷", labelKey: "portuguese" },
  { id: "fr", flag: "🇫🇷", labelKey: "french" },
  { id: "it", flag: "🇮🇹", labelKey: "italian" },
];

function SettingsContent() {
  const { t, locale, setLocale } = useI18n();
  const [currentTheme, setCurrentTheme] = useState(loadTheme);

  const handleThemeChange = (id: string) => {
    setCurrentTheme(id);
    saveTheme(id);
    applyTheme(id);
  };

  return (
    <div className="space-y-5">
      {/* Theme Picker */}
      <div>
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-foreground">
          <Palette className="h-4 w-4" />
          Tema
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((theme) => {
            const isActive = currentTheme === theme.id;
            // Show a preview swatch of the theme's primary color
            const primaryHsl = theme.colors.primary;
            const bgHsl = theme.colors.background;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 transition-all cursor-pointer text-sm font-semibold",
                  isActive
                    ? "ring-2 ring-primary shadow-md scale-105 bg-accent text-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {/* Color swatch */}
                <div className="flex gap-1">
                  <div
                    className="h-5 w-5 rounded-full border border-black/10"
                    style={{ backgroundColor: `hsl(${primaryHsl})` }}
                  />
                  <div
                    className="h-5 w-5 rounded-full border border-black/10"
                    style={{ backgroundColor: `hsl(${bgHsl})` }}
                  />
                </div>
                <span className="text-xs">{theme.emoji} {theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Switcher */}
      <div>
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-foreground">
          <Globe className="h-4 w-4" />
          {t("language")}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLocale(lang.id)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl px-4 py-3 transition-all cursor-pointer font-semibold text-sm",
                locale === lang.id
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {lang.flag} {t(lang.labelKey)}
            </button>
          ))}
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
          <SheetTitle className="text-lg font-bold">Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <SettingsContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
