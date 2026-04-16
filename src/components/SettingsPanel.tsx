import { useState } from "react";
import { playDemoSound, playPresetDemo } from "@/lib/tasks";
import { useI18n, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Volume2, Globe, Palette, Brain, Vibrate, Play } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { themes, loadTheme, saveTheme, applyTheme } from "@/lib/themes";
import { mascotOutfits, loadMascotOutfit, saveMascotOutfit, getMascotImage } from "@/lib/mascot";
import {
  criticalPresets,
  flexiblePresets,
  loadCriticalPreset,
  loadFlexiblePreset,
  saveCriticalPreset,
  saveFlexiblePreset,
} from "@/lib/soundPresets";

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
  const [currentOutfit, setCurrentOutfit] = useState(loadMascotOutfit);
  const [criticalPresetId, setCriticalPresetId] = useState(loadCriticalPreset);
  const [flexiblePresetId, setFlexiblePresetId] = useState(loadFlexiblePreset);

  const handleThemeChange = (id: string) => {
    setCurrentTheme(id);
    saveTheme(id);
    applyTheme(id);
  };

  const handleOutfitChange = (id: string) => {
    setCurrentOutfit(id);
    saveMascotOutfit(id);
  };

  const handleCriticalPresetChange = (id: string) => {
    setCriticalPresetId(id);
    saveCriticalPreset(id);
    const preset = criticalPresets.find((p) => p.id === id);
    if (preset) playPresetDemo(preset);
  };

  const handleFlexiblePresetChange = (id: string) => {
    setFlexiblePresetId(id);
    saveFlexiblePreset(id);
    const preset = flexiblePresets.find((p) => p.id === id);
    if (preset) playPresetDemo(preset);
  };

  return (
    <div className="space-y-5">
      {/* Mascot Outfit Picker */}
      <div>
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-foreground">
          <Brain className="h-4 w-4" />
          Mascota
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {mascotOutfits.map((outfit) => {
            const isActive = currentOutfit === outfit.id;
            return (
              <button
                key={outfit.id}
                onClick={() => handleOutfitChange(outfit.id)}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-xl px-3 py-4 transition-all cursor-pointer",
                  isActive
                    ? "ring-2 ring-primary shadow-md scale-105 bg-accent"
                    : "bg-muted/50 hover:bg-muted"
                )}
              >
                <div className="flex gap-1">
                  <img src={getMascotImage(outfit.id, "happy")} alt="" className="h-10 w-10 object-contain" />
                  <img src={getMascotImage(outfit.id, "worried")} alt="" className="h-10 w-10 object-contain" />
                </div>
                <span className="text-xs font-semibold text-foreground">
                  {outfit.emoji} {outfit.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sound & Vibration Presets */}
      <div>
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-foreground">
          <Vibrate className="h-4 w-4" />
          {t("soundPresets")}
        </h3>

        {/* Critical Sound Picker */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-[hsl(var(--critical))] mb-1.5 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {t("criticalSounds")}
          </p>
          <p className="text-[10px] text-muted-foreground mb-2">{t("criticalSoundsDesc")}</p>
          <div className="grid grid-cols-2 gap-2">
            {criticalPresets.map((preset) => {
              const isActive = criticalPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleCriticalPresetChange(preset.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all cursor-pointer text-sm font-semibold",
                    isActive
                      ? "ring-2 ring-[hsl(var(--critical))] shadow-md bg-[hsl(var(--critical))]/10 text-foreground scale-105"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span className="text-lg">{preset.emoji}</span>
                  <span className="text-xs">{t(preset.nameKey as any)}</span>
                  {isActive && <Play className="h-3 w-3 ml-auto text-[hsl(var(--critical))]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Flexible Sound Picker */}
        <div>
          <p className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {t("flexibleSounds")}
          </p>
          <p className="text-[10px] text-muted-foreground mb-2">{t("flexibleSoundsDesc")}</p>
          <div className="grid grid-cols-2 gap-2">
            {flexiblePresets.map((preset) => {
              const isActive = flexiblePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleFlexiblePresetChange(preset.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all cursor-pointer text-sm font-semibold",
                    isActive
                      ? "ring-2 ring-primary shadow-md bg-primary/10 text-foreground scale-105"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span className="text-lg">{preset.emoji}</span>
                  <span className="text-xs">{t(preset.nameKey as any)}</span>
                  {isActive && <Play className="h-3 w-3 ml-auto text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Theme Picker */}
      <div>
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-foreground">
          <Palette className="h-4 w-4" />
          Tema
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((theme) => {
            const isActive = currentTheme === theme.id;
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
                <div className="flex gap-1">
                  <div className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: `hsl(${primaryHsl})` }} />
                  <div className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: `hsl(${bgHsl})` }} />
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

      {/* Notifications */}
      {isNotificationSupported() && (
        <div>
          <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-foreground">
            <BellRing className="h-4 w-4" />
            {t("notifications")}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">{t("notificationsDesc")}</p>
          {notifPermission === "denied" ? (
            <p className="text-xs text-destructive font-semibold">{t("notificationsBlocked")}</p>
          ) : (
            <Button
              onClick={handleToggleNotifications}
              size="lg"
              className={cn(
                "h-12 w-full gap-2 text-sm font-bold cursor-pointer rounded-lg active:scale-95 transition-transform",
                notifEnabled
                  ? "bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/80 text-white"
                  : "bg-primary hover:bg-primary/80 text-primary-foreground"
              )}
            >
              <BellRing className="h-4 w-4" />
              {notifEnabled ? t("notificationsActive") : t("enableNotifications")}
            </Button>
          )}
        </div>
      )}

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
