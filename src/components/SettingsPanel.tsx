import { useRef, useState } from "react";
import { playDemoSound, playPresetDemo } from "@/lib/tasks";
import { useI18n, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Volume2, VolumeX, Globe, Palette, Brain, Vibrate, Play, Gamepad2, Trash2, Award } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { themes, loadTheme, saveTheme, applyTheme } from "@/lib/themes";
import { loadMascotOutfit, saveMascotOutfit } from "@/lib/mascot";
import { MascotGallery } from "@/components/MascotGallery";
import { AutoMascotSettings } from "@/components/AutoMascotSettings";
import {
  criticalPresets,
  flexiblePresets,
  loadCriticalPreset,
  loadFlexiblePreset,
  saveCriticalPreset,
  saveFlexiblePreset,
} from "@/lib/soundPresets";
import {
  loadGameSoundsEnabled,
  saveGameSoundsEnabled,
  loadGameVolume,
  saveGameVolume,
  playGameSound,
} from "@/lib/gameSounds";
import { Slider } from "@/components/ui/slider";
import { clearBestScores } from "@/lib/memoryGames";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

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
  const [gameSoundsEnabled, setGameSoundsEnabled] = useState(loadGameSoundsEnabled);
  const [gameVolume, setGameVolume] = useState(loadGameVolume);
  const volumeDebounceRef = useRef<number | null>(null);
  const { toast } = useToast();

  const handleResetMedals = () => {
    clearBestScores();
    toast({ title: t("resetGameProgressDone") });
  };

  const handleGameSoundsToggle = (enabled: boolean) => {
    setGameSoundsEnabled(enabled);
    saveGameSoundsEnabled(enabled);
    if (enabled) {
      // Tiny preview so the user hears the change.
      playGameSound("match");
    }
  };

  const handleVolumeChange = (val: number[]) => {
    const v = val[0] ?? 0;
    setGameVolume(v);
    saveGameVolume(v);
    // Debounced preview to avoid spamming sounds while dragging.
    if (volumeDebounceRef.current) window.clearTimeout(volumeDebounceRef.current);
    volumeDebounceRef.current = window.setTimeout(() => {
      if (gameSoundsEnabled && v > 0) playGameSound("tap");
    }, 180);
  };

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
          {t("mascot")}
        </h3>
        <MascotGallery currentOutfit={currentOutfit} onChange={handleOutfitChange} />
      </div>

      {/* Auto mascot per task scope */}
      <AutoMascotSettings />

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
                  <span className="text-xs">{t(preset.nameKey as TranslationKey)}</span>
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
                  <span className="text-xs">{t(preset.nameKey as TranslationKey)}</span>
                  {isActive && <Play className="h-3 w-3 ml-auto text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Game Sounds Toggle */}
      <div>
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-foreground">
          <Gamepad2 className="h-4 w-4" />
          {t("gameSoundsTitle")}
        </h3>
        <label className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-3 cursor-pointer hover:bg-muted/60 transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            {gameSoundsEnabled ? (
              <Volume2 className="h-4 w-4 text-primary shrink-0" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground leading-tight">
                {gameSoundsEnabled ? t("gameSoundsOn") : t("gameSoundsOff")}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                {t("gameSoundsDesc")}
              </p>
            </div>
          </div>
          <Switch
            checked={gameSoundsEnabled}
            onCheckedChange={handleGameSoundsToggle}
          />
        </label>

        {/* Volume slider — only meaningful when sounds enabled */}
        <div
          className={cn(
            "mt-2 rounded-xl bg-muted/40 px-3 py-3 transition-opacity",
            !gameSoundsEnabled && "opacity-50 pointer-events-none",
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5" />
              {t("gameVolume")}
            </span>
            <span className="text-xs font-bold tabular-nums text-primary">
              {gameVolume}%
            </span>
          </div>
          <Slider
            value={[gameVolume]}
            onValueChange={handleVolumeChange}
            min={0}
            max={100}
            step={5}
            disabled={!gameSoundsEnabled}
            aria-label={t("gameVolume")}
          />
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

      {/* Reset Game Progress */}
      <div>
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-foreground">
          <Award className="h-4 w-4" />
          {t("resetGameProgress")}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">{t("resetGameProgressDesc")}</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full gap-2 text-sm font-bold cursor-pointer rounded-lg active:scale-95 transition-transform border-[hsl(var(--critical))]/30 text-[hsl(var(--critical))] hover:bg-[hsl(var(--critical))]/10 hover:text-[hsl(var(--critical))]"
            >
              <Trash2 className="h-4 w-4" />
              {t("resetGameProgressButton")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("resetGameProgressConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("resetGameProgressConfirmDesc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetMedals}
                className="bg-[hsl(var(--critical))] text-[hsl(var(--critical-foreground))] hover:bg-[hsl(var(--critical))]/90"
              >
                {t("resetGameProgressConfirmAction")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
